chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "selectionComplete") {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tabs[0].url;
    console.log({ url, message, tabs });
    chrome.storage.local.set({ [url]: message.coords });
  }
  sendResponse();
});
