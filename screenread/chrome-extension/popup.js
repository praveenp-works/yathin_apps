const err = (t) => { const e = document.getElementById("err"); e.textContent = t; e.hidden = false; };
document.getElementById("area").onclick = () => { chrome.runtime.sendMessage({ type: "select" }); window.close(); };
document.getElementById("page").onclick = () => chrome.runtime.sendMessage({ type: "page" }, (r) => { if (r && r.ok) window.close(); else err("Couldn't grab this page. Try another tab."); });
document.getElementById("file").onclick = () => { chrome.storage.session.remove("shot"); chrome.tabs.create({ url: chrome.runtime.getURL("result.html") }); window.close(); };
