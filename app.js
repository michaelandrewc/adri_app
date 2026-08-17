let allItems = [];

async function loadInformation() {
    const response = await fetch("data/information.json");
    const data = await response.json();

    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    allItems = data.items;

    displayItems(allItems);
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

loadInformation();