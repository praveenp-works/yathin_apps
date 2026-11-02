/* Yathin Apps: "Download" in the top bar -> sign in -> download. Created by Yathin Pedamallu. */
(function () {
  var me = document.currentScript;
  var APP = me.getAttribute("data-app"), URL = me.getAttribute("data-url"), ICON = me.getAttribute("data-icon") || "";
  var KEY = "ya_user", NEED = me.getAttribute("data-needs-key"), gotKey = false;
  var TOP = NEED ? '<p class="ya-need">Gemini API key needed</p>' : "";
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return window.__yaUser || null; } }
  function set(u) { try { localStorage.setItem(KEY, JSON.stringify(u)); } catch (e) { window.__yaUser = u; } }
  var css = document.createElement("style");
  css.textContent =
    ".ya-dl{cursor:pointer}" +
    ".ya-ov{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(10,10,12,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:16px;font-family:inherit}" +
    ".ya-ov.on{display:flex}" +
    ".ya-box{width:100%;max-width:400px;background:#fff;color:#1d1d1f;border-radius:24px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center}" +
    ".ya-box img{width:64px;height:64px;border-radius:16px;margin-bottom:8px}" +
    ".ya-box h2{margin:4px 0 6px;font-size:24px}.ya-box p{margin:0 0 16px;color:#6e6e73;font-size:14px;line-height:1.45}" +
    ".ya-box input{width:100%;box-sizing:border-box;margin:0 0 10px;padding:12px 14px;border:1px solid #d2d2d7;border-radius:12px;font:inherit;font-size:15px}" +
    ".ya-btn{display:block;width:100%;box-sizing:border-box;padding:13px;border:0;border-radius:999px;background:#1d1d1f;color:#fff;font:inherit;font-weight:600;font-size:15px;cursor:pointer;text-decoration:none;margin-top:4px}" +
    ".ya-x{background:none;border:0;color:#6e6e73;font:inherit;font-size:13px;margin-top:12px;cursor:pointer;text-decoration:underline}" +
    ".ya-need{display:inline-block;margin:0 0 12px!important;padding:6px 12px;border-radius:999px;background:#fff4d6;color:#8a5a00!important;font-weight:600;font-size:13px!important}.ya-box a.ya-l{color:inherit;text-decoration:underline}" +
    ".ya-err{color:#d70015!important;font-size:13px!important;min-height:1em;margin:0 0 8px!important}" +
    "[data-theme=dark] .ya-box{background:#1c1c1e;color:#f5f5f7}[data-theme=dark] .ya-box input{background:#2c2c2e;color:#f5f5f7;border-color:#3a3a3c}[data-theme=dark] .ya-btn{background:#f5f5f7;color:#1d1d1f}";
  document.head.appendChild(css);
  var ov = document.createElement("div");
  ov.className = "ya-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
  document.body.appendChild(ov);
  function signin() {
    ov.innerHTML = '<div class="ya-box">' + TOP + (ICON ? '<img src="' + ICON + '" alt="">' : "") +
      "<h2>Sign in to download</h2><p>Sign in with your name and email to download " + APP + " for Windows.</p>" +
      '<form id="ya-f"><input id="ya-n" placeholder="Your name" autocomplete="name" required>' +
      '<input id="ya-e" type="email" placeholder="you@example.com" autocomplete="email" required>' +
      '<p class="ya-err" id="ya-err"></p><button class="ya-btn" type="submit">Sign in</button></form>' +
      '<button class="ya-x" type="button" id="ya-c">Cancel</button></div>';
    ov.querySelector("#ya-c").onclick = close;
    ov.querySelector("#ya-f").onsubmit = function (e) {
      e.preventDefault();
      var n = ov.querySelector("#ya-n").value.trim(), m = ov.querySelector("#ya-e").value.trim();
      if (!n || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { ov.querySelector("#ya-err").textContent = "Enter your name and a valid email."; return; }
      set({ name: n, email: m });
      try { fetch("https://abacus.jasoncameron.dev/hit/praveenp-yathin-apps/signins", { mode: "cors" }).catch(function () {}); } catch (e2) {}
      NEED ? keyStep() : ready();
    };
  }
  function keyStep() {
    var saved = ""; try { saved = localStorage.getItem(NEED) || localStorage.getItem("ya-gemini-key") || ""; } catch (e) {}
    ov.innerHTML = '<div class="ya-box">' + TOP + (ICON ? '<img src="' + ICON + '" alt="">' : "") +
      "<h2>Add your Gemini API key</h2><p>" + APP + " needs a free Gemini API key to work. Get one at <a class=\"ya-l\" href=\"https://aistudio.google.com/apikey\" target=\"_blank\" rel=\"noopener\">aistudio.google.com/apikey</a>, then paste it here.</p>" +
      '<form id="ya-k"><input id="ya-kv" type="password" placeholder="Paste your Gemini API key" autocomplete="off" required>' +
      '<p class="ya-err" id="ya-err"></p><button class="ya-btn" type="submit">Continue to download</button></form>' +
      '<button class="ya-x" type="button" id="ya-c">Cancel</button></div>';
    ov.querySelector("#ya-kv").value = saved;
    ov.querySelector("#ya-c").onclick = close;
    ov.querySelector("#ya-k").onsubmit = function (e) {
      e.preventDefault();
      var k = ov.querySelector("#ya-kv").value.trim();
      if (k.length < 20 || /\s/.test(k)) { ov.querySelector("#ya-err").textContent = "That key looks too short. Copy the whole key from aistudio.google.com/apikey."; return; }
      try { localStorage.setItem(NEED, k); localStorage.setItem("ya-gemini-key", k); } catch (e2) {}
      gotKey = true; ready();
    };
  }
  function ready() {
    var u = get();
    ov.innerHTML = '<div class="ya-box">' + (ICON ? '<img src="' + ICON + '" alt="">' : "") +
      "<h2>Hi " + String(u.name).replace(/[<>&"]/g, "") + "!</h2><p>" + APP + " for Windows 10 and 11." + (NEED ? " The first time you open it, paste the same key into its Gemini API key box." : "") + " Windows may say it's from an unknown publisher: click More info, then Run anyway.</p>" +
      '<a class="ya-btn" id="ya-go" href="' + URL + '">Download for Windows</a>' +
      '<button class="ya-x" type="button" id="ya-out">Not you? Sign out</button><br><button class="ya-x" type="button" id="ya-c">Close</button></div>';
    ov.querySelector("#ya-c").onclick = close;
    ov.querySelector("#ya-out").onclick = function () { try { localStorage.removeItem(KEY); } catch (e) {} window.__yaUser = null; signin(); };
  }
  function open() { !get() ? signin() : (NEED && !gotKey ? keyStep() : ready()); ov.classList.add("on"); }
  function close() { ov.classList.remove("on"); }
  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  function addLink() {
    var bar = document.querySelector(".nav .seg") || document.querySelector(".x-pill");
    if (!bar || bar.querySelector(".ya-dl")) return;
    var a = document.createElement("a");
    a.href = "#download"; a.className = "ya-dl x-navdl" + (bar.classList.contains("x-pill") ? " x-nav" : "");
    a.textContent = "Download"; a.style.textDecoration = "none";
    a.onclick = function (e) { e.preventDefault(); open(); };
    var after = bar.querySelector('a[href*="yathin_apps"]');
    after && after.nextSibling ? bar.insertBefore(a, after.nextSibling) : bar.appendChild(a);
  }
  if (location.hash === "#download") setTimeout(open, 300);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function () { setTimeout(addLink, 50); }) : setTimeout(addLink, 50);
})();
