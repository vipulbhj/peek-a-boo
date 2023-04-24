document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const fragment = document.createDocumentFragment();
    for (let tab of tabs) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const url = tab.url;
      chrome.storage.local.get(url, (result) => {
        const coords = result[url];
        td1.textContent = url;
        if (coords) {
          td2.textContent = "Saved";
        } else {
          td2.textContent = "Not saved";
        }
        tr.appendChild(td1);
        tr.appendChild(td2);
        fragment.appendChild(tr);
      });
      document.getElementById("data-table").appendChild(fragment);
    }
  });

  document.getElementById("select-area").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { action: "startSelection" });
    });

    window.close();
  });
});
