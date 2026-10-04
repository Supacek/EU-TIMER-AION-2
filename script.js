// =========================================
// AION 2 EU - ČASOVAČ ČASOPROSTOROVÝCH RIFTŮ
// =========================================

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
// AKTUÁLNÍ ČAS V SEKUNDÁCH
// =========================================

function getCurrentSeconds() {

    const now = getEUTime();

    return (
        now.hour * 3600 +
        now.minute * 60 +
        now.second
    );
}


// =========================================
// NAJÍT DALŠÍ RIFT
// =========================================

function getNextRift() {

    const currentSeconds = getCurrentSeconds();


    // Hledáme nejbližší Rift

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


    // Poslední Rift dne už proběhl.
    // Další je první Rift následujícího dne.

    return {

        remaining:
            (24 * 3600) -
            currentSeconds +
            (RIFT_HOURS[0] * 3600),

        hour:
            RIFT_HOURS[0]

    };
}


// =========================================
// AKTUALIZACE HLAVNÍHO ČASOVAČE
// =========================================

function updateTimer() {

    const timer =
        document.getElementById("timer");

    const nextTime =
        document.getElementById("nextTime");


    if (!timer) return;


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


    // Odpočet

    timer.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


    // Čas dalšího Riftu

    if (nextTime) {

        nextTime.textContent =
            `${pad(rift.hour)}:00`;

    }
}


// =========================================
// DNEŠNÍ ROZVRH RIFTŮ
// =========================================

function updateSchedule() {

    const schedule =
        document.getElementById("riftSchedule");


    if (!schedule) return;


    const currentSeconds =
        getCurrentSeconds();


    const nextRift =
        getNextRift();


    schedule.innerHTML = "";


    RIFT_HOURS.forEach(hour => {

        const riftSeconds =
            hour * 3600;


        const item =
            document.createElement("div");


        item.className =
            "rift-time";


        item.textContent =
            `${pad(hour)}:00`;


        // =====================================
        // NEJBLIŽŠÍ RIFT
        // =====================================

        if (hour === nextRift.hour) {

            item.classList.add("next");

        }


        // =====================================
        // JIŽ PROBĚHLÝ RIFT
        // =====================================

        else if (
            riftSeconds <= currentSeconds
        ) {

            item.classList.add("passed");

        }


        // =====================================
        // BUDOUCÍ RIFT
        // =====================================

        else {

            item.classList.add("future");

        }


        schedule.appendChild(item);

    });
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


    const popup =
        window.open(
            "",
            "AION2_RIFT_TIMER",
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no`
        );


    // Popup byl zablokovaný

    if (!popup) {

        alert(
            "Popup byl zablokován prohlížečem.\n\nPovol vyskakovací okna pro tuto stránku."
        );

        return;
    }


    // =========================================
    // OBSAH POPUPU
    // =========================================

    popup.document.write(`

<!DOCTYPE html>

<html lang="cs">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    AION 2 - Časovač Riftů
</title>


<style>

/* =========================================
   ZÁKLAD
   ========================================= */

* {
    box-sizing: border-box;
}


html,
body {

    margin: 0;

    width: 100%;

    height: 100%;

    overflow: hidden;

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


/* =========================================
   POPUP
   ========================================= */

.popup {

    width: 100%;

    height: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    background:
        radial-gradient(
            circle at 50% 10%,
            rgba(180, 135, 55, 0.08),
            transparent 55%
        ),
        #08080d;

    border: 1px solid
        rgba(150, 112, 50, 0.65);

}


/* =========================================
   NADPIS
   ========================================= */

.title {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 7px 15px;

    border-radius: 999px;

    background:
        linear-gradient(
            180deg,
            rgba(194, 148, 72, 0.18),
            rgba(194, 148, 72, 0.08)
        );

    color: #b9a77f;

    font-size: 12px;

    font-weight: 600;

    letter-spacing: 2px;

    text-transform: uppercase;

    margin-bottom: 22px;

}


.title::before {

    content: "";

    width: 8px;

    height: 8px;

    border-radius: 50%;

    background: #dfb45c;

    box-shadow:
        0 0 10px
        rgba(223, 180, 92, 0.65);

}


/* =========================================
   ODPOČET
   ========================================= */

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

    font-variant-numeric:
        tabular-nums;

    text-shadow:
        0 0 18px
        rgba(219, 174, 79, 0.25);

}


/* =========================================
   DALŠÍ RIFT
   ========================================= */

.open {

    margin-top: 17px;

    color: #7f8495;

    font-size: 13px;

}


.open strong {

    color: #ddd5c4;

    font-weight: 600;

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

        OTEVÍRÁ SE V

        <strong id="popupNextTime">

            --:--

        </strong>

        · EVROPA

    </div>


</div>


<script>


// =========================================
// ČASY RIFTŮ
// =========================================

const RIFT_HOURS =
    [2, 5, 8, 11, 14, 17, 20, 23];


// =========================================
// FORMÁT
// =========================================

function pad(number) {

    return String(number)
        .padStart(2, "0");

}


// =========================================
// AKTUÁLNÍ ČAS
// =========================================

function getCurrentSeconds() {

    const now = new Date();

    return (
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds()
    );

}


// =========================================
// DALŠÍ RIFT
// =========================================

function getNextRift() {

    const currentSeconds =
        getCurrentSeconds();


    for (
        const hour of RIFT_HOURS
    ) {

        const riftSeconds =
            hour * 3600;


        if (
            riftSeconds >
            currentSeconds
        ) {

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


// =========================================
// AKTUALIZACE POPUPU
// =========================================

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
    document.getElementById(
        "popupButton"
    );


if (popupButton) {

    popupButton.addEventListener(
        "click",
        openPopupTimer
    );

}


// =========================================
// SPUŠTĚNÍ
// =========================================

updateTimer();

updateSchedule();


// =========================================
// AKTUALIZACE KAŽDOU SEKUNDU
// =========================================

setInterval(
    () => {

        updateTimer();

        updateSchedule();

    },
    1000
);
