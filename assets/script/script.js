function generateDevis() {
  const form = document.getElementById("devisForm");
  const services = Array.from(form.elements["service"])
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const montant = form.elements["montant"].value;
  const room = form.elements["room"].value;
  const divers = form.elements["divers"].value;

  let resultHTML = "<h2>Devis</h2>";
  resultHTML += `<th>Designation</th>`;
  resultHTML += `<td><p>${room} </p>`;
  services.forEach((service) => {
    resultHTML += `<span>${service}, </span>`;
    resultHTML += `<span>${divers} .</span></td>`;
  });
  resultHTML += `<th>montant</th>`;
  resultHTML += `<td><p>${montant} €</p></td>`;

  document.getElementById("result").innerHTML = resultHTML;
}

document.getElementById("downloadExcel").addEventListener("click", function () {
  const resultDiv = document.getElementById("result");
  const blob = new Blob([resultDiv.innerHTML], {
    type: "application/vnd.ms-excel",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "devis.xls";
  link.click();
});

document.getElementById("downloadPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const headerdiv = document.getElementById("container-devis").innerHTML;
  const resultDiv = document.getElementById("result").innerText; // Utiliser innerText pour obtenir le texte brut
  const lines = resultDiv.split("\n");

  lines.forEach((line, index) => {
    doc.text(line, 10, 10 + index * 10); // Ajuster l'espacement
  });

  doc.save("devis.pdf");
});
