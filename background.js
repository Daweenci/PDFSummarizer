// Listen for messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "getExample":
            sendResponse({ data: "example" });
            break;

        case "example":
            console.log("Background script received example:", message.data);
            break;

        default:
            console.warn("Unknown message type:", message.type);
    }
});
