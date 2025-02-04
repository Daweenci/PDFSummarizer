document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("create-summary").addEventListener("click", function () {
        
    });

    document.getElementById("create-tasks").addEventListener("click", function () {

    });






    chrome.runtime.sendMessage({ type: "getExample" }, response => {
        if (response && response.data) {
            console.log("Popup script received example:", response.data);
        } else {
            console.error("Something went wrong here");
        }
    });
});
