/*jshint: jQuery */

"use strict";


//////////////////////////////
// Variables and Options    //
//////////////////////////////

var mediaWikiUrl = 'http://localhost/wiki';
var token = false;


//////////////////////////////
// Data for Randomizer      //
//////////////////////////////

var data = {};

data.vornamenArray = [
    "Isaac", "Clives Staples", "William", "Orson Scott", "Arthur", "Robert", "Frank", "Jules",
    "H. G.", "Douglas", "Ursula", "Philip", "Ray", "George", "Dan", "Thomas", "G. K."
];

data.nachnamenArray = [
    "Dick", "Lewis", "Clarke", "Asimov", "Heinlein", "Herbert", "Card", "Gibson", "Bradbury",
    "Verne", "Wells", "Orwell", "Simmons", "Adams", "Morus", "Chesterton"
];

data.kundenVornamenArray = [
    "Computer", "Kaufhaus", "Metzgerei", "Elektronikfachhandel", "Mr.", "XXXL", "Friseur", "Pizzeria",
    "IT"
];

data.kundenNachnamenArray = [
    "Salomo", "Josef", "Kain",  "Abel", "Saul", "Esther", "Habakuk", "Jeremia", "Jesaja", "Maleachi",
    "Petrus", "Thomas", "Herodes"
];

data.ortArray = [
    "München", "Augsburg", "Friedberg", "Pasing", "Kissing"
];

data.strasseArray = [
    "Am Flugplatz", "George Orwell Platz", "Hauptstrasse", "Augustinerstrasse", "Rosental",
    "Viktualienmarkt", "Maximiliansplatz", "Oskar-von-Miller-Ring", "Ludwigstrasse", "Leopoldstrasse"
];

data.abteilungenArray = [
    "Software", "Hardware", "BWL", "Geschäftsleitung", "Putzdienst", "Personalverwaltung",
    "Support", "Praktikant"
];

data.remoteHardwareArray = [
    "10.1.1.75", "Cisco A1 Router", "D-Link A2", "10.1.1.62", "10.1.1.25", "10.1.1.16", "10.1.1.12",
    "10.1.2.11", "Cisco A2 Router", "D-Link A3", "10.1.2.72", "10.1.2.55", "10.1.2.16", "10.1.2.12",
    "10.1.3.75", "Cisco A3 Router", "D-Link A4", "10.1.3.82", "10.1.3.75", "10.1.3.16", "10.1.3.12"
];

data.softwareArray = [
    "MS Office 2013", "MS Office 2010", "Adobe Photoshop", "MS Excel 2013", "MS Access 2013",
    "Ubuntu Server", "Debian Server", "Libre Office"
];

data.herstellerArray = [
    "Microsoft", "Cisco", "D-Link", "Realtek", "Siemens", "Dell", "Lenovo", "TP-Link", "Xerox"
];


//////////////////////////////
// Functions                //
//////////////////////////////

/**
 * On Document Load
 */
$(function() {
    log('SCRIPT LOADED');
    getToken();
});


/**
 * Gets Token which is required to use the MediaWiki API for editing/creating Content
 */
var getToken = function() {

    $.getJSON(mediaWikiUrl + '/api.php?', {
        action: 'query',
        titles: 'Hauptseite',
        prop: 'info',
        intoken: 'edit',
        format: 'json'
    }, function( data ) {
        if(data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }
        token = data.query.pages[1].edittoken;
        log('GET EditToken: ' + token);
    });
}


/**
 * Neuer Mitarbeiter
 */
var generateMitarbeiter = function() {

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

    var abteilung = $.rand(data.abteilungenArray);
    var hardware = $.rand(data.remoteHardwareArray) + ', ' + $.rand(data.remoteHardwareArray) + ', ' + $.rand(data.remoteHardwareArray);
    var software = $.rand(data.softwareArray) + ', ' + $.rand(data.softwareArray);

    text +=
        '{{Mitarbeiter Fakten' + '\n' +
        '|Abteilung=' + abteilung + '\n' +
        '|Hardware=' + hardware + '\n' +
        '|Software=' + software + '\n' +
        '}}' + '\n\n';


    // API REQUEST:
    $.post(mediaWikiUrl + '/api.php?', {
        action: 'edit',
        title: titel,
        text: text,
        token: token,
        format: 'json'
    }, function(data) {
        if(data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }
        console.log('Neuer Kunde - Request erfolgreich:');
        console.log(text);
        console.dir(data);
        log('MITARBEITER <a href="' + mediaWikiUrl + '/index.php?curid=' + data.edit.pageid + '" target="_blank">' + titel + '</a> CREATED / EDITED with ' + data.edit.result);
    });

    return titel;

}


/**
 * Neuer Kunde
 */
var generateKunde = function() {

    var text = '';
    var titel = $.rand(data.kundenVornamenArray) + ' ' + $.rand(data.kundenNachnamenArray);

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }


    // Standorte verlinken & generieren
    text += '{{Standort Überschrift}}\n';

    for (var i = 0; i < Math.random() * 4; i++) {
        var standortTitel = $.rand(data.strasseArray) + ' ' + Math.floor(Math.random()*200);
        text += '{{Standort Liste\n|Standort=' + standortTitel + '\n}}\n';
        // SUBROUTINE: Standorte generieren
        generateStandort(standortTitel);
    };

    // Remote Hardware generieren
    text += '{{Remote Hardware Überschrift}}\n';

    for (var i = 0; i < Math.random() * 5; i++) {
        var remoteHardwareTitel = $.rand(data.remoteHardwareArray);
        text += '{{Remote Hardware Liste\n|Remote Hardware=' + remoteHardwareTitel + '\n}}\n';
    };

    // Bemerkung
    text += '{{Kunde Infos\n|Bemerkungen=Keine Bemerkungen\n}}\n';

    // API Request senden
    $.post(mediaWikiUrl + '/api.php?', {
        action: 'edit',
        title: titel,
        text: text,
        token: token,
        format: 'json'
    }, function(data) {
        if(data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }
        console.log('Neuer Kunde - Request erfolgreich:')
        console.log(text);
        console.dir(data);
        log('KUNDE <a href="' + mediaWikiUrl + '/index.php?curid=' + data.edit.pageid + '" target="_blank">' + titel + '</a> CREATED / EDITED with ' + data.edit.result);
    });

    return titel;

}


var generateStandort = function(standortTitel) {

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
    for (var i = 0; i < Math.random() * 7; i++) {
        var ip = Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255);
        var hardwareTitel = standortTitel  +'-' + ip;
        text += '{{Lokale Hardware\n|Hardware=' + hardwareTitel + '\n}}\n';
        // SUBROUTINE: Standorte generieren
        generateLokaleHardware(hardwareTitel, ip);
    }


    // API REQUEST:
    $.post(mediaWikiUrl + '/api.php?', {
        action: 'edit',
        title: titel,
        text: text,
        token: token,
        format: 'json'
    }, function(data) {

        if(data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }

        console.log('Neuer Standort - Request erfolgreich:')
        console.log(text);
        console.dir(data);
        log('STANDORT <a href="' + mediaWikiUrl + '/index.php?curid=' + data.edit.pageid + '" target="_blank">' + titel + '</a> CREATED / EDITED with ' + data.edit.result);
    });

    return titel;

};

var generateLokaleHardware = function(hardwareTitel, ip) {

    console.log('Lokale Hardware generieren: ' + hardwareTitel);

    var text = '';
    var titel = hardwareTitel;

    if (!token) {
        log('ERROR: No valid editToken found!');
        return false;
    }

    // HARDWARE DATEN
    var hersteller = $.rand(data.herstellerArray);
    text += '{{Hardware\n';
    text += '|IP=' + ip + '\n';
    text += '|Bezeichnung=' + 'EZ-' + Math.floor(Math.random()*2048) + '\n';
    text += '|Hersteller=' + hersteller + '\n';
    text += '|Modellname=' + hersteller + ' Z-' + Math.floor(Math.random()*2048) + '\n';
    text += '|Domäne=MSHEIMNETZ\n';
    text += '}}\n';

    // VERNETZUNG
    text += '{{Vernetzung Überschrift}}\n';

    // SOFTWARE LISTE
    text += '{{Software Überschrift}}\n';

    for (var i = 0; i < Math.random() * 5; i++) {
        var softwareTitel = $.rand(data.softwareArray);
        text += '{{Software Liste\n|Software=' + softwareTitel + '\n}}\n';
    }

    // PROBLEME
    text += '{{Problem Überschrift}}\n';
    // {{Problem
    // |Problem=Internet geht nicht
    // |Lösung=Router neustarten
    // }}
    // {{Problem
    // |Problem=Geht nicht
    // |Lösung=Angeschlossen?
    // }}

    // API REQUEST:
    $.post(mediaWikiUrl + '/api.php?', {
        action: 'edit',
        title: titel,
        text: text,
        token: token,
        format: 'json'
    }, function(data) {

        if(data.error) {
            log('FEHLER BEIM API AUFRUF!');
            console.dir(data);
        }

        console.log('Neue lokale Hardware - Request erfolgreich:')
        console.log(text);
        console.dir(data);
        log('LOKALE HARDWARE <a href="' + mediaWikiUrl + '/index.php?curid=' + data.edit.pageid + '" target="_blank">' + titel + '</a> CREATED / EDITED with ' + data.edit.result);
    });

    return titel;

};




//////////////////////////////
// Hilfsfunktionen          //
//////////////////////////////


function generateKontaktdaten() {

    var vorname = $.rand(data.vornamenArray);
    var nachname = $.rand(data.nachnamenArray);
    var mail = vorname + '.' + nachname + '@gmail.com';
    mail = mail.split(' ').join('_');
    var festnetz = Math.floor(Math.random() * 892124257716) + 082124257716
    var handy = Math.floor(Math.random() * 892124257716) + 082124257716
    var strasse = $.rand(data.vornamenArray) + ' Platz ' + Math.floor(Math.random() * 200) + 1;
    var ort = $.rand(data.ortArray);
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

function log(msg) {
    var currentdate = new Date();
    var time = pad(currentdate.getHours())
        + ":" + pad(currentdate.getMinutes())
        + ":" + pad(currentdate.getSeconds());

    $('#msg').append('<pre><div class="label label-info">' + time + '</div> ' + msg + '</pre>');
}

(function($) {
    $.rand = function(arg) {
        if ($.isArray(arg)) {
            return arg[$.rand(arg.length)];
        } else if (typeof arg === "number") {
            return Math.floor(Math.random() * arg);
        } else {
            return 4;  // chosen by fair dice roll
        }
    };
})(jQuery);

function pad(n){
    return n<10 ? '0'+n : n;
}