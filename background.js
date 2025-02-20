// Listen for messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "selectAnchors":
            extractPdfList(message.hrefs).then(pdfList => {
                sendResponse(pdfList);
            });
            return true;
        case "sendSummaryRequest": 
            sendPdfsToApi(message.pdfList).then(() => {
                sendResponse("PDFs sent to API");
            });
            return true;
        default:
            console.warn("Unknown message type:", message.type);
    }

    return 
});

async function sendPdfsToApi(pdfList) {
    try {
        const pdfPromises = pdfList.map(async (pdf) => {
            const response = await fetch(pdf);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            return Array.from(new Uint8Array(arrayBuffer));
        });

        const pdfByteArrays = await Promise.all(pdfPromises);
        
        const firstTwoPdfs = pdfByteArrays.slice(0, 2);

        const apiResponse = await fetch("http://localhost:5177/summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Pdfs: "Test" })
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