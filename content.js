const extractedLinks = [];
let hasReturnedPDFs = false;
let extractedPDFs = [];

console.log("Content script loaded.");


function extractLinks() {
    const pageAnchors = document.querySelectorAll("a");

    pageAnchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        
        const name = getLinkName(anchor);

        if (href && name.isValid) {
            extractedLinks.push({
                href,
                name: name.content,
            });
        }
    });

}

extractLinks();

chrome.runtime.sendMessage({ action: "selectAnchors", hrefs: extractedLinks }, (response) => {
    extractedPDFs = response;
    hasReturnedPDFs = true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "getPdfList":
            if (hasReturnedPDFs) {
                sendResponse(extractedPDFs);
            } else {
                let time = 0; 
                const interval = setInterval(() => {
                    time += 500;

                    if (hasReturnedPDFs) {
                        console.log(extractedPDFs);
                        sendResponse(extractedPDFs);
                        clearInterval(interval);
                    } else if(time >= 20000) {
                        clearInterval(interval);
                        sendResponse({extractedPDFs: [], action: "timeout"});
                    } 
                }, 500);
            }
            return true;
        default:
            console.log("Unknown message type:", message.action);
    }

    return
});

function getLinkName(anchor) {
    const domain = getDomain();

    switch(true) {
        case domain.includes("moodle"):
            const textElement = anchor.querySelector(".instancename")
            const isValid = textElement ? true : false;
            const content = textElement?.textContent;
            return {isValid, content};
        default:
            return {isValid: true, content: null};
    }
}

function getDomain() {
    const url = window.location.href;
    return new URL(url).hostname;
}