async function loadInformation() {
    const response = await fetch("data/information.json");
    const data = await response.json();

    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;
}


// -------------------------
// GOOGLE SHEETS
// -------------------------

const SHEETS = {
    firstSheet: {
        url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQinCS5DxvP97OXodxKly64JISH5A9h9r7ilpAGqNsJRmpoYB7G6-s6L2UtffF3sI0Jhzis0IDrVV7L/pub",
        gid: "0"
    },

    secondSheet: {
        url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOZMoElgbv09UBdrwpCN35808QwpnBMg9Ai2DztXlTZJERPSiRIAvbRGRQz9AHz8HHqQBLGwzhWHSU/pub",
        gid: "0"
    }
};


async function getSheetCell(sheetName, cell) {
    const sheet = SHEETS[sheetName];

    if (!sheet) {
        throw new Error(`Unknown sheet: ${sheetName}`);
    }

    const url =
        `${sheet.url}?gid=${sheet.gid}&single=true&output=csv&range=${cell}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Google Sheet request failed: ${response.status}`
        );
    }

    const value = await response.text();

    return value.trim();
}


async function loadSheetInformation() {
    try {
        // First sheet: A199
        const firstValue =
            await getSheetCell("firstSheet", "A199");

        document.getElementById("sheet-value").textContent =
            firstValue;


        // Second sheet: B2
        const secondValueB2 =
            await getSheetCell("secondSheet", "B2");

        document.getElementById("sheet-value-2").textContent =
            secondValueB2;


        // Second sheet: C2
        const secondValueC2 =
            await getSheetCell("secondSheet", "C2");

        document.getElementById("sheet-value-c2").textContent =
            secondValueC2;


        // Second sheet: D2
        const secondValueD2 =
            await getSheetCell("secondSheet", "D2");

        document.getElementById("sheet-value-d2").textContent =
            secondValueD2;


        // Second sheet: A2
        const moodValue =
            parseInt(await getSheetCell("secondSheet", "A2"), 10);

        const moodImages = {
            1: "moods/awful.png",
            2: "moods/poor.png",
            3: "moods/medium.png",
            4: "moods/good.png",
            5: "moods/excellent.png"
        };

        const moodImage =
            document.getElementById("mood-image");

        if (moodImages[moodValue]) {
            moodImage.src = moodImages[moodValue];
            moodImage.alt = `Mood level ${moodValue}`;
        } else {
            console.error("Unexpected mood value:", moodValue);
        }

    } catch (error) {
        console.error("Could not load Google Sheet:", error);
    }
}

// -------------------------
// START APP
// -------------------------

loadInformation();
loadSheetInformation();