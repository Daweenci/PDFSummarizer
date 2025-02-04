console.log("Content script loaded.");

// Extracts links from elements that contain "Datei"
function example() {
    chrome.runtime.sendMessage({ type: "example", data: "hello" });
}

example();