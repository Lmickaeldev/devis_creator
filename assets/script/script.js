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
  // Ajouter la tâche "Divers" pour la pièce
  const tacheDivers = {
    nom: "Divers",
    sousTaches: [],
  };

  // Créer la tâche "Divers" dans l'interface utilisateur
  const tacheDiv = document.createElement("div");
  tacheDiv.className = "tache"; // Ajoute une classe
  tacheDiv.innerHTML = `<strong>${tacheDivers.nom}</strong>`;

  // Champ "Divers" (texte libre) pour cette tâche
  const diversLabel = document.createElement("label");
  diversLabel.textContent = "Détails Divers :";
  diversLabel.htmlFor = `divers-${piece.nom}`;
  tacheDiv.appendChild(diversLabel);

  const diversInput = document.createElement("input");
  diversInput.type = "text";
  diversInput.placeholder = "Précisez des détails ou un coût supplémentaire";
  diversInput.className = "input-divers";
  diversInput.id = `divers-${piece.nom}`;
  diversInput.dataset.piece = piece.nom;
  tacheDiv.appendChild(diversInput);

  // Champ "Prix" pour la tâche Divers
  const prixInputDivers = document.createElement("input");
  prixInputDivers.type = "number"; // Type numérique pour le prix
  prixInputDivers.placeholder = "Prix Divers";
  prixInputDivers.className = "input-prix-divers";
  prixInputDivers.dataset.piece = piece.nom;
  tacheDiv.appendChild(prixInputDivers);

  // Champ "M²" pour la tâche Divers
  const m2LabelDivers = document.createElement("label");
  m2LabelDivers.textContent = "M² :";
  m2LabelDivers.htmlFor = `m2-divers-${piece.nom}`;
  tacheDiv.appendChild(m2LabelDivers);

  const m2InputDivers = document.createElement("input");
  m2InputDivers.type = "number";
  m2InputDivers.placeholder = "Mètres carrés";
  m2InputDivers.className = "input-m2";
  m2InputDivers.dataset.piece = piece.nom;
  tacheDiv.appendChild(m2InputDivers);

  pieceDiv.appendChild(tacheDiv);

  // Afficher les autres tâches de la pièce
  piece.taches.forEach((tache) => {
    const tacheDiv = document.createElement("div");
    tacheDiv.className = "tache"; // Ajoute une classe
    tacheDiv.innerHTML = `<strong>${tache.nom}</strong>`;

    // Champ "Divers" pour chaque tâche (si tu souhaites garder un champ divers ici aussi)
    const diversInput = document.createElement("input");
    diversInput.type = "text";
    diversInput.placeholder = "Divers";
    diversInput.className = "input-divers";
    diversInput.dataset.piece = piece.nom;
    diversInput.dataset.tache = tache.nom;
    tacheDiv.appendChild(diversInput);

    // Champ "Prix" pour chaque tâche
    const prixInput = document.createElement("input");
    prixInput.type = "number"; // Type numérique pour le prix
    prixInput.placeholder = "Prix";
    prixInput.className = "input-prix";
    prixInput.dataset.piece = piece.nom;
    prixInput.dataset.tache = tache.nom;
    tacheDiv.appendChild(prixInput);

    // Champ "M²" pour chaque tâche
    const m2Label = document.createElement("label");
    m2Label.textContent = "M² :";
    m2Label.htmlFor = `m2-${piece.nom}-${tache.nom}`;
    tacheDiv.appendChild(m2Label);

    const m2Input = document.createElement("input");
    m2Input.type = "number";
    m2Input.placeholder = "Mètres carrés";
    m2Input.className = "input-m2";
    m2Input.dataset.piece = piece.nom;
    m2Input.dataset.tache = tache.nom;
    tacheDiv.appendChild(m2Input);

    // Si la tâche est "Sol", ajouter les champs Longueur et Largeur
    if (tache.nom === "Sol") {
      // Ajouter le champ Longueur
      const longueurLabel = document.createElement("label");
      longueurLabel.textContent = "Longueur :";
      longueurLabel.htmlFor = `longueur-${piece.nom}-${tache.nom}`;
      tacheDiv.appendChild(longueurLabel);

      const longueurInput = document.createElement("input");
      longueurInput.type = "number";
      longueurInput.placeholder = "Longueur (m)";
      longueurInput.className = "input-longueur";
      longueurInput.dataset.piece = piece.nom;
      longueurInput.dataset.tache = tache.nom;
      tacheDiv.appendChild(longueurInput);

      // Ajouter le champ Largeur
      const largeurLabel = document.createElement("label");
      largeurLabel.textContent = "Largeur :";
      largeurLabel.htmlFor = `largeur-${piece.nom}-${tache.nom}`;
      tacheDiv.appendChild(largeurLabel);

      const largeurInput = document.createElement("input");
      largeurInput.type = "number";
      largeurInput.placeholder = "Largeur (m)";
      largeurInput.className = "input-largeur";
      largeurInput.dataset.piece = piece.nom;
      largeurInput.dataset.tache = tache.nom;
      tacheDiv.appendChild(largeurInput);
    }

    // Sous-tâches
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
        <th>Prix de la tâche</th>
        <th>Mètres carrés</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  let totalGeneral = 0;

  pieces.forEach((piece) => {
    const sousTachesAffichees = [];
    let totalPiece = 0;
    let totalM2Piece = 0; // Variable pour totaliser les m² de la pièce

    // Vérification de la tâche "Divers"
    const diversInput = document.querySelector(
      `input.input-divers[data-piece="${piece.nom}"]`
    );
    const diversValue = diversInput ? diversInput.value : "";

    const prixDiversInput = document.querySelector(
      `input.input-prix-divers[data-piece="${piece.nom}"]`
    );
    const prixDivers = parseFloat(prixDiversInput ? prixDiversInput.value : 0);

    // Vérification du champ m² de "Divers"
    const m2DiversInput = document.querySelector(
      `input.input-m2[data-piece="${piece.nom}"][data-tache="Divers"]`
    );
    const m2Divers = parseFloat(m2DiversInput ? m2DiversInput.value : 0);

    if (diversValue || prixDivers > 0) {
      sousTachesAffichees.push(
        `<strong>Divers</strong>: ${diversValue} - ${prixDivers} € (M²: ${
          m2Divers > 0 ? m2Divers : "Non renseigné"
        })`
      );
      totalPiece += prixDivers;
      totalM2Piece += m2Divers; // Ajouter m² de la tâche Divers
    }

    // Ajouter les autres tâches de la pièce
    piece.taches.forEach((tache) => {
      const diversInputTache = document.querySelector(
        `input.input-divers[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
      );
      const diversValueTache = diversInputTache ? diversInputTache.value : "";

      const sousTacheSelections = tache.sousTaches.filter((sousTache) => {
        const checkbox = document.querySelector(
          `input[type="checkbox"][data-piece="${piece.nom}"][data-tache="${tache.nom}"][data-soustache="${sousTache.nom}"]`
        );
        return checkbox && checkbox.checked;
      });

      const prixInput = document.querySelector(
        `input.input-prix[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
      );
      const prixTache = parseFloat(prixInput ? prixInput.value : 0);
      const m2InputTache = document.querySelector(
        `input.input-m2[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
      );
      const m2ValueTache = parseFloat(m2InputTache ? m2InputTache.value : 0);

      if (sousTacheSelections.length > 0 || diversValueTache) {
        const sousTaches = sousTacheSelections.map(
          (sousTache) => sousTache.nom
        );
        if (diversValueTache) {
          sousTaches.push(diversValueTache);
        }

        sousTachesAffichees.push(
          `<strong>${tache.nom}</strong>: ${sousTaches.join(
            ", "
          )} - ${prixTache} € (M²: ${m2ValueTache})`
        );

        totalPiece += prixTache;
        totalM2Piece += m2ValueTache; // Ajouter m² de la tâche

        // Si la tâche est "Sol", récupérer Longueur x Largeur
        if (tache.nom === "Sol") {
          const longueurInput = document.querySelector(
            `input.input-longueur[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
          );
          const largeurInput = document.querySelector(
            `input.input-largeur[data-piece="${piece.nom}"][data-tache="${tache.nom}"]`
          );

          const longueur = parseFloat(longueurInput ? longueurInput.value : 0);
          const largeur = parseFloat(largeurInput ? largeurInput.value : 0);

          // Afficher Longueur x Largeur uniquement si les deux sont renseignées
          if (longueur > 0 && largeur > 0) {
            sousTachesAffichees[
              sousTachesAffichees.length - 1
            ] += ` (Dimensions: ${longueur} x ${largeur})`;
          }
        }
      }
    });

    if (sousTachesAffichees.length > 0) {
      const pieceRow = document.createElement("tr");

      // Colonne Désignation
      const designationCell = document.createElement("td");
      designationCell.innerHTML = `${piece.nom}: <br>${sousTachesAffichees.join(
        "<br>"
      )}`;
      pieceRow.appendChild(designationCell);

      // Colonne Prix de la tâche
      const prixCell = document.createElement("td");
      prixCell.textContent = `${totalPiece} €`;
      pieceRow.appendChild(prixCell);

      // Colonne Mètres carrés
      const m2Cell = document.createElement("td");
      m2Cell.textContent = `${
        totalM2Piece > 0 ? totalM2Piece : "Non renseigné"
      } m²`; // Total des m² de la pièce
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

  // Créer une section contenant le contenu à convertir en PDF
  const contenuPDF = document.createElement("div");

  contenuPDF.innerHTML = `
    <img src="/assets/img/LogoSOSIE100px.jpg" alt="Logo" style="width: 100px; height: auto;">
    <h1>Préparation Devis - ${nomClient}</h1>
    <h4>Client : ${nomClient}</h4>
    <p>Adresse : ${adresseClient}</p>
    ${devisTable.outerHTML} <!-- Ajouter le tableau de devis -->
  `;

  // Utiliser html2pdf.js pour convertir ce contenu en PDF
  html2pdf()
    .from(contenuPDF) // Prendre le contenu à convertir
    .save(`${nomClient}_devis.pdf`); // Télécharger le PDF avec le nom du client
}


document
  .getElementById("telechargerExcel")
  .addEventListener("click", telechargerExcel);
document
  .getElementById("telechargerPDF")
  .addEventListener("click", telechargerPDF);
