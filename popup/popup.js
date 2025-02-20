document.addEventListener("DOMContentLoaded", function () { //Bedingung muss auf die content.js liste der Links (geladen) angepasst werden
    const apiKeyElement = document.getElementById("api-key");
    const missingKeyMessage = document.getElementById("missing-key-message");
    
    document.getElementById("create-summary").addEventListener("click", function () {
        if (!apiKeyElement.value) {
            apiKeyElement.style.border = "2px solid red";
            missingKeyMessage.style.display = "block";
            return;
        }
        
        window.location.href = "selectPDFs/pdfAction.html?action=summary&apiKey=" + apiKeyElement.value;
    });

    document.getElementById("create-tasks").addEventListener("click", function () {
        if (!apiKeyElement.value) {
            apiKeyElement.style.border = "2px solid red";
            missingKeyMessage.style.display = "block";
            return;
        }

        window.location.href = "selectPDFs/pdfAction.html?action=task&apiKey=" + apiKeyElement.value;
    });
});