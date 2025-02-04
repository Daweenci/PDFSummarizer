document.addEventListener("DOMContentLoaded", function () {

    const pdfs = [
        { id: 1, name: "1" }
    ];

    const summarylist = document.getElementById("confitrm");

    for(const pdf in pdfs) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = pdf.id;
        checkbox.textContent = pdf.name;
        checkbox.checked = true;
        summarylist.appendChild(checkbox);
    }

});
