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
    console.log("here");
    selectAreaMessageSession = true;
    document.body.style.cursor = "crosshair";
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
  console.log("mousedown", selectingArea, selectAreaMessageSession);
  selectingArea = true;
  if (selectingArea && selectAreaMessageSession) {
    startX = event.pageX;
    startY = event.pageY;
    selectionDiv.style.display = "block";
  }
});

// Listen for mouseup events on the page
document.addEventListener("mouseup", (event) => {
  selectingArea = false;
  selectAreaMessageSession = false;
  document.body.style.cursor = "initial";
  if (selectingArea && selectAreaMessageSession) {
    const x = Math.min(startX, event.pageX);
    const y = Math.min(startY, event.pageY);
    const width = Math.abs(event.pageX - startX);
    const height = Math.abs(event.pageY - startY);
    selectingArea = false;
    selectionDiv.style.display = "none";

    // This is the problematic bit. I want to send a message to the background script
    chrome.runtime.sendMessage({
      action: "selectionComplete",
      coords: { x, y, width, height },
    });
  }
});
