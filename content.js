const extractedLinks = [];
let extractedPDFs = [];

console.log("Content script loaded.");


function extractLinks() {
  const pageAnchors = document.querySelectorAll("a");

  pageAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    const textElement = anchor.querySelector(".instancename");

    if (href && textElement) {
      extractedLinks.push({
        href,
        text: textElement.textContent,
      });
    }
  });

}

extractLinks();

chrome.runtime.sendMessage({ action: "selectAnchors", hrefs: extractedLinks }, (response) => {
  extractedPDFs = response;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
      case "getPdfList":
        sendResponse(extractedPDFs);
        break;
      default:
          console.log("Unknown message type:", message.action);
  }

  return 
});