document.addEventListener("DOMContentLoaded", function() {
    const loadingDiv = document.getElementById("loading");
    const pdfContainer = document.getElementById("pdfContainer");
    const toggle = document.getElementById("toggle");
    // pdfList/pdfList.html?action=task    pdfList/pdfList.html?action=summary
    const action = new URLSearchParams(window.location.search).get("action");
    const apiKey = new URLSearchParams(window.location.search).get("apiKey");

    (async () => {
        try {
            const pdfList = await getPdfsForCurrentUrl();
            pdfListToHTML(pdfList, pdfContainer);
            toggle.addEventListener("click", toggleAllCheckboxes);
            
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
                        const checkboxes = pdfContainer.querySelectorAll("input[type='checkbox']:checked");
                        var pdfs = [];
                        checkboxes.forEach(checkbox => {
                            const label = checkbox.nextElementSibling;
                            const anchor = label.querySelector("a");
                            pdfs.push(anchor.href);
                        });
                        sendRequestToBackground(pdfs);
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

    function pdfListToHTML(pdfList) {
        let index = 0;
        for(pdf of pdfList) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `pdf-${++index}`;
            checkbox.checked = true;

            const anchor = document.createElement("a");
            anchor.href = pdf.href;
            anchor.textContent = pdf.name;
            anchor.addEventListener("click", function(event) {
                event.preventDefault();
                window.open(anchor.href, "_blank");
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

    function toggleAllCheckboxes() {
        console.log("Toggle all checkboxes clicked");
        const checkboxes = pdfContainer.querySelectorAll("input[type='checkbox']");
        const checked = toggle.checked;
        if(checked) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }
        else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }

    function displayData() {
        loadingDiv.style.display = "none";
        pdfContainer.style.display = "grid";
    }

    function displayError() {
        loadingDiv.style.display = "none";
        pdfContainer.style.display = "grid";
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "An error occurred while fetching the PDFs.";
        errorMessage.style.color = "red";  
        errorMessage.style.textAlign = "center";
        errorMessage.style.fontSize = "18px";     
        pdfContainer.appendChild(errorMessage);
    }

    async function getPdfsForCurrentUrl() {
        const tabId = await getCurrentTabId();
        
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, { action: "getPdfList" }, function(response) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (response.action === "timeout") {
                    displayError();
                    resolve([]);
                } else {
                    displayData();
                    resolve(response); // Correctly resolve the response
                }
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

    function sendRequestToBackground(pdfList) {
        chrome.runtime.sendMessage({ action: "sendSummaryRequest", pdfList, apiKey }, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending request to background:", chrome.runtime.lastError.message);
            }

            if (response) {
                console.log("Response from background:", response);
            }
        });
    }
});