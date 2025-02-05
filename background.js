// Listen for messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "selectAnchors":
            extractPdfList(message.hrefs).then(pdfList => {
                sendResponse(pdfList);
            });
            return true;
        default:
            console.warn("Unknown message type:", message.type);
    }

    return 
});

async function extractPdfList(hrefs) {
    const results = await Promise.all(
        hrefs.map(async (link) => {
            const isPDF = await checkIfPDF(link.href);
            return { 
                href: link.href, 
                text: link.text,
                isPDF 
            };
        })
    );

    const pdfList = results.filter(result => result.isPDF);
    
    return pdfList;
}

async function checkIfPDF(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");

        if(response.ok) {
            console.log("Response status:", response.status);
        }

        return contentType && contentType.includes("application/pdf");
    } catch (error) {
        console.error("Error fetching the URL:", error);
    }
}