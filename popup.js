function getToggleText(status) {
  return status === "Active" ? "Hide" : "Show";
}

document.addEventListener("DOMContentLoaded", async () => {
  const tabs = await chrome.storage.local.get(null);
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const fragment = document.createDocumentFragment();
  for (const [url, { coords, status }] of Object.entries(tabs)) {
    if (url !== tab.url) continue;
    const divElm = document.createElement("div");
    const toggleElm = document.createElement("button");
    toggleElm.textContent = getToggleText(status);
    toggleElm.dataset.value = status;

    toggleElm.addEventListener("click", async () => {
      if (toggleElm.dataset.value === "Inactive") {
        toggleElm.dataset.value = "Active";
        toggleElm.textContent = getToggleText("Active");
        chrome.storage.local.set({ [url]: { coords, status: "Active" } });
        chrome.tabs.sendMessage(tab.id, { action: "drawRect", coords: coords });
      } else {
        toggleElm.dataset.value = "Inactive";
        toggleElm.textContent = getToggleText("Inactive");
        chrome.storage.local.set({ [url]: { coords, status: "Inactive" } });
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
