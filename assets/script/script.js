const pieces = [];

// Ajout des champs pour le nom et l'adresse du client
function ajouterClientInfo() {
  const clientInfoContainer = document.getElementById("client-info");

  // Champ pour le nom du client
  const nomClientLabel = document.createElement("label");
  nomClientLabel.textContent = "Nom du client :";
  nomClientLabel.htmlFor = "nom-client";
  clientInfoContainer.appendChild(nomClientLabel);

  const nomClientInput = document.createElement("input");
  nomClientInput.type = "text";
  nomClientInput.placeholder = "Nom du client";
  nomClientInput.id = "nom-client";
  clientInfoContainer.appendChild(nomClientInput);
  clientInfoContainer.appendChild(document.createElement("br"));

  // Champ pour l'adresse du client
  const adresseLabel = document.createElement("label");
  adresseLabel.textContent = "Adresse :";
  adresseLabel.htmlFor = "adresse-client";
  clientInfoContainer.appendChild(adresseLabel);

  const adresseInput = document.createElement("input");
  adresseInput.type = "text";
  adresseInput.placeholder = "Adresse du client";
  adresseInput.id = "adresse-client";
  clientInfoContainer.appendChild(adresseInput);
  clientInfoContainer.appendChild(document.createElement("br"));
}

// Ajouter un événement pour le bouton "Ajouter une pièce"
document.getElementById("ajouterPiece").addEventListener("click", function () {
  const nomPiece = document.getElementById("nomPiece").value.trim();
  if (nomPiece) {
    pieces.push({ nom: nomPiece, taches: [] });
    document.getElementById("nomPiece").value = "";
    afficherPieces();
  }
});

// Afficher les pièces
function afficherPieces() {
  const piecesContainer = document.getElementById("pieces-container");
  piecesContainer.innerHTML = ""; // Réinitialiser le contenu

  pieces.forEach((piece) => {
    const pieceDiv = document.createElement("div");
    pieceDiv.className = "piece"; // Ajoute une classe
    pieceDiv.innerHTML = `<h3>${piece.nom}</h3>`;

    // Label et champ pour le prix total de la pièce
    const prixLabel = document.createElement("label");
    prixLabel.textContent = "Prix total de la pièce :";
    prixLabel.htmlFor = `prix-${piece.nom}`;
    pieceDiv.appendChild(prixLabel);

    const prixPieceInput = document.createElement("input");
    prixPieceInput.type = "text";
    prixPieceInput.placeholder = "Prix total de la pièce";
    prixPieceInput.className = "prix-piece";
    prixPieceInput.id = `prix-${piece.nom}`;
    prixPieceInput.dataset.piece = piece.nom;
    pieceDiv.appendChild(prixPieceInput);
    pieceDiv.appendChild(document.createElement("br"));

    // Label et champ pour les mètres carrés de la pièce
    const m2Label = document.createElement("label");
    m2Label.textContent = "Nombre de m² :";
    m2Label.htmlFor = `m2-${piece.nom}`;
    pieceDiv.appendChild(m2Label);

    const m2Input = document.createElement("input");
    m2Input.type = "text";
    m2Input.placeholder = "Nombre de m²";
    m2Input.className = "m2-piece";
    m2Input.id = `m2-${piece.nom}`;
    m2Input.dataset.piece = piece.nom;
    pieceDiv.appendChild(m2Input);

    // Charger les tâches pour la pièce
    fetch("./assets/script/devis.json")
      .then((response) => response.json())
      .then((data) => {
        piece.taches = data.taches;
        afficherTaches(piece, pieceDiv);
      })
      .catch((error) => console.error("Erreur:", error));

    piecesContainer.appendChild(pieceDiv);
  });

  document.getElementById("genererDevis").style.display =
    pieces.length > 0 ? "block" : "none";
}

// Afficher les tâches
function afficherTaches(piece, pieceDiv) {
  piece.taches.forEach((tache) => {
    const tacheDiv = document.createElement("div");
    tacheDiv.className = "tache"; // Ajoute une classe
    tacheDiv.innerHTML = `<strong>${tache.nom}</strong>`;

    // Champ "Divers" pour chaque tâche
    const diversInput = document.createElement("input");
    diversInput.type = "text";
    diversInput.placeholder = "Divers";
    diversInput.className = "input-divers";
    diversInput.dataset.piece = piece.nom;
    diversInput.dataset.tache = tache.nom;
    tacheDiv.appendChild(diversInput);

    const sousTachesDiv = document.createElement("div");
    sousTachesDiv.className = "sous-taches";

    tache.sousTaches.forEach((sousTache) => {
      const sousTacheDiv = document.createElement("div");
      sousTacheDiv.innerHTML = `
                <input type="checkbox" data-piece="${piece.nom}" data-tache="${tache.nom}" data-soustache="${sousTache.nom}">
                ${sousTache.nom}
            `;
      sousTachesDiv.appendChild(sousTacheDiv);
    });

    tacheDiv.appendChild(sousTachesDiv);
    pieceDiv.appendChild(tacheDiv);
  });
}
function genererDevis() {
  const devisTable = document.createElement("table");
  devisTable.classList.add("devis-table");

  devisTable.innerHTML = `
  <thead>
  <tr>
  <th>Désignation</th>
  <th>Prix de la pièce</th>
  <th>Mètres carrés</th>
  </tr>
  </thead>
        <tbody>
        </tbody>
        `;

  let totalGeneral = 0;

  pieces.forEach((piece) => {
    const sousTachesAffichees = [];
    let totalPiece = 0;

    piece.taches.forEach((tache) => {
      const diversInput = document.querySelector(
        `input.input-divers[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
      );
      const diversValue = diversInput ? diversInput.value : "";

      const sousTacheSelections = tache.sousTaches.filter((sousTache) => {
        const checkbox = document.querySelector(
          `input[type="checkbox"][data-piece="${piece.nom}"][data-tache="${tache.nom}"][data-soustache="${sousTache.nom}"]`
        );
        return checkbox && checkbox.checked;
      });

      if (sousTacheSelections.length > 0 || diversValue) {
        const sousTaches = sousTacheSelections.map(
          (sousTache) => sousTache.nom
        );

        // Ajout de "Divers" dans la liste des sous-tâches si rempli
        if (diversValue) {
          sousTaches.push(diversValue);
        }

        sousTachesAffichees.push(
          `<strong>${tache.nom}</strong> : (${sousTaches.join(", ")})`
        );
      }
    });

    if (sousTachesAffichees.length > 0) {
      const pieceRow = document.createElement("tr");

      // Colonne Désignation
      const designationCell = document.createElement("td");
      designationCell.innerHTML = `<strong>${
        piece.nom
      }</strong>: <br>${sousTachesAffichees.join("<br>")}`;
      pieceRow.appendChild(designationCell);

      // Colonne Prix de la pièce
      const prixPieceInput = document.querySelector(
        `input.prix-piece[data-piece="${piece.nom}"]`
      );
      const prixPiece = parseFloat(prixPieceInput.value) || 0;
      totalPiece += prixPiece;

      const prixCell = document.createElement("td");
      prixCell.textContent = `${prixPiece} €`;
      pieceRow.appendChild(prixCell);

      // Colonne Mètres carrés
      const m2Input = document.querySelector(
        `input.m2-piece[data-piece="${piece.nom}"]`
      );
      const m2Value = m2Input ? m2Input.value : "";
      const m2Cell = document.createElement("td");
      m2Cell.textContent = m2Value;
      pieceRow.appendChild(m2Cell);

      devisTable.querySelector("tbody").appendChild(pieceRow);

      totalGeneral += totalPiece;
    }
  });

  const totalGeneralRow = document.createElement("tr");
  totalGeneralRow.classList.add("total-general");
  totalGeneralRow.innerHTML = `
        <td><strong>Total Général</strong></td>
        <td colspan="2" style="text-align: right;"><strong>${totalGeneral} €</strong></td>
        `;
  devisTable.querySelector("tbody").appendChild(totalGeneralRow);

  // Récupérer les informations du client
  const nomClient = document.getElementById("nom-client").value;
  const adresseClient = document.getElementById("adresse-client").value;

  const devisContainer = document.getElementById("devis-table");
  devisContainer.innerHTML = ""; // Réinitialiser le contenu
  const clientInfoDiv = document.createElement("div");
  clientInfoDiv.innerHTML = `<h4>Client : ${nomClient}</h4><p>Adresse : ${adresseClient}</p>`;
  devisContainer.appendChild(clientInfoDiv);
  devisContainer.appendChild(devisTable);
  devisContainer.style.display = "block";

  // Afficher les boutons de téléchargement
  document.getElementById("telechargerExcel").style.display = "flex";
  document.getElementById("telechargerPDF").style.display = "flex";
}
// Générer le devis
document.getElementById("genererDevis").addEventListener("click", function () {
  genererDevis();
});

// Appeler la fonction pour ajouter les champs du client au chargement de la page
ajouterClientInfo();

function telechargerExcel() {
  const devisTable = document.querySelector(".devis-table");
  const ws = XLSX.utils.table_to_sheet(devisTable);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Devis");
  XLSX.writeFile(wb, "devis.xlsx");
}
function telechargerPDF() {
  // Sélectionner le tableau de devis
  const devisTable = document.querySelector(".devis-table");
  if (!devisTable) {
    console.error("Tableau de devis introuvable !");
    return; // Sortir si le tableau n'existe pas
  }

  // Récupérer les informations du client
  const nomClient = document.getElementById("nom-client").value;
  const adresseClient = document.getElementById("adresse-client").value;

  // Créer une nouvelle fenêtre
  const win = window.open("", "", "width=800,height=600");

  // Écrire le contenu HTML dans la nouvelle fenêtre
  win.document.write(`
    <html>
      <head>
        <title>Impression Devis</title>
        <link rel="stylesheet" href="/assets/css/style.css"> <!-- Lien vers votre CSS -->
      </head>
      <body>
        <img src="/assets/img/LogoSOSIE100px.jpg" alt="" srcset="">
        <h1>preparation Devis ${nomClient}</h1>
        <h4>Client : ${nomClient}</h4>
        <p>Adresse : ${adresseClient}</p>
        ${devisTable.outerHTML} <!-- Intégrer le tableau de devis -->
      </body>
    </html>
  `);

  // Attendre que le contenu soit chargé
  win.document.close(); // Nécessaire pour le chargement du document
  win.onload = function () {
    // Appeler la fonction d'impression
    win.print();
    win.close(); // Fermer la fenêtre après l'impression
  };
}





document
  .getElementById("telechargerExcel")
  .addEventListener("click", telechargerExcel);
document
  .getElementById("telechargerPDF")
  .addEventListener("click", telechargerPDF);
