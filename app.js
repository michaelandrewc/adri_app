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
        const [
            firstValue,
            secondValueB2,
            secondValueC2,
            secondValueD2,
            moodRawValue
        ] = await Promise.all([
            getSheetCell("firstSheet", "A199"),
            getSheetCell("secondSheet", "B2"),
            getSheetCell("secondSheet", "C2"),
            getSheetCell("secondSheet", "D2"),
            getSheetCell("secondSheet", "A2")
        ]);

        // A199
        document.getElementById("sheet-value").textContent =
    firstValue.replaceAll('"', '');
        // B2
        document.getElementById("sheet-value-2").textContent =
            secondValueB2;

        // C2
        document.getElementById("sheet-value-c2").textContent =
                secondValueC2;

            const cageButton =
                document.getElementById("cage-button");

            if (secondValueC2.trim().toLowerCase() === "yes") {

                cageButton.textContent = "Unlock Him";
                cageButton.dataset.signal = "unlock";

            } else {

                cageButton.textContent = "Cage Him";
                cageButton.dataset.signal = "cage";

            }

        // D2
        // D2 - Busy status
        document.getElementById("sheet-value-d2").textContent =
            secondValueD2;

        const taskButton =
            document.getElementById("task-button");

        if (secondValueD2.trim().toLowerCase() === "yes") {

            taskButton.textContent = "Encourage";
            taskButton.dataset.signal = "encourage";

        } else {

            taskButton.textContent = "Make Work";
            taskButton.dataset.signal = "make_work";

}

        // A2 mood
        const moodValue = parseInt(moodRawValue, 10);

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

            // Make sure the image itself has finished loading.
            await moodImage.decode().catch(() => {});
        }

    } catch (error) {
        console.error("Could not load Google Sheet:", error);
    }
}

// -------------------------
// START APP
// -------------------------

async function startApp() {
    try {
        await Promise.all([
            loadInformation(),
            loadSheetInformation()
        ]);
    } catch (error) {
        console.error("App startup error:", error);
    } finally {
        document
            .getElementById("loading-screen")
            .classList.add("hidden");

        document
            .getElementById("app")
            .classList.remove("app-loading");
    }
}

startApp();
// -------------------------
// SIGNAL BUTTONS
// -------------------------

const SIGNAL_URL =
    "https://script.google.com/macros/s/AKfycbw0N34hSBE-_SulqVe82qXG9co8HlWTciegJmxtZY5fDtpjiLl00oH4M-Ojn2YZoeO3FQ/exec";


async function sendSignal(button) {

    const signal = button.dataset.signal;
    const originalText = button.textContent;

    try {
        button.disabled = true;
        button.textContent = "Sending...";

        await fetch(SIGNAL_URL, {
            method: "POST",
            body: JSON.stringify({
                signal: signal
            })
        });

        button.textContent = "Sent ✓";

    } catch (error) {
        console.error("Could not send signal:", error);

        button.textContent = "Failed";
    }

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
    }, 2000);
}

// -------------------------
// CARD INFO POPUP
// -------------------------

const modal = document.getElementById("info-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalClose = document.getElementById("modal-close");


document
    .querySelectorAll(".info-card")
    .forEach(card => {

        card.addEventListener("click", function (event) {

            // If the user clicked a button,
            // do NOT open the popup.
            if (event.target.closest("button")) {
                return;
            }

            modalTitle.textContent =
                card.dataset.title || "";

            modalDescription.textContent =
                card.dataset.description || "";

            modal.classList.remove("hidden");
        });

    });


function closeModal() {
    modal.classList.add("hidden");
}


modalClose.addEventListener("click", closeModal);

modal
    .querySelector(".modal-backdrop")
    .addEventListener("click", closeModal);

// Give every signal button a click listener
document
    .querySelectorAll(".signal-button")
    .forEach(button => {

        button.addEventListener("click", function () {
            sendSignal(button);
        });

    });
// Re-check Google Sheets every 60 seconds
setInterval(loadSheetInformation, 60 * 1000);