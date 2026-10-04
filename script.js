// AION 2 EU - Spacetime Rift Timer

const RIFT_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

// EU server schedule = GMT+9
const SERVER_OFFSET = 9;

function getEUTime() {
    const now = new Date();

    // UTC
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;

    // AION EU server time (GMT+9)
    return new Date(utc + SERVER_OFFSET * 60 * 60 * 1000);
}

function pad(number) {
    return String(number).padStart(2, "0");
}

function getNextRift() {
    const now = getEUTime();

    const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

    for (const hour of RIFT_HOURS) {

        const riftSeconds = hour * 3600;

        if (riftSeconds > currentSeconds) {
            return {
                remaining: riftSeconds - currentSeconds,
                hour: hour
            };
        }
    }

    // Pokud už proběhl poslední Rift dne,
    // počítáme do prvního Riftu dalšího dne.
    return {
        remaining: (24 * 3600) - currentSeconds + (RIFT_HOURS[0] * 3600),
        hour: RIFT_HOURS[0]
    };
}

function updateTimer() {

    const timer = document.getElementById("timer");
    const nextTime = document.getElementById("nextTime");

    if (!timer) return;

    const rift = getNextRift();

    const hours = Math.floor(rift.remaining / 3600);

    const minutes = Math.floor(
        (rift.remaining % 3600) / 60
    );

    const seconds = rift.remaining % 60;

    timer.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (nextTime) {
        nextTime.textContent =
            `${pad(rift.hour)}:00`;
    }
}

// První vykreslení
updateTimer();

// Aktualizace každou sekundu
setInterval(updateTimer, 1000);
