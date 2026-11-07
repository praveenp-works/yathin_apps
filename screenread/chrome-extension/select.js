// Draw a box on the page; send its position back so the background can capture and crop.
(() => {
  if (window.__srSelecting) return; window.__srSelecting = true;
  const z = 2147483647;
  const veil = document.createElement("div");
  veil.style.cssText = `position:fixed;inset:0;z-index:${z};cursor:crosshair;background:rgba(15,23,42,.28);user-select:none`;
  const box = document.createElement("div");
  box.style.cssText = `position:fixed;z-index:${z};border:2px solid #facc15;background:rgba(250,204,21,.12);box-shadow:0 0 0 9999px rgba(15,23,42,.28);display:none;border-radius:4px;pointer-events:none`;
  const tip = document.createElement("div");
  tip.textContent = "Drag a box around the text. Esc to cancel.";
  tip.style.cssText = `position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:${z};background:#111;color:#fff;font:600 14px/1.2 system-ui,sans-serif;padding:10px 16px;border-radius:999px;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.25)`;
  document.documentElement.append(veil, box, tip);
  let sx = 0, sy = 0, down = false;
  const done = () => { veil.remove(); box.remove(); tip.remove(); window.removeEventListener("keydown", onKey, true); window.__srSelecting = false; };
  const onKey = (e) => { if (e.key === "Escape") { e.preventDefault(); done(); } };
  window.addEventListener("keydown", onKey, true);
  veil.addEventListener("mousedown", (e) => { e.preventDefault(); down = true; sx = e.clientX; sy = e.clientY; box.style.display = "block"; veil.style.background = "transparent"; draw(e); });
  const draw = (e) => { const x = Math.min(sx, e.clientX), y = Math.min(sy, e.clientY), w = Math.abs(e.clientX - sx), h = Math.abs(e.clientY - sy); Object.assign(box.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" }); return { x, y, w, h }; };
  veil.addEventListener("mousemove", (e) => { if (down) draw(e); });
  veil.addEventListener("mouseup", (e) => {
    if (!down) return; down = false;
    const r = draw(e); done();
    if (r.w < 8 || r.h < 8) return;
    const rect = { x: r.x, y: r.y, w: r.w, h: r.h, vw: window.innerWidth, vh: window.innerHeight };
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => chrome.runtime.sendMessage({ type: "picked", rect }), 60)));
  });
})();
