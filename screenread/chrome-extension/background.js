// Screen Read extension: capture the tab, then open the result page to read the text.
async function activeTab() { const [t] = await chrome.tabs.query({ active: true, currentWindow: true }); return t; }

async function captureAndOpen(tab, rect, crop) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  await chrome.storage.session.set({ shot: { dataUrl, rect: rect || null, crop: !!crop, title: tab.title || "", url: tab.url || "" } });
  await chrome.tabs.create({ url: chrome.runtime.getURL("result.html"), index: tab.index + 1 });
}

async function startSelect(tab) {
  tab = tab || await activeTab();
  if (!tab || !/^(https?|file):/.test(tab.url || "")) {
    // Chrome pages can't be drawn on: take the picture, then let the user drag the box on it.
    try { await captureAndOpen(tab, null, true); } catch (e) { chrome.tabs.create({ url: chrome.runtime.getURL("result.html") }); }
    return;
  }
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["select.js"] });
  } catch (e) {
    try { await captureAndOpen(tab, null, true); } catch (_) { chrome.tabs.create({ url: chrome.runtime.getURL("result.html") }); }
  }
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  (async () => {
    if (msg.type === "select") { await startSelect(); reply({ ok: true }); }
    else if (msg.type === "screen") { await openScreen(); reply({ ok: true }); }
    else if (msg.type === "page") { const t = await activeTab(); try { await captureAndOpen(t, null); reply({ ok: true }); } catch (e) { reply({ ok: false, error: String(e.message || e) }); } }
    else if (msg.type === "picked") {
      const tab = sender.tab;
      try { await captureAndOpen(tab, msg.rect); reply({ ok: true }); } catch (e) { reply({ ok: false, error: String(e.message || e) }); }
    } else reply({ ok: false });
  })();
  return true;
});

const openScreen = () => chrome.tabs.create({ url: chrome.runtime.getURL("result.html?screen=1") });
chrome.commands.onCommand.addListener((cmd, tab) => { if (cmd === "select-area") startSelect(tab); else if (cmd === "screen-area") openScreen(); });
