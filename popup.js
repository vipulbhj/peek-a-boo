document.addEventListener("DOMContentLoaded", async () => {
  const tabs = await chrome.storage.local.get(null);
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const fragment = document.createDocumentFragment();
  for (const [url, coord] of Object.entries(tabs)) {
    if (url !== tab.url) continue;
    const divElm = document.createElement("div");
    const toggleElm = document.createElement("button");
    toggleElm.textContent = "Inactive";
    toggleElm.addEventListener("click", async () => {
      if (toggleElm.textContent === "Inactive") {
        toggleElm.textContent = "Active";
        chrome.tabs.sendMessage(tab.id, { action: "drawRect", coords: coord });
      } else {
        toggleElm.textContent = "Inactive";
        chrome.tabs.sendMessage(tab.id, { action: "clearRect" });
      }
    });
    divElm.appendChild(toggleElm);
    fragment.appendChild(divElm);
    document.getElementById("data").appendChild(fragment);
  }

  document.getElementById("select-area").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "startSelection" });

    window.close();
  });
});
