// Listen for messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "selectAnchors":
            extractPdfList(message.hrefs).then(pdfList => {
                sendResponse(pdfList);
            });
            return true;
        case "sendSummaryRequest": 
            sendPdfsToApi(message.pdfList, message.apiKey).then(() => {
                sendResponse("PDFs sent to API");
            });
            return true;
        case "storeApiKey":
            chrome.storage.local.set({ "apiKey": message.apiKey }, () => {
                sendResponse({ ok: true });
            })
            return true;
        case "getApiKey":
            chrome.storage.local.get("apiKey", (data) => {
                sendResponse({ apiKey: data.apiKey });
                console.log("API key sent:", data.apiKey);
            });
            return true;
        default:
            console.warn("Unknown message type:", message.type);
    }

    return 
});

async function sendPdfsToApi(pdfList, apiKey) {
    try {
        const Pdfs = new FormData();

        // Fetch each PDF, convert to Blob, and append to FormData
        for (let i = 0; i < 2; i++) {
            const response = await fetch(pdfList[i]);
            const blob = await response.blob();
            Pdfs.append("files", blob, `pdf_${i}.pdf`);
        }

        const apiResponse = await fetch("https://localhost:7133/summary", {
            method: "POST",
            headers: {
                "apiKey": apiKey
            },
            body: Pdfs // Sending binary files
        });

        const result = await apiResponse.json();
        console.log(result);
    } catch (error) {
        console.error("Error sending PDFs to API:", error);
    }
}

async function extractPdfList(hrefs) {
    const results = await Promise.all(
        hrefs.map(async (link) => {
            return await checkIfPDF(link);
        })
    );

    const pdfList = results.filter(result => result.isPDF);
    console.log("PDFs found:", pdfList);
    return pdfList;
}

async function checkIfPDF(link) {
    try {
        const response = await fetch(link.href, { method: "HEAD" });
        const contentDisposition = response.headers.get("Content-Disposition");
        const fileName = link.name || (contentDisposition ? contentDisposition.match(/filename="?([^"]+)"?/)?.[1] : "No name found");

        const contentType = response.headers.get("Content-Type");

        if(response.ok) {
            console.log("Response status:", response.status);
        }

        return { href: link.href, name: fileName, isPDF: contentType && contentType.includes("application/pdf") };
    } catch (error) {
        console.error("Error fetching the URL:", error);
    }
}