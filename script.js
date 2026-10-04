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
// FORMÁTOVÁNÍ ČÍSEL
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


    // Najdeme nejbližší Rift

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
    // počítáme do prvního Riftu dalšího dne.

    return {
        remaining:
            (24 * 3600) -
            currentSeconds +
            (RIFT_HOURS[0] * 3600),

        hour: RIFT_HOURS[0]
    };
}


// =========================================
// AKTUALIZACE HLAVNÍHO ČASOVAČE
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
// POP OUT TIMER
// =========================================

function openPopupTimer() {

    const popupWidth = 430;
    const popupHeight = 280;

    const left =
        Math.round(
            (screen.width - popupWidth) / 2
        );

    const top =
        Math.round(
            (screen.height - popupHeight) / 2
        );


    const popup = window.open(
        "",
        "AION2_RIFT_TIMER",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no`
    );


    if (!popup) {

        alert(
            "Popup byl zablokován prohlížečem. Povol vyskakovací okna pro tuto stránku."
        );

        return;
    }


    popup.document.write(`
<!DOCTYPE html>

<html lang="cs">

<head>

<meta charset="UTF-8">

<title>AION 2 - Časovač Riftů</title>

<style>

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    width: 100%;
    height: 100%;
}

body {

    background: #08080d;

    color: #d8d5cf;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    display: flex;

    align-items: center;

    justify-content: center;

}

.popup {

    width: 100%;
    height: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    border: 1px solid rgba(150, 112, 50, 0.65);

    background:
        radial-gradient(
            circle at 50% 10%,
            rgba(180, 135, 55, 0.08),
            transparent 55%
        ),
        #08080d;

}

.title {

    color: #b9a77f;

    font-size: 12px;

    font-weight: 600;

    letter-spacing: 2px;

    text-transform: uppercase;

    margin-bottom: 20px;

}

.timer {

    color: #f2d37f;

    font-family:
        Georgia,
        "Times New Roman",
        serif;

    font-size: 58px;

    font-weight: 700;

    line-height: 1;

    letter-spacing: 1px;

    text-shadow:
        0 0 18px rgba(219, 174, 79, 0.25);

}

.open {

    margin-top: 16px;

    color: #7f8495;

    font-size: 13px;

}

.open strong {

    color: #ddd5c4;

}

</style>

</head>

<body>

<div class="popup">

    <div class="title">
        DALŠÍ ČASOPROSTOROVÝ RIFT
    </div>

    <div
        id="popupTimer"
        class="timer"
    >
        --:--:--
    </div>

    <div class="open">

        Otevírá se v

        <strong id="popupNextTime">
            --:--
        </strong>

        · Evropa

    </div>

</div>


<script>

const RIFT_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

function pad(number) {
    return String(number).padStart(2, "0");
}

function getNextRift() {

    const now = new Date();

    const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

    for (const hour of RIFT_HOURS) {

        const riftSeconds =
            hour * 3600;

        if (riftSeconds > currentSeconds) {

            return {
                remaining:
                    riftSeconds -
                    currentSeconds,

                hour: hour
            };

        }
    }

    return {

        remaining:
            (24 * 3600) -
            currentSeconds +
            (RIFT_HOURS[0] * 3600),

        hour:
            RIFT_HOURS[0]
    };
}

function updatePopupTimer() {

    const rift =
        getNextRift();

    const hours =
        Math.floor(
            rift.remaining / 3600
        );

    const minutes =
        Math.floor(
            (rift.remaining % 3600) / 60
        );

    const seconds =
        rift.remaining % 60;


    document.getElementById(
        "popupTimer"
    ).textContent =
        pad(hours) +
        ":" +
        pad(minutes) +
        ":" +
        pad(seconds);


    document.getElementById(
        "popupNextTime"
    ).textContent =
        pad(rift.hour) +
        ":00";
}

updatePopupTimer();

setInterval(
    updatePopupTimer,
    1000
);

</script>

</body>

</html>
    `);

    popup.document.close();

}


// =========================================
// TLAČÍTKO POP OUT TIMER
// =========================================

const popupButton =
    document.getElementById("popupButton");


if (popupButton) {

    popupButton.addEventListener(
        "click",
        openPopupTimer
    );

}


// =========================================
// SPUŠTĚNÍ HLAVNÍHO ČASOVAČE
// =========================================

updateTimer();


// Aktualizace každou sekundu

setInterval(
    updateTimer,
    1000
);
