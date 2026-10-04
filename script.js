// AION 2 EU - Časovač časoprostorových Riftů

const RIFT_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];


// =========================================
// AKTUÁLNÍ ČESKÝ ČAS
// =========================================

function getEUTime() {

    const now = new Date();

    return {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
    };
}


// =========================================
// FORMÁTOVÁNÍ ČASU
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


    // Hledáme nejbližší Rift
    for (const hour of RIFT_HOURS) {

        const riftSeconds = hour * 3600;

        if (riftSeconds > currentSeconds) {

            return {
                remaining: riftSeconds - currentSeconds,
                hour: hour
            };

        }
    }


    // Pokud už poslední Rift dne proběhl,
    // počítáme do prvního Riftu následujícího dne.

    return {
        remaining:
            (24 * 3600) -
            currentSeconds +
            (RIFT_HOURS[0] * 3600),

        hour: RIFT_HOURS[0]
    };
}


// =========================================
// AKTUALIZACE ČASOVAČE
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


    // Odpočet do dalšího Riftu

    timer.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


    // Čas dalšího Riftu

    if (nextTime) {

        nextTime.textContent =
            `${pad(rift.hour)}:00`;

    }
}


// =========================================
// SPUŠTĚNÍ ČASOVAČE
// =========================================

updateTimer();


// Aktualizace každou sekundu
setInterval(updateTimer, 1000);
