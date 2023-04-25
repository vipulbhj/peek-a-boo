const selectionDiv = document.createElement("div");
selectionDiv.style.zIndex = 9999;
selectionDiv.style.position = "fixed";
selectionDiv.style.pointerEvents = "none";
selectionDiv.style.backgroundColor = "white";
selectionDiv.style.border = "2px dashed red";

document.body.appendChild(selectionDiv);

let selectingArea = false;
let selectAreaMessageSession = false;

let startX = 0;
let startY = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startSelection") {
    selectAreaMessageSession = true;
    document.body.style.cursor = "crosshair";
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "drawRect") {
    const { x, y, width, height } = message.coords;
    selectionDiv.style.left = `${x}px`;
    selectionDiv.style.top = `${y}px`;
    selectionDiv.style.width = `${width}px`;
    selectionDiv.style.height = `${height}px`;
    selectionDiv.style.display = "block";
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clearRect") {
    selectionDiv.style.display = "none";
  }
});

document.addEventListener("mousemove", (event) => {
  if (selectingArea && selectAreaMessageSession) {
    const width = event.pageX - startX;
    const height = event.pageY - startY;

    selectionDiv.style.left = `${Math.min(startX, event.pageX)}px`;
    selectionDiv.style.top = `${Math.min(startY, event.pageY)}px`;
    selectionDiv.style.width = `${Math.abs(width)}px`;
    selectionDiv.style.height = `${Math.abs(height)}px`;
  }
});

document.addEventListener("mousedown", (event) => {
  selectingArea = true;
  if (selectingArea && selectAreaMessageSession) {
    startX = event.pageX;
    startY = event.pageY;
    selectionDiv.style.display = "block";
  }
});

document.addEventListener("mouseup", (event) => {
  document.body.style.cursor = "initial";
  if (selectingArea && selectAreaMessageSession) {
    const x = Math.min(startX, event.pageX);
    const y = Math.min(startY, event.pageY);
    const width = Math.abs(event.pageX - startX);
    const height = Math.abs(event.pageY - startY);

    chrome.runtime.sendMessage({
      action: "selectionComplete",
      coords: { x, y, width, height },
    });
  }
  // Cleanup
  selectingArea = false;
  selectAreaMessageSession = false;
});
