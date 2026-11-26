# PDF Summarizer – Chrome Extension

Chrome-Erweiterung, die auf Webseiten (z. B. Moodle-Kursseiten) automatisch alle verlinkten PDFs findet und sie an ein Backend schickt, das daraus per KI strukturierte Lernzusammenfassungen erstellt.

Das Backend dazu: **[PDFSummarizerBE](https://github.com/Daweenci/PDFSummarizerBE)** (ASP.NET Core, Gemini API)

**Stack:** JavaScript · Chrome Extensions (Manifest V3) · Service Worker · Content Scripts · `chrome.storage`

---

## Funktionsweise

```
Webseite ──▶ content.js ──▶ background.js (Service Worker) ──▶ PDFSummarizerBE ──▶ Gemini
             Links sammeln   PDFs per HEAD-Request erkennen      Zusammenfassung
                             und als Dateien hochladen           als JSON + PDF
```

1. **PDF-Erkennung**: Das Content Script sammelt alle Links der aktuellen Seite. Auf Moodle-Seiten werden dabei gezielt die Kursmaterialien mit ihrem Anzeigenamen ausgelesen.
2. **Prüfung im Hintergrund**: Der Service Worker prüft jeden Link per `HEAD`-Request auf den Content-Type `application/pdf`, parallel über `Promise.all`, und ermittelt den Dateinamen aus dem `Content-Disposition`-Header.
3. **Popup**: Nutzer hinterlegen ihren eigenen Gemini-API-Key (gespeichert in `chrome.storage.local`) und wählen zwischen *Zusammenfassung erstellen* und *Aufgaben erstellen*.
4. **Upload**: Die ausgewählten PDFs werden als Blobs geladen und per `multipart/form-data` an das Backend geschickt. Der API-Key wird dabei im Header mitgegeben.

## Projektstruktur

```
.
├── manifest.json      # Manifest V3: Berechtigungen, Service Worker, Content Script
├── background.js      # PDF-Erkennung und Kommunikation mit dem Backend
├── content.js         # Link-Extraktion auf der Seite (mit Moodle-Sonderfall)
├── popup/             # Popup-Oberfläche (API-Key, Aktionen)
└── icons/
```

## Installation (Entwicklermodus)

1. Repository klonen
2. In Chrome `chrome://extensions` öffnen und den **Entwicklermodus** aktivieren
3. **Entpackte Erweiterung laden** und diesen Ordner auswählen
4. Das [Backend](https://github.com/Daweenci/PDFSummarizerBE) lokal starten (erwartet unter `https://localhost:7133`)
5. Einen Gemini-API-Key unter [aistudio.google.com/apikey](https://aistudio.google.com/apikey) erstellen und im Popup eintragen

## Status

Prototyp. PDF-Erkennung, Popup und Upload an das Backend funktionieren. Die Auswahlansicht für einzelne PDFs ist noch in Arbeit.
