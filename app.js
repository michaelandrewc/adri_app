async function loadInformation() {
    const response = await fetch("data/information.json");
    const data = await response.json();

    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    displayItems(data.items);
}


function displayItems(items) {
    const itemsContainer = document.getElementById("items");

    itemsContainer.innerHTML = "";

    items.forEach(item => {
        const itemElement = document.createElement("article");
        itemElement.className = "item-card";

        itemElement.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.description}</p>
        `;

        itemsContainer.appendChild(itemElement);
    });
}


// -------------------------
// GOOGLE SHEETS
// -------------------------

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQinCS5DxvP97OXodxKly64JISH5A9h9r7ilpAGqNsJRmpoYB7G6-s6L2UtffF3sI0Jhzis0IDrVV7L/pub";

const SHEET_GID = "0";


async function getSheetCell(cell) {
    const url =
        `${SHEET_URL}?gid=${SHEET_GID}&single=true&output=csv&range=${cell}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Google Sheet request failed: ${response.status}`);
    }

    const value = await response.text();

    return value.trim();
}


async function loadSheetInformation() {
    try {
        // This is the cell we're currently interested in.
        const value = await getSheetCell("A199");

        document.getElementById("sheet-value").textContent = value;

    } catch (error) {
        console.error("Could not load Google Sheet:", error);

        document.getElementById("sheet-value").textContent =
            "Unable to load";
    }
}


// -------------------------
// START APP
// -------------------------

loadInformation();
loadSheetInformation();