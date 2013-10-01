/* jshint jquery: true, devel: true */

/**
 * This Script generates Random Content and only works with the correct structure given.
 * Dont use it except you know what you're doing
 * The programming style is very lash since its just a
 * @type {string}
 */


//////////////////////////////
// Variables and Options    //
//////////////////////////////

var mediaWikiUrl = 'http://192.168.2.104/wiki';
var token = false;


//////////////////////////////
// Data for Randomizer      //
//////////////////////////////

var data = {};

var lokalesNetzwerk = [];

data.vornamenArray = [
    "Isaac", "Clives Staples", "William", "Orson Scott", "Arthur", "Robert", "Frank", "Jules",
    "H. G.", "Douglas", "Ursula", "Philip", "Ray", "George", "Dan", "Thomas", "G. K.", "Fritz"
];

data.nachnamenArray = [
    "Dick", "Lewis", "Clarke", "Asimov", "Heinlein", "Herbert", "Card", "Gibson", "Bradbury",
    "Verne", "Wells", "Orwell", "Simmons", "Adams", "Morus", "Chesterton", "Lang"
];

data.kundenVornamenArray = [
    "Computer", "Kaufhaus", "Metzgerei", "Elektronikfachhandel", "Mr.", "XXXL", "Friseur", "Pizzeria",
    "IT", "Baumarkt", "Elektro", "Kanzelei", "Praxis", "Gasthof", "Schneiderei", "Second Hand", "Hutladen"
];

data.kundenNachnamenArray = [
    "Ottokar", "Waldemar", "Willhelm", "Gundola", "Gerfried", "Edeltraut", "Bertel", "Otwin", "Siegfried", "Herbert",
    "Seppl", "Brunhilde", "Wastel", "Rolf", "Norbert", "Ute", "Gunther", "Brünhild", "Rüdiger"
];

data.ortArray = [
    "München", "Augsburg", "Friedberg", "Pasing", "Kissing"
];

data.strasseArray = [
    "Am Flugplatz", "George Orwell Platz", "Hauptstrasse", "Augustinerstrasse", "Rosental",
    "Viktualienmarkt", "Maximiliansplatz", "Oskar-von-Miller-Ring", "Ludwigstrasse", "Leopoldstrasse",
    "Adelgundenstraße"
];

data.abteilungenArray = [
    "Software", "Hardware", "BWL", "Geschäftsleitung", "Putzdienst", "Personalverwaltung",
    "Support", "Praktikant"
];

data.remoteHardwareArray = [
    "10.1.1.75", "10.1.1.62", "10.1.1.25", "10.1.1.16", "10.1.1.12",
    "10.1.2.11", "10.1.2.72", "10.1.2.55", "10.1.2.16", "10.1.2.12",
    "10.1.3.75", "10.1.3.82", "10.1.3.75", "10.1.3.16", "10.1.3.12"
];

data.herstellerArray = [
    "Microsoft", "Cisco", "D-Link", "Realtek", "Siemens", "Dell", "Lenovo", "TP-Link", "Xerox"
];

data.softwareArray = [
    "MS Office 2013", "MS Office 2010", "MS Excel 2013", "MS Access 2013", "MS Outlook 2013", "TeamViewer",
    "Ubuntu Server", "Debian Server", "Libre Office", "MS Windows 7", "MS Windows 8"
];


//////////////////////////////
// Functions                //
//////////////////////////////

/**
 * On Document Load
 */
$(function () {
    "use strict";

    log('SCRIPT LOADED');
    getToken();
});


/**
 * Gets Token which is required to use the MediaWiki API for editing/creating Content
 */
var getToken = function () {
    "use strict";

    $.getJSON(mediaWikiUrl + '/api.php?', {
        action: 'query',
        titles: 'Hauptseite',
        prop: 'info',
        intoken: 'edit',
        format: 'json'
    }, function (data) {
        if (data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }
        token = data.query.pages[1].edittoken;
        log('GET EditToken: ' + token);
    });
};

function batchMitarbeiter() {
    "use strict";
    var count = parseInt($('#count').val(), 10);
    if (!count) {
        count = 1;
    }
    for (var i = 0; i < count; i++) {
        generateMitarbeiter();
    }
}

function batchKunde() {
    "use strict";
    var count = parseInt($('#count').val(), 10);
    if (!count) {
        count = 1;
    }
    for (var i = 0; i < count; i++) {
        generateKunde();
    }
}



/**
 * Neuer Mitarbeiter
 */
var generateMitarbeiter = function () {
    "use strict";

    var text = '';
    var titel = '';

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }

    // KONTAKTDATEN

    var kontaktdaten = generateKontaktdaten();

    text += kontaktdaten.text;
    titel = kontaktdaten.titel;


    // SONSTIGE DATEN

    var abteilung = randomElement(data.abteilungenArray);
    var hardware = getHardwareModellName().titel + ', ' + getHardwareModellName().titel + ', ' + getHardwareModellName().titel;
    var software = randomElement(data.softwareArray) + ', ' + randomElement(data.softwareArray) + ', ' + randomElement(data.softwareArray);

    text +=
        '{{Mitarbeiter Daten' + '\n' +
            '|Abteilung=' + abteilung + '\n' +
            '|Hardwaremodell=' + hardware + '\n' +
            '|Software=' + software + '\n' +
            '}}' + '\n\n';


    // API Request senden:
    generatePage(titel, text, 'MITARBEITER');

    return titel;

};


/**
 * Neuer Kunde
 */
var generateKunde = function () {
    "use strict";

    var text = '';
    var titel = randomElement(data.kundenVornamenArray) + ' ' + randomElement(data.kundenNachnamenArray);

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }

    // Kundendaten
    text += '{{Kundendaten\n';
    text += '|Kunde seit=' + Math.floor(1990 + Math.random() * 24) + '\n';
    text += '|Beschreibung=Keine Bemerkungen\n}}\n';

    // Standorte verlinken & generieren
    text += '{{Standort Überschrift}}\n';

    for (var i = 0; i < Math.random() * 4; i++) {
        var standortTitel = randomElement(data.strasseArray) + ' ' + Math.floor(Math.random() * 200);
        text += '{{Standort Liste\n|Standort=' + standortTitel + '\n}}\n';
        // SUBROUTINE: Standorte generieren
        generateStandort(standortTitel);
    }

    // Remote Hardware generieren
    text += '{{Remote Hardware Überschrift}}\n';

    for (i = 0; i < Math.random() * 5; i++) {
        var remoteHardwareTitel = randomElement(data.remoteHardwareArray);
        text += '{{Remote Hardware Liste\n|Remote Hardware=' + remoteHardwareTitel + '\n}}\n';
    }

    // API Request senden:
    generatePage(titel, text, 'KUNDE');

    return titel;

};

/**
 * Standort generieren
 * @param standortTitel
 * @returns {*}
 */
var generateStandort = function (standortTitel) {
    "use strict";

    console.log('Standort generieren: ' + standortTitel);

    var text = '';
    var titel = standortTitel;

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }

    // KONTAKTDATEN
    var kontaktdaten = generateKontaktdaten();
    text += kontaktdaten.text;


    // LOKALE HARDWARE
    text += '{{Lokale Hardware Überschrift}}\n';

    lokalesNetzwerk = [];

    var anzahlLokaleHardware = Math.floor(Math.random() * 20) + 2;
    console.log('Generiere Lokale Hardware: #' + anzahlLokaleHardware);

    for (var i = 0; i < anzahlLokaleHardware; i++) {
        var ip = Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
        var hardwareTitel = standortTitel + '--' + ip;
        text += '{{Lokale Hardware Liste\n|Hardware=' + hardwareTitel + '\n}}\n';
        // SUBROUTINE: Standorte generieren
        lokalesNetzwerk.push({
            titel: hardwareTitel,
            ip: ip
        });
    }

    // SUBROUTINE: Lokale Hardware generieren
    generateLokaleHardware(lokalesNetzwerk);

    // API Request senden:
    generatePage(titel, text, 'STANDORT');

    return titel;

};

var generateLokaleHardware = function (lokalesNetzwerkArray) {
    "use strict";

    for (var i = 0; i < lokalesNetzwerkArray.length; i++) {

        var item = lokalesNetzwerkArray[i];
        console.log('Lokale Hardware generieren: ' + item.titel);

        var text = '';
        var titel = item.titel;
        var type = 'LOKALE HARDWARE';

        if (!token) {
            log('ERROR: No valid editToken found!');
        }

        // HARDWARE DATEN
        var hardware = getHardwareModellName();
        text += '{{Hardware Daten\n';
        text += '|IP=' + item.ip + '\n';
        text += '|Hardwaremodell=' + hardware.titel + '\n';
        text += '|Bezeichnung=' + 'EZ-' + Math.floor(Math.random() * 2048) + '\n';
        text += '|Domäne=MSHEIMNETZ\n';
        text += '}}\n';

        // SUBROUTINE: Generiere Modell
        generateHardwaremodell(hardware.hersteller, hardware.bezeichnung);

        // VERNETZUNG
        text += '{{Vernetzung Überschrift}}\n';

        if (i === 0) {
            // ROUTER
            type = 'LOKALER ROUTER';
            for (var d = 1; d < lokalesNetzwerkArray.length; d++) {
                var device = lokalesNetzwerkArray[d];
                text += '{{Vernetzung\n|Vernetzung=' + device.titel + '\n}}\n';
            }
        }

        // TODO: Vernetzung generieren

        // SOFTWARE LISTE
        text += '{{Software Überschrift}}\n';

        for (var j = 0; j < Math.random() * 5; j++) {
            var softwareTitel = randomElement(data.softwareArray);
            text += '{{Software Liste\n|Software=' + softwareTitel + '\n}}\n';
        }

        // PROBLEME
        text += '{{Problem Überschrift}}\n';

        // API Request senden:
        generatePage(titel, text, type);

    }

};

var generateHardwaremodell = function (hersteller, bezeichnung) {
    "use strict";

    var text = '';
    var titel = hersteller + ' ' + bezeichnung;

    console.log('Hardwaremodell generieren: ' + titel);

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }

    // HARDWARE DATEN
    text += '{{Hardwaremodell Daten\n';
    text += '|Hersteller=' + hersteller + '\n';
    text += '|Bezeichnung=' + bezeichnung + '\n';
    text += '}}\n';

    // PROBLEME
    text += '{{Problem Überschrift}}\n';
    text += '{{Problem\n |Problem=Internet geht nicht\n|Lösung=Router neustarten\n }}\n';
    text += '{{Problem\n |Problem=Kaputt\n|Lösung=Neu kaufen\n}}\n';

    // API Request senden:
    generatePage(titel, text, 'HARDWAREMODELL');

    return titel;

};

/**
 * Generiert sonstige Seiten
 * Aktuell: Abteilungen
 */
function generateRest() {
    "use strict";

    // Generate Abteilungen (leerer Inhalt)
    for (var i = 0; i < data.abteilungenArray.length; i++) {
        var titel = data.abteilungenArray[i];
        var text = '{{Abteilung}}\nNoch kein Inhalt.';
        generatePage(titel, text, 'ABTEILUNG');
    }

}


//////////////////////////////
// Hilfsfunktionen          //
//////////////////////////////

/**
 * Erstellt die Seite per API Request
 * @param titel
 * @param text
 * @param typ
 */
function generatePage(titel, text, typ) {
    "use strict";

    // API REQUEST:
    $.post(mediaWikiUrl + '/api.php?', {
        action: 'edit',
        title: titel,
        text: text,
        token: token,
        format: 'json'
    }, function (data) {

        if (data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }

        console.log('Neues Hardwaremodell - Request erfolgreich:');
        console.log(text);
        console.dir(data);
        log(typ.toUpperCase() + ' <a href="' + mediaWikiUrl + '/index.php?curid=' + data.edit.pageid + '" target="_blank">' + titel + '</a> CREATED / EDITED with ' + data.edit.result);
    });
}

function getHardwareModellName() {
    "use strict";

    var hersteller = randomElement(data.herstellerArray);
    var bezeichnung = 'Z-' + Math.floor(Math.random() * 5);

    return {
        titel: hersteller + ' ' + bezeichnung,
        bezeichnung: bezeichnung,
        hersteller: hersteller
    };
}

function generateKontaktdaten() {
    "use strict";

    var vorname = randomElement(data.vornamenArray);
    var nachname = randomElement(data.nachnamenArray);
    var mail = vorname + '.' + nachname + '@gmail.com';
    mail = mail.split(' ').join('_');
    var festnetz = '+49' + (Math.floor(Math.random() * 89212425716) + 82124257716);
    var handy = '+49' + (Math.floor(Math.random() * 89212425716) + 82124257716);
    var strasse = randomElement(data.vornamenArray) + ' Platz ' + Math.floor(Math.random() * 200) + 1;
    var ort = randomElement(data.ortArray);
    var plz = Math.floor(Math.random() * 90000) + 10000;

    var titel = vorname + ' ' + nachname;

    var text =
        '{{Kontaktdaten|Vorname=' + vorname + '\n' +
            '|Nachname=' + nachname + '\n' +
            '|Mail=' + mail + '\n' +
            '|Festnetz=' + festnetz + '\n' +
            '|Handy=' + handy + '\n' +
            '|Straße=' + strasse + '\n' +
            '|Ort=' + ort + '\n' +
            '|Postleitzahl=' + plz + '\n' +
            '}}' + '\n\n';

    return {
        titel: titel,
        text: text
    };
}

/**
 * Pads a Number
 * @param n
 * @returns {string}
 */
function pad(n) {
    "use strict";

    return n < 10 ? '0' + n : n;
}

/**
 * Write a Message to the Message Div
 * @param msg
 */
function log(msg) {
    "use strict";

    var currentdate = new Date();
    var time = pad(currentdate.getHours()) + ":" + pad(currentdate.getMinutes()) + ":" + pad(currentdate.getSeconds());
    $('#msg').append('<pre><div class="label label-info">' + time + '</div> ' + msg + '</pre>');
}

var randomElement = function (array) {
    "use strict";
    return array[Math.floor(Math.random() * array.length)];
};
