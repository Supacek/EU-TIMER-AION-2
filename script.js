// AION 2 EU - Spacetime Rift Timer

const RIFT_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];


// =========================================
// EUROPE / PRAGUE TIME
// =========================================

function getEUTime() {

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Prague",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });

    const parts = formatter.formatToParts(now);

    const hour = Number(
        parts.find(part => part.type === "hour").value
    );

    const minute = Number(
        parts.find(part => part.type === "minute").value
    );

    const second = Number(
        parts.find(part => part.type === "second").value
    );

    return {
        hour,
        minute,
        second
    };
}


// =========================================
// FORMAT ČASU
// =========================================

function pad(number) {
    return String(number).padStart(2, "0");
}


// =========================================
// NAJÍT DALŠÍ RIFT
// =========================================

function getNextRift() {

    const now = getEUTime();

    const currentSeconds =
        now.hour * 3600 +
        now.minute * 60 +
        now.second;


    for (const hour of RIFT_HOURS) {

        const riftSeconds = hour * 3600;

        if (riftSeconds > currentSeconds) {

            return {
                remaining: riftSeconds - currentSeconds,
                hour: hour
            };

        }
    }


    // Poslední Rift dne už proběhl.
    // Počítáme do prvního Riftu dalšího dne.

    return {
        remaining:
            (24 * 3600) -
            currentSeconds +
            (RIFT_HOURS[0] * 3600),

        hour: RIFT_HOURS[0]
    };
}


// =========================================
// AKTUALIZACE TIMERU
// =========================================

function updateTimer() {

    const timer = document.getElementById("timer");
    const nextTime = document.getElementById("nextTime");

    if (!timer) return;


    const rift = getNextRift();


    const hours =
        Math.floor(rift.remaining / 3600);

    const minutes =
        Math.floor(
            (rift.remaining % 3600) / 60
        );

    const seconds =
        rift.remaining % 60;


    timer.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


    if (nextTime) {

        nextTime.textContent =
            `${pad(rift.hour)}:00`;

    }
}


// =========================================
// SPUŠTĚNÍ
// =========================================

updateTimer();


// Aktualizace každou sekundu
setInterval(updateTimer, 1000);
