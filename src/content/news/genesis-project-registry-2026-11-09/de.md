---
title: "Genesis-Entwicklung: Ein dauerhaftes Register für Projekte"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Die main-Änderungen vom 9. November verbinden die Navigation mit einem persistenten VCT-Register. Stabile Mount-Identität, hostbezogenes Laden und eine abgesicherte Migration klären den Wechsel zwischen lokal und remote."
---

Ein Repository-Pfad ist nur auf der zugehörigen Maschine eindeutig. Laptop und Server können beide einen Ordner `demo` besitzen; beim Öffnen des einen darf nicht unbemerkt der andere ausgewählt werden. Die am **9. November 2026 in Genesis main integrierten Änderungen** ersetzen die zuletzt geöffneten Projekte in Projects durch ein datenbankgestütztes Register und führen die Aktivierung über den ausgewählten Knoten. [Projects-Integration][projects]

![Projektordner liegen in getrennten Host-Schränken und tragen passende Registermarkierungen](./project-host-registry.webp)

## Eine Identität, die beim Wiederöffnen bleibt

Der Virtual Context Tree, kurz VCT, ordnet einen absoluten Betriebssystempfad einem kanonischen Punkt wie `vct:///projects/demo` zu. Ein Mount ist diese Zuordnung mit Punkt, Pfad, Anzeigename und letztem Öffnungszeitpunkt. Er gibt der Navigation eine stabile Identität, ohne das Repository zu verschieben oder einen Dateisystem-Mount anzulegen. [Registerimplementierung][store]

Die erneute Registrierung desselben normalisierten Pfads aktualisiert den Zeitpunkt und behält den Punkt. Unterschiedliche Pfade mit gleichem Endnamen erhalten eigene Punkte, bei Bedarf mit Suffix. Existiert der alte Pfad nicht mehr, kann ein neuer Pfad mit passendem Anzeigenamen und Punkt-Endnamen den Punkt übernehmen. Das ist eine konkrete Umzugsregel und keine allgemeine Gleichsetzung ähnlich benannter Ordner. [Identitätsregeln][identity]

Gespeichert wird nun in der SQLite-Tabelle `vct_mounts` des Aufgabenstores. Der laufende VCT-Prozess hält einen Lesecache. Änderungen schreiben zunächst die gesamte Tabelle atomar und passen erst danach den Cache an. Schlägt das Speichern fehl, wird ein Fehler zurückgegeben und der alte Zustand bleibt erhalten. Erfolgreiche Änderungen senden eine knotenbezogene Benachrichtigung für die Oberflächenaktualisierung.

Das Register ist begrenzt: Standardmäßig behält es die 100 neuesten Mounts und verdrängt bei Überschreitung die ältesten. Es ist ein Arbeitsverzeichnis für die Navigation, kein unbegrenztes Archiv sämtlicher jemals geöffneter Repositories. [Speicherung und Kapazität][store]

## Suchen und Öffnen verwenden dieselben Einträge

Projects-Seite und Projektpalette greifen auf registrierte Mounts zu. Öffnen oder Erstellen ruft die knotenspezifische Schnittstelle `mount_project` auf und lädt anschließend die Liste neu. Pfadvorschläge durchsuchen zuerst registrierte Pfade ohne Beachtung der Großschreibung und ergänzen dann Dateisystem-Präfixvorschläge ohne Duplikate. Ein bekanntes Pfadstück kann so zum Projekt führen, ohne erneut beim übergeordneten Ordner zu beginnen. [Navigation im Detail][projects]

Der VCT-Punkt des aktiven Projekts wird zur Anzeige aus bereits geladenen Mounts ermittelt. Allein für ein Label wird kein neues Projekt registriert. Das Vergessen eines Projekts entfernt seinen Registereintrag, löscht aber keine Repository-Dateien. Navigation und Änderungen an der eigentlichen Arbeit bleiben getrennt.

## Den ausgewählten Host im Ablauf halten

Angenommen, ein Entwickler hat einen lokalen `demo`-Checkout und einen weiteren auf einem SSH-Server. Die Auswahl des Remote-Hosts lädt dessen Projektliste. Während der Verbindungsaufbau läuft, bleibt die Liste leer, statt lokale Einträge als Remote-Projekte anzubieten. Auch die Aktivierung wartet auf die fertige Verbindung. Eine für den Server bestimmte Anfrage läuft damit nicht auf dem noch lokalen Knoten. [Remote-Laden und Aktivierung][projects]

Remote-Pfade werden nach den Regeln des gewählten Hosts interpretiert, einschließlich unterstützter absoluter POSIX- und Windows-Pfade. Die Aktivierung erfolgt asynchron, damit Verzeichnisprüfung und Registrierung LiveView nicht blockieren. Eine Folgekorrektur entpackt das Remote-Mount-Ergebnis richtig, sodass das Projekt seinen VCT-Punkt erhält. [Remote-Mount-Korrektur][remote]

Der passende Prüfschritt ist konkret: Server erneut verbinden, registrierten Pfad suchen, öffnen und Host sowie angezeigten Punkt prüfen. Wiederholen Sie dies lokal. Ähnliche Ordnernamen dürfen eine wartende Remote-Ansicht nicht mit dem lokalen Register füllen.

## Vorhandene Projekteinträge gezielt übernehmen

In Entwicklungsbuilds mit diesen Änderungen erzeugt die Datenbankmigration VCT-Mounts aus nutzbaren alten `projects`-Zeilen, erhält nicht leere Anzeigenamen und behandelt Namenskollisionen. Sie behält die neuesten 100 Einträge. Leere oder relative Pfade werden protokolliert und übersprungen. Ist die alte Tabelle nicht lesbar, bricht die Migration ab und rollt zurück; Tabelle und Zeilen bleiben erhalten, statt den Lesefehler als leere Liste zu behandeln. [Migrationsschutz und vorgelagerte Tests][migration]

Sichern Sie vor einem solchen Build die Anwendungsdaten auf jedem betroffenen Host. Prüfen Sie nach dem Start den richtigen Host für bekannte Projekte, gleichbleibende Punkte beim Wiederöffnen und die Liste nach einem Neustart. Meldet der Start einen Migrationsfehler, behalten Sie Datenbank und Diagnoseausgabe zur Untersuchung, statt für eine leere Liste den Store zu löschen.

So wird die Projektgrenze bereits bei der Wahl des Arbeitsorts sichtbar. Zur Trennung von Codehistorien lesen Sie [Genesis mit mehreren Repositories: Ein Ziel, getrennte Historien](/de/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
