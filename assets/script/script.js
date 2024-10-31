let roomCount = 0;

const servicePrices = {
    murs: {
        "Détapisser": 50,
        "Poncer": 30,
        "Peindre (2 couches)": 100,
        "Fibre": 80
    },
    plafond: {
        "Peindre": 100,
        "Rénover": 120
    },
    sol: {
        "Carrelage": 200,
        "Parquet": 150
    },
    porte: {
        "Remplacer": 200,
        "Réparer": 80
    },
    plinthe: {
        "Installer": 40
    },
    divers: {
        "Électricité": 150,
        "Plomberie": 200
    }
};

function addRoom() {
    const roomsDiv = document.getElementById("rooms");
    const roomNameInput = document.getElementById("roomname").value;
    if (!roomNameInput) {
        alert("Veuillez entrer un nom pour la pièce.");
        return;
    }

    const roomDiv = document.createElement("div");
    roomCount++;

    roomDiv.className = "room";

    roomDiv.innerHTML = `
        <label>
            <p>${roomCount} - ${roomNameInput}:</p>
            <input type="text" name="room-${roomCount}" value="${roomNameInput}" readonly>
        </label>
        <ul>
            ${generateServiceOptions('murs', roomCount)}
            ${generateServiceOptions('plafond', roomCount)}
            ${generateServiceOptions('sol', roomCount)}
            ${generateServiceOptions('porte', roomCount)}
            ${generateServiceOptions('plinthe', roomCount)}
            <li>
                <label>
                    Divers:
                    <input type="text" name="divers-${roomCount}" placeholder="Tâches diverses">
                </label>
            </li>
            <li>
                <label>
                    Montant total:
                    <input type="text" name="montant-${roomCount}" placeholder="Montant en €" readonly>
                </label>
            </li>
        </ul>
    `;

    roomsDiv.appendChild(roomDiv);
    document.getElementById("roomname").value = "";
}

function generateServiceOptions(serviceType, roomNumber) {
    let optionsHTML = `<li><strong>${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}:</strong>`;
    optionsHTML += `<ul>`;
    for (const [option, price] of Object.entries(servicePrices[serviceType])) {
        optionsHTML += `
            <li>
                <label>
                    <input type="checkbox" name="${serviceType}-${roomNumber}" value="${option}" data-price="${price}" onchange="updateTotal(${roomNumber})">
                    ${option} (${price} €)
                </label>
            </li>
        `;
    }
    optionsHTML += `</ul></li>`;
    return optionsHTML;
}

function updateTotal(roomNumber) {
    const roomDiv = document.querySelector(`.room:nth-of-type(${roomNumber})`);
    const checkboxes = roomDiv.querySelectorAll(`input[type="checkbox"]`);
    let total = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseFloat(checkbox.dataset.price);
        }
    });

    // Ajout du prix des tâches diverses
    const diversInput = roomDiv.querySelector(`input[name="divers-${roomNumber}"]`);
    const diversPrice = parseFloat(diversInput.value) || 0;

    total += diversPrice;

    roomDiv.querySelector(`input[name="montant-${roomNumber}"]`).value = total;
}

function generateDevis() {
    const roomSections = document.querySelectorAll(".room");
    let resultHTML = "<h2>Devis</h2>";
    resultHTML += '<table class="table">';
    resultHTML += `<tr><th>Désignation</th><th>Montant</th></tr>`;

    let totalSum = 0;

    roomSections.forEach((roomDiv) => {
        const roomInput = roomDiv.querySelector('input[name^="room-"]');
        const montantInput = roomDiv.querySelector(`input[name="montant-${roomCount}"]`);
        const diversInput = roomDiv.querySelector(`input[name^="divers-"]`);

        if (roomInput.value) {
            const montant = parseFloat(montantInput.value) || 0;

            // Récupérer les services cochés
            const services = Array.from(roomDiv.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value)
                .join(", ");

            if (services || diversInput.value) {
                totalSum += montant;

                resultHTML += `<tr><td>${roomInput.value} ${services ? `(${services})` : ''} ${diversInput.value}</td><td>${montant} €</td></tr>`;
            }
        }
    });

    resultHTML += `<tr><td><strong>Total</strong></td><td>${totalSum} €</td></tr>`;
    resultHTML += "</table>";

    const container = document.getElementById("container-devis");
    container.style.display = "block";
    document.getElementById("result").innerHTML = resultHTML;
}
