# Fridge Chef for Windows. Created by Yathin Pedamallu.
import os, sys, webview

VERSION = 1
BASE = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(BASE, "web", "index.html")
DATA = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "FridgeChef")
os.makedirs(DATA, exist_ok=True)

DESKTOP_JS = r"""
(function(){
  document.documentElement.classList.add('is-app','is-desktop');
  var s=document.createElement('style');
  s.textContent='[data-dl],.x-navdl,#who{display:none!important}';
  document.head.appendChild(s);
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="http"]');
    if(a&&a.host!==location.host){a.target='_blank';}
  },true);
})();
"""

def on_loaded(w):
    try:
        w.evaluate_js(DESKTOP_JS)
    except Exception:
        pass

if __name__ == "__main__":
    webview.settings["OPEN_EXTERNAL_LINKS_IN_BROWSER"] = True
    win = webview.create_window("Fridge Chef", WEB, width=1200, height=860, min_size=(420, 600))
    win.events.loaded += lambda: on_loaded(win)
    webview.start(gui="edgechromium", http_server=True, http_port=47821,
                  private_mode=False, storage_path=DATA)
