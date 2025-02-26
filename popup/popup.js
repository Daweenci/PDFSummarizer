document.addEventListener("DOMContentLoaded", function () { //Bedingung muss auf die content.js liste der Links (geladen) angepasst werden
    const apiKeyElement = document.getElementById("api-key");
    const visitApiKeyLabel = document.getElementById("link-to-api-key");
    const missingKeyMessage = document.getElementById("missing-key-message");
    
    visitApiKeyLabel.addEventListener("click", function (event) {
        event.preventDefault();
        window.open(visitApiKeyLabel.href, "_blank");
    });

    chrome.runtime.sendMessage({ action: "getApiKey" }, function (response) {
        if (response && response.apiKey) {
            apiKeyElement.value = response.apiKey;
        }
    });

    document.getElementById("create-summary").addEventListener("click", function () {
        if (!apiKeyElement.value) {
            apiKeyElement.style.border = "2px solid red";
            missingKeyMessage.style.display = "block";
            return;
        }
        
        chrome.runtime.sendMessage({ action: "storeApiKey", apiKey: apiKeyElement.value }, (response) => {
            if (response && response.ok) {
                window.location.href = "selectPDFs/pdfAction.html?action=summary&apiKey=" + apiKeyElement.value;
            }
        }); 
    });

    document.getElementById("create-tasks").addEventListener("click", function () {
        if (!apiKeyElement.value) {
            apiKeyElement.style.border = "2px solid red";
            missingKeyMessage.style.display = "block";
            return;
        }

        chrome.runtime.sendMessage({ action: "storeApiKey", apiKey: apiKeyElement.value }, (response) => {
            if (response && response.ok) {
                window.location.href = "selectPDFs/pdfAction.html?action=task&apiKey=" + apiKeyElement.value;
            }
        }); 
    });
});