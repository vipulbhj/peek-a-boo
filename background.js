// This is the problematic bit. I want to receive a message from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.action === "selectionComplete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      chrome.storage.local.set({ [url]: message.coords });
    });
  }
});
