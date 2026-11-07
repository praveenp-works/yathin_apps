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

async function useBlob(blob) { imgBlob = blob; $("pic").src = URL.createObjectURL(blob); $("pic").hidden = false; await readLocal(); }

async function cropShot(shot) {
  const blob = await (await fetch(shot.dataUrl)).blob();
  if (!shot.rect) return blob;
  const bmp = await createImageBitmap(blob); const r = shot.rect;
  const sx = bmp.width / r.vw, sy = bmp.height / r.vh;
  const w = Math.max(1, Math.round(r.w * sx)), h = Math.max(1, Math.round(r.h * sy));
  const c = new OffscreenCanvas(w, h); c.getContext("2d").drawImage(bmp, Math.round(r.x * sx), Math.round(r.y * sy), w, h, 0, 0, w, h);
  return c.convertToBlob({ type: "image/png" });
}

$("fileIn").onchange = (e) => { const f = e.target.files[0]; if (f) useBlob(f); };
document.addEventListener("paste", (e) => { const it = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/")); if (it) { e.preventDefault(); useBlob(it.getAsFile()); } });
const drop = $("drop");
["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("on"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("on")));
drop.addEventListener("drop", (e) => { e.preventDefault(); const f = [...e.dataTransfer.files].find((f) => f.type.startsWith("image/")); if (f) useBlob(f); });

(async () => {
  const { shot } = await chrome.storage.session.get("shot");
  if (shot) { await chrome.storage.session.remove("shot"); if (shot.title) document.title = "Screen Read · " + shot.title; useBlob(await cropShot(shot)); }
  else status("Add a picture to start.");
})();
