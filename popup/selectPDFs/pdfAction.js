document.addEventListener("DOMContentLoaded", function() {
    const pdfContainer = document.getElementById("pdfContainer");
    // pdfList/pdfList.html?action=task    pdfList/pdfList.html?action=summary
    const action = new URLSearchParams(window.location.search).get("action");

    (async () => {
        try {
            const pdfList = await getPdfsForCurrentUrl();
            pdfListToHTML(pdfList, pdfContainer);
            
            const button = document.createElement("button");
            button.textContent = "Back";
            button.id = "backButton";
            button.addEventListener("click", function() {
                window.location.href = "../popup.html";
            });
            document.body.appendChild(button);

            if(pdfList.length != 0) {
                const button = document.createElement("button");
                button.textContent = "Confirm";
                button.id = "confirmButton";
                button.addEventListener("click", function() {
                    if(action === "summary") { 
                        
                    } else if(action === "task") {
                        
                    }
                    else {
                        console.error("Unknown action:", action);
                    }
                });
                document.body.appendChild(button);

            }
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        }
    })();

    function pdfListToHTML(pdfList, pdfContainer) {
        let index = 0;
        for(pdf of pdfList) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `pdf-${++index}`;
            checkbox.checked = true;

            const anchor = document.createElement("a");
            anchor.href = pdf.href;
            anchor.textContent = pdf.text;
            anchor.addEventListener("click", function(event) {
                event.preventDefault();
                window.open(pdf.href, "_blank");
            });
            
            const label = document.createElement("label");          
            label.for = checkbox.id;
            label.appendChild(anchor);
            
            const divContainer = document.createElement("div");
            divContainer.className = "pdfItem";
            divContainer.appendChild(checkbox);
            divContainer.appendChild(label);

            pdfContainer.appendChild(divContainer);
        }
    }

    async function getPdfsForCurrentUrl() {
        const tabId = await getCurrentTabId();
        
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, { action: "getPdfList" }, function(response) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                resolve(response); // Correctly resolve the response
            });
        });
    }

    function getCurrentTabId() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (!tabs.length || !tabs[0].id) {
                    reject(new Error("No active tab found."));
                    return;
                }

                resolve(tabs[0].id);
            });
        });
    }
});