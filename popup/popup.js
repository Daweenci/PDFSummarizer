document.addEventListener("DOMContentLoaded", function () { //Bedingung muss auf die content.js liste angepasst werden
    document.getElementById("create-summary").addEventListener("click", function () {
        window.location.href = "selectPDFs/pdfAction.html?action=summary";
    });

    document.getElementById("create-tasks").addEventListener("click", function () {
        window.location.href = "selectPDFs/pdfAction.html?action=task";
    });
});