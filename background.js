chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "selectionComplete") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.storage.local.set({
      [tab.url]: { coords: message.coords, status: "Active" },
    });
  }
  sendResponse();
});
