// =========================================
// AION 2 EU - ČASOVAČ ČASOPROSTOROVÝCH RIFTŮ
// =========================================


// =========================================
// ČASY RIFTŮ
// =========================================

const RIFT_HOURS = [
    2,
    5,
    8,
    11,
    14,
    17,
    20,
    23
];


// =========================================
// FORMÁTOVÁNÍ ČÍSEL
// =========================================

function pad(number) {

    return String(number).padStart(2, "0");

}


// =========================================
// AKTUÁLNÍ ČESKÝ / EU ČAS
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

    const currentSeconds =
        getCurrentSeconds();


    for (const hour of RIFT_HOURS) {

        const riftSeconds =
            hour * 3600;


        if (riftSeconds > currentSeconds) {

            return {

                remaining:
                    riftSeconds -
                    currentSeconds,

                hour:
                    hour

            };

        }

    }


    // =========================================
    // DALŠÍ RIFT JE ZÍTRA VE 02:00
    // =========================================

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
// HLAVNÍ ODPOČET
// =========================================

function updateTimer() {

    const timer =
        document.getElementById("timer");


    const nextTime =
        document.getElementById("nextTime");


    if (!timer) {

        return;

    }


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


    timer.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


    if (nextTime) {

        nextTime.textContent =
            `${pad(rift.hour)}:00`;

    }

}


// =========================================
// DNEŠNÍ ROZVRH RIFTŮ
// =========================================
//
// HTML obsahuje všech 8 políček.
// JavaScript pouze mění jejich stav.
//
// passed = Rift už proběhl
// future = Rift teprve bude
// next   = nejbližší Rift
//
// =========================================

function updateSchedule() {

    const schedule =
        document.getElementById("riftSchedule");


    if (!schedule) {

        return;

    }


    const currentSeconds =
        getCurrentSeconds();


    const nextRift =
        getNextRift();


    const items =
        schedule.querySelectorAll(
            ".rift-time"
        );


    items.forEach(item => {

        const hour =
            Number(
                item.dataset.hour
            );


        const riftSeconds =
            hour * 3600;


        item.classList.remove(
            "passed",
            "future",
            "next"
        );


        // =====================================
        // NEJBLIŽŠÍ RIFT
        // =====================================

        if (
            hour === nextRift.hour
        ) {

            item.classList.add(
                "next"
            );

            return;

        }


        // =====================================
        // JIŽ PROBĚHLÝ RIFT
        // =====================================

        if (
            riftSeconds <= currentSeconds
        ) {

            item.classList.add(
                "passed"
            );

            return;

        }


        // =====================================
        // BUDOUCÍ RIFT
        // =====================================

        item.classList.add(
            "future"
        );

    });

}


// =========================================
// NOTIFIKACE
// =========================================

// Kolik minut před Riftem upozornit
const NOTIFICATION_MINUTES_BEFORE = 5;


// Aktuální stav ON / OFF
let notificationsEnabled = false;


// Zabrání opakovanému upozornění
let lastNotifiedRift = null;


// =========================================
// TLAČÍTKO NOTIFIKACE - ON / OFF
// =========================================

async function toggleNotifications() {


    // =========================================
    // POKUD JSOU ZAPNUTÉ
    // → VYPNOUT
    // =========================================

    if (notificationsEnabled) {

        notificationsEnabled = false;

        localStorage.setItem(
            "aionNotificationsEnabled",
            "false"
        );

        updateNotificationButton();

        return;

    }


    // =========================================
    // PROHLÍŽEČ NOTIFIKACE NEPODPORUJE
    // =========================================

    if (
        !("Notification" in window)
    ) {

        alert(
            "Tento prohlížeč nepodporuje systémové notifikace."
        );

        return;

    }


    // =========================================
    // OPRÁVNĚNÍ UŽ JE POVOLENO
    // =========================================

    if (
        Notification.permission === "granted"
    ) {

        notificationsEnabled = true;

        localStorage.setItem(
            "aionNotificationsEnabled",
            "true"
        );

        updateNotificationButton();

        return;

    }


    // =========================================
    // POŽÁDAT O POVOLENÍ
    // =========================================

    try {

        const permission =
            await Notification.requestPermission();


        if (
            permission === "granted"
        ) {

            notificationsEnabled = true;

            localStorage.setItem(
                "aionNotificationsEnabled",
                "true"
            );

            updateNotificationButton();


        } else {

            notificationsEnabled = false;

            localStorage.setItem(
                "aionNotificationsEnabled",
                "false"
            );

            updateNotificationButton();

            alert(
                "Notifikace nebyly povoleny.\n\nPovol je v nastavení oprávnění pro tuto stránku."
            );

        }

    }

    catch (error) {

        console.error(
            "Chyba při žádosti o notifikaci:",
            error
        );

    }

}


// =========================================
// VZHLED TLAČÍTKA NOTIFIKACE
// =========================================

function updateNotificationButton() {

    const button =
        document.getElementById(
            "notifyButton"
        );


    if (!button) {

        return;

    }


    if (
        notificationsEnabled
    ) {

        button.textContent =
            "🔔 NOTIFIKACE ZAPNUTA";

        button.classList.add(
            "enabled"
        );


    } else {

        button.textContent =
            "🔔 UPOZORNIT MĚ";

        button.classList.remove(
            "enabled"
        );

    }

}


// =========================================
// POSLAT NOTIFIKACI
// =========================================

function sendRiftNotification(
    riftHour,
    riftDate
) {

    if (
        !notificationsEnabled
    ) {

        return;

    }


    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !== "granted"
    ) {

        return;

    }


    // =========================================
    // IDENTIFIKACE KONKRÉTNÍHO RIFTU
    // =========================================

    const notificationId =
        `${riftDate.getFullYear()}-${riftDate.getMonth()}-${riftDate.getDate()}-${riftHour}`;


    // =========================================
    // UŽ JSME TENTO RIFT OZNÁMILI
    // =========================================

    if (
        lastNotifiedRift === notificationId
    ) {

        return;

    }


    lastNotifiedRift =
        notificationId;


    // =========================================
    // NOTIFIKACE
    // =========================================

    new Notification(
        "AION 2 – Časoprostorový Rift",
        {

            body:
                `${pad(riftHour)}:00 – Rift se otevře za 5 minut!`,

            icon:
                "https://supacek.github.io/EU-TIMER-AION-2/favicon.ico",

            tag:
                "aion2-rift",

            renotify:
                true

        }
    );

}


// =========================================
// NAJÍT NEJBLIŽŠÍ RIFT PRO NOTIFIKACI
// =========================================

function getNextRiftDate() {

    const now =
        new Date();


    // =========================================
    // HLEDÁME DNEŠNÍ RIFT
    // =========================================

    for (
        const hour of RIFT_HOURS
    ) {

        const candidate =
            new Date(now);


        candidate.setHours(
            hour,
            0,
            0,
            0
        );


        if (
            candidate > now
        ) {

            return candidate;

        }

    }


    // =========================================
    // DNES UŽ ŽÁDNÝ RIFT NENÍ
    // → ZÍTRA 02:00
    // =========================================

    const tomorrow =
        new Date(now);


    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    tomorrow.setHours(
        RIFT_HOURS[0],
        0,
        0,
        0
    );


    return tomorrow;

}


// =========================================
// KONTROLA NOTIFIKACE
// =========================================
//
// Upozornění přijde přesně 5 minut
// před začátkem Riftu.
//
// 22:54:59 → nic
// 22:55:00 → 🔔 Rift za 5 minut
// 23:00:00 → Rift začíná
//
// Funguje i:
//
// 01:55:00 → 🔔 Rift za 5 minut
// 02:00:00 → Rift začíná
//
// =========================================

function checkForRiftNotification() {


    if (
        !notificationsEnabled
    ) {

        return;

    }


    const now =
        new Date();


    const nextRiftDate =
        getNextRiftDate();


    const remainingMilliseconds =
        nextRiftDate.getTime() -
        now.getTime();


    const remainingSeconds =
        Math.floor(
            remainingMilliseconds / 1000
        );


    const notificationSeconds =
        NOTIFICATION_MINUTES_BEFORE *
        60;


    // =========================================
    // PŘESNĚ 5 MINUT PŘED RIFTEM
    // =========================================

    if (
        remainingSeconds ===
        notificationSeconds
    ) {

        sendRiftNotification(
            nextRiftDate.getHours(),
            nextRiftDate
        );

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


    const popup =
        window.open(
            "",
            "AION2_RIFT_TIMER",
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no`
        );


    // =========================================
    // POPUP BLOKOVÁN
    // =========================================

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

            border:
                1px solid
                rgba(150, 112, 50, 0.65);

        }


        .title {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 8px;

            padding:
                7px 15px;

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

            flex-shrink: 0;

            border-radius: 50%;

            background: #dfb45c;

            box-shadow:
                0 0 10px
                rgba(223, 180, 92, 0.65);

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

            font-variant-numeric:
                tabular-nums;

            text-shadow:
                0 0 18px
                rgba(219, 174, 79, 0.25);

        }


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

        const RIFT_HOURS = [
            2,
            5,
            8,
            11,
            14,
            17,
            20,
            23
        ];


        function pad(number) {

            return String(number)
                .padStart(2, "0");

        }


        function getCurrentSeconds() {

            const now =
                new Date();


            return (

                now.getHours() * 3600 +

                now.getMinutes() * 60 +

                now.getSeconds()

            );

        }


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

                        hour:
                            hour

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

    <\/script>


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
// TLAČÍTKO NOTIFIKACE
// =========================================

const notifyButton =
    document.getElementById(
        "notifyButton"
    );


if (notifyButton) {

    notifyButton.addEventListener(
        "click",
        toggleNotifications
    );

}


// =========================================
// INICIALIZACE NOTIFIKACÍ
// =========================================
//
// Pokud už bylo oprávnění v prohlížeči
// povoleno, načteme poslední stav ON/OFF.
//
// =========================================

function initializeNotifications() {

    if (
        !("Notification" in window)
    ) {

        updateNotificationButton();

        return;

    }


    const savedState =
        localStorage.getItem(
            "aionNotificationsEnabled"
        );


    // =========================================
    // UŽIVATEL VYPNUL NOTIFIKACE
    // =========================================

    if (
        savedState === "false"
    ) {

        notificationsEnabled = false;

    }


    // =========================================
    // UŽIVATEL JE MÁ ZAPNUTÉ
    // =========================================

    else if (
        savedState === "true" &&
        Notification.permission === "granted"
    ) {

        notificationsEnabled = true;

    }


    // =========================================
    // POPRVÉ
    // =========================================
    //
    // Pokud jsou oprávnění už povolená
    // a uživatel ještě nemá uložený stav,
    // necháme notifikace zapnuté.
    //
    // =========================================

    else if (
        savedState === null &&
        Notification.permission === "granted"
    ) {

        notificationsEnabled = true;

        localStorage.setItem(
            "aionNotificationsEnabled",
            "true"
        );

    }


    else {

        notificationsEnabled = false;

    }


    updateNotificationButton();

}


// =========================================
// PRVNÍ SPUŠTĚNÍ
// =========================================

updateTimer();

updateSchedule();

initializeNotifications();


// =========================================
// AKTUALIZACE KAŽDOU SEKUNDU
// =========================================

setInterval(
    () => {

        updateTimer();

        updateSchedule();

        checkForRiftNotification();

    },
    1000
);
