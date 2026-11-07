const $ = (id) => document.getElementById(id);
let imgBlob = null, worker = null, busy = false;
const KEY = "ya-gemini-key";
const status = (t) => { $("status").textContent = t || ""; };
const prog = (p) => { $("prog").hidden = p == null; $("progBar").style.width = Math.round((p || 0) * 100) + "%"; };
function setText(t) { $("out").value = t; $("copy").disabled = !t.trim(); const w = t.trim() ? t.trim().split(/\s+/).length : 0; $("count").textContent = w ? `${w} words` : ""; }

async function getWorker() {
  if (worker) return worker;
  worker = await Tesseract.createWorker("eng", 1, {
    workerPath: chrome.runtime.getURL("lib/worker.min.js"),
    corePath: chrome.runtime.getURL("lib/"),
    langPath: chrome.runtime.getURL("lib/"),
    workerBlobURL: false,
    gzip: true,
    logger: (m) => { if (m.status === "recognizing text") { prog(m.progress); status("Reading text…"); } else if (/load|initializ/.test(m.status)) status("Getting ready…"); },
  });
  return worker;
}

async function upscale(blob) {
  // Small screenshots read better when enlarged 2x.
  const bmp = await createImageBitmap(blob);
  const s = bmp.width < 1400 ? 2 : 1;
  const c = new OffscreenCanvas(bmp.width * s, bmp.height * s);
  const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(bmp, 0, 0, c.width, c.height);
  return c.convertToBlob({ type: "image/png" });
}

async function readLocal() {
  if (!imgBlob || busy) return; busy = true; setText(""); prog(0); status("Getting ready…");
  try {
    const w = await getWorker();
    const { data } = await w.recognize(await upscale(imgBlob));
    const t = (data.text || "").replace(/\n{3,}/g, "\n\n").trim();
    setText(t); status(t ? "Done. Read on your device." : "No text found. Try a bigger box, or Read with Gemini.");
  } catch (e) { status("Couldn't read it: " + (e.message || e)); }
  prog(null); busy = false;
}

function keyGet() { return new Promise((r) => chrome.storage.local.get(KEY, (o) => r((o && o[KEY]) || ""))); }
$("keyBtn").onclick = async () => { $("keyBox").hidden = !$("keyBox").hidden; $("keyIn").value = await keyGet(); };
function saveKey() { const k = $("keyIn").value.trim(); if (!k) return; chrome.storage.local.set({ [KEY]: k }, () => { $("keyBox").hidden = true; status("Gemini key saved ✓"); }); }
$("keySave").onclick = saveKey; $("keyIn").addEventListener("keydown", (e) => { if (e.key === "Enter") saveKey(); });

const b64 = (blob) => new Promise((r) => { const f = new FileReader(); f.onload = () => r(String(f.result).split(",")[1]); f.readAsDataURL(blob); });
async function gemini(body, key) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + encodeURIComponent(key);
  let r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (r.status === 400 && body.generationConfig && body.generationConfig.thinkingConfig) { delete body.generationConfig.thinkingConfig; r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
  const j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || r.status);
  return ((j.candidates || [])[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
}
$("gem").onclick = async () => {
  if (!imgBlob) { status("Add a picture first."); return; }
  const key = await keyGet(); if (!key) { $("keyBox").hidden = false; $("keyIn").focus(); status("Add your free Gemini key first."); return; }
  if (busy) return; busy = true; status("Asking Gemini…"); prog(0.3);
  try {
    const t = await gemini({ contents: [{ parts: [{ text: "Copy all the text in this image exactly, keeping line breaks. Output only the text, nothing else." }, { inline_data: { mime_type: "image/png", data: await b64(imgBlob) } }] }], generationConfig: { temperature: 0, thinkingConfig: { thinkingLevel: "low" } } }, key);
    setText(t); status(t ? "Done with Gemini." : "Gemini found no text.");
  } catch (e) { status("Gemini error: " + e.message); }
  prog(null); busy = false;
};

$("copy").onclick = async () => { await navigator.clipboard.writeText($("out").value); $("copy").textContent = "Copied ✓"; setTimeout(() => ($("copy").textContent = "Copy text"), 1500); };
$("out").addEventListener("input", () => setText($("out").value));

let fullBlob = null;
async function useBlob(blob) { imgBlob = blob; $("crop").hidden = true; $("pic").src = URL.createObjectURL(blob); $("pic").hidden = false; $("picBar").hidden = false; await readLocal(); }

// Crop mode: show the picture and let the user drag a box on it.
function startCrop(blob) {
  fullBlob = blob; $("pic").hidden = true; $("picBar").hidden = true; $("sel").hidden = true;
  $("cropImg").src = URL.createObjectURL(blob); $("crop").hidden = false; setText(""); status("Drag a box over the text.");
  $("crop").scrollIntoView({ block: "start" });
}
(() => {
  const st = $("stage"), sel = $("sel"); let down = false, sx = 0, sy = 0, box = null;
  const pt = (e) => { const r = st.getBoundingClientRect(); return [Math.max(0, Math.min(r.width, e.clientX - r.left)), Math.max(0, Math.min(r.height, e.clientY - r.top))]; };
  const draw = (e) => { const [x, y] = pt(e); box = { x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) }; Object.assign(sel.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" }); };
  st.addEventListener("pointerdown", (e) => { e.preventDefault(); st.setPointerCapture(e.pointerId); down = true; [sx, sy] = pt(e); sel.hidden = false; draw(e); });
  st.addEventListener("pointermove", (e) => { if (down) draw(e); });
  st.addEventListener("pointerup", async () => {
    if (!down) return; down = false;
    if (!box || box.w < 6 || box.h < 6) { sel.hidden = true; return; }
    const im = $("cropImg"), k = im.naturalWidth / im.clientWidth;
    const bmp = await createImageBitmap(fullBlob);
    const w = Math.max(1, Math.round(box.w * k)), h = Math.max(1, Math.round(box.h * k));
    const c = new OffscreenCanvas(w, h); c.getContext("2d").drawImage(bmp, Math.round(box.x * k), Math.round(box.y * k), w, h, 0, 0, w, h);
    useBlob(await c.convertToBlob({ type: "image/png" }));
  });
  $("cropAll").onclick = () => useBlob(fullBlob);
  $("cropCancel").onclick = () => { $("crop").hidden = true; if (imgBlob) { $("pic").hidden = false; $("picBar").hidden = false; } status(imgBlob ? "" : "Add a picture to start."); };
  $("recrop").onclick = () => startCrop(fullBlob || imgBlob);
})();

// Anywhere on screen: Chrome asks which screen or window to share, we grab one frame, then you drag the box.
function grabScreen() {
  status("Pick a screen or window to grab…");
  chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], async (id) => {
    if (!id) { status(imgBlob ? "" : "Cancelled. Add a picture to start."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: id, maxWidth: 3840, maxHeight: 2160 } } });
      const v = document.createElement("video"); v.muted = true; v.srcObject = stream; await v.play();
      await new Promise((ok) => setTimeout(ok, 350));
      const c = new OffscreenCanvas(v.videoWidth, v.videoHeight); c.getContext("2d").drawImage(v, 0, 0);
      stream.getTracks().forEach((t) => t.stop());
      startCrop(await c.convertToBlob({ type: "image/png" }));
    } catch (e) { status("Couldn't grab the screen: " + (e.message || e)); }
  });
}
$("grab").onclick = grabScreen; $("again").onclick = grabScreen;

async function cropShot(shot) {
  const blob = await (await fetch(shot.dataUrl)).blob();
  if (!shot.rect) return blob;
  const bmp = await createImageBitmap(blob); const r = shot.rect;
  const sx = bmp.width / r.vw, sy = bmp.height / r.vh;
  const w = Math.max(1, Math.round(r.w * sx)), h = Math.max(1, Math.round(r.h * sy));
  const c = new OffscreenCanvas(w, h); c.getContext("2d").drawImage(bmp, Math.round(r.x * sx), Math.round(r.y * sy), w, h, 0, 0, w, h);
  return c.convertToBlob({ type: "image/png" });
}

$("fileIn").onchange = (e) => { const f = e.target.files[0]; if (f) { fullBlob = f; useBlob(f); } };
document.addEventListener("paste", (e) => { const it = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/")); if (it) { e.preventDefault(); fullBlob = it.getAsFile(); useBlob(fullBlob); } });
const drop = $("drop");
["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("on"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("on")));
drop.addEventListener("drop", (e) => { e.preventDefault(); const f = [...e.dataTransfer.files].find((f) => f.type.startsWith("image/")); if (f) { fullBlob = f; useBlob(f); } });

(async () => {
  const { shot } = await chrome.storage.session.get("shot");
  if (shot) {
    await chrome.storage.session.remove("shot"); if (shot.title) document.title = "Screen Read · " + shot.title;
    fullBlob = await (await fetch(shot.dataUrl)).blob();
    if (shot.crop) startCrop(fullBlob); else useBlob(await cropShot(shot));
  } else if (/screen=1/.test(location.search)) grabScreen();
  else status("Add a picture to start.");
})();
