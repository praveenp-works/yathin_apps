/* Yathin Apps: one Gemini API key for every app, saved on this device only */
(function () {
  var K = "ya-gemini-key", OLD = ["plantdoc-key", "fridgechef-key"];
  function get() { try { return localStorage.getItem(K) || OLD.map(function (k) { return localStorage.getItem(k); }).filter(Boolean)[0] || ""; } catch (e) { return ""; } }
  function set(v) { try { [K].concat(OLD).forEach(function (k) { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); }); } catch (e) {} }
  window.yaKey = { get: get, set: set };
  var btn = document.getElementById("ya-key-btn");
  if (!btn) return;
  var css = document.createElement("style");
  css.textContent = ".yk-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px}.yk-box{background:#fff;color:#111;border-radius:22px;max-width:440px;width:100%;padding:26px;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.3)}.yk-box h2{margin:0 0 6px;font-size:22px}.yk-box p{margin:0 0 14px;color:#555;line-height:1.5;font-size:14px}.yk-box a{color:#0a66ff}.yk-box input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #ccc;border-radius:12px;font-size:15px}.yk-row{display:flex;gap:10px;margin-top:14px}.yk-row button{flex:1;padding:12px;border-radius:999px;border:0;font-weight:600;font-size:15px;cursor:pointer}.yk-save{background:#111;color:#fff}.yk-del{background:#eee;color:#111}.yk-msg{min-height:18px;margin-top:10px;font-size:13px;color:#0a7a2f}.yk-msg.bad{color:#c0262d}.yk-close{float:right;background:none;border:0;font-size:22px;cursor:pointer;color:#777}";
  document.head.appendChild(css);
  function open() {
    var ov = document.createElement("div"); ov.className = "yk-ov";
    ov.innerHTML = '<div class="yk-box" role="dialog" aria-label="Gemini API key"><button class="yk-close" aria-label="Close">×</button><h2>Your Gemini API key</h2><p>Add it once here and every Yathin App that uses AI (Fridge Chef, Plant Doc and new ones) picks it up. Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. It stays on this device only.</p><input id="yk-v" type="password" placeholder="Paste your Gemini API key" autocomplete="off"><div class="yk-row"><button class="yk-save" type="button">Save key</button><button class="yk-del" type="button">Remove</button></div><div class="yk-msg" id="yk-m"></div></div>';
    document.body.appendChild(ov);
    var v = ov.querySelector("#yk-v"), m = ov.querySelector("#yk-m");
    v.value = get();
    m.textContent = get() ? "A key is saved on this device." : "";
    function close() { ov.remove(); }
    ov.onclick = function (e) { if (e.target === ov) close(); };
    ov.querySelector(".yk-close").onclick = close;
    ov.querySelector(".yk-save").onclick = function () {
      var k = v.value.trim();
      if (k.length < 20 || /\s/.test(k)) { m.className = "yk-msg bad"; m.textContent = "That key looks too short. Copy the whole key."; return; }
      set(k); m.className = "yk-msg"; m.textContent = "Saved. All your apps will use this key.";
      btn.textContent = "API key ✓";
    };
    ov.querySelector(".yk-del").onclick = function () { set(""); v.value = ""; m.className = "yk-msg"; m.textContent = "Key removed from this device."; btn.textContent = "API key"; };
    v.focus();
  }
  if (get()) btn.textContent = "API key ✓";
  btn.addEventListener("click", open);
  if (location.hash === "#api-key") open();
})();
