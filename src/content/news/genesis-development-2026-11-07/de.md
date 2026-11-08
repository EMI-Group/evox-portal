---
title: "Genesis Assistant: Laufende Arbeit verstehen und steuern"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Aufgaben prüfen, Systemkapazität verstehen und in einem Gespräch handeln. Änderungen im main-Zweig vereinfachen zudem Remote-Dienste, Hintergrundaufträge und Modellzugangsdaten."
---

Bei einer lang laufenden Entwicklungsaufgabe bleiben nach dem Start Fragen offen: Was läuft noch, warum ist eine Aufgabe fehlgeschlagen und was soll als Nächstes geschehen? Die vom 4. bis 7. November 2026 in Genesis `main` aufgenommenen Änderungen führen diese Fragen im Assistant-Chat des Dashboards zusammen und verbessern die darunterliegenden Dienste.

![Konzeptillustration eines Gesprächs, das mehrere Aufgabenströme auf einer gemeinsamen Plattform verbindet](./genesis-assistant-task-flows.webp)

*Ein Gespräch, mehrere Arbeitsströme: eine redaktionelle Illustration des Kerngedankens dieser Aktualisierung.*

## Von der Aufgabe zur passenden Aktion

Genesis Assistant kann Quellcode und Dokumentation von Genesis lesen, Aufgaben prüfen und die aktuelle Kapazität des Schedulers abfragen. Sie können Status, Fehler und Ergebnis einer fehlgeschlagenen Aufgabe untersuchen lassen und anschließend etwa die Fortsetzung früherer Arbeit anfordern. Erklärung und Ausführung beziehen sich auf den gerade angezeigten Knoten.

Der [Assistant-Leitfaden][assistant] bietet konkrete Einstiegspunkte: laufende Arbeit auflisten, verfügbare Modellplätze prüfen oder die Planung während eines Merge pausieren. Bereits laufende Arbeit wird dabei fortgesetzt. Vorübergehende Laufzeiteinstellungen und gespeicherte Konfiguration bleiben getrennt; eine Sitzungsanpassung wird nicht stillschweigend zum dauerhaften Standard.

Abfragen verwenden die Stufe `read`. Änderungen laufen über `write` mit Freigabe des genauen Codes; `sudo` hat eine eigene Freigabekarte. So wird die geplante Aktion sichtbar, wenn aus einer Frage ein Eingriff wird.

## Ein Server, zwei Verbindungswege

Remote-Entwicklung und HTTP-Dashboard teilen sich jetzt eine Serverinstanz. Zuvor starteten die Remote-Befehle eine separate Instanz nur für die verteilte Verbindung. Mit dem [gemeinsamen Server][remote] deaktiviert `genesis remote stop` diese Verbindung, während das HTTP-Dashboard erreichbar bleibt. Das Trennen der Remote-Entwicklung erfordert damit keinen Stopp des gemeinsamen HTTP-Dienstes.

## Details, die das Nachverfolgen erleichtern

[Hintergrundaufträge][jobs] erhalten kurze Kennungen wie `bash-1`. Gehört dem aufrufenden Agenten genau ein Auftrag, findet `job_output` ihn ohne `job_id`. Bei mehreren Aufträgen werden Kennungen, Status und Bezeichnungen zurückgegeben, damit der Agent das richtige Ziel auswählen kann.

[Abweichende Pfade für OAuth-Zugangsdaten][oauth] gehören nun zum jeweiligen Modellprofil unter `[[llm.models]]` statt zur globalen Einstellung `[llm] oauth_file`. Individuelle Pfade lassen sich damit zusammen mit dem zugehörigen Modell verwalten.

Diese Änderungen schaffen klarere Anknüpfungspunkte für laufende Arbeit: eine zu prüfende Aufgabe, eine freizugebende Aktion und einen leichter nachvollziehbaren Dienstzustand. Die [Genesis-Einführung][intro] erklärt das Gesamtsystem; konkrete Operationen beschreibt der [Assistant-Leitfaden][assistant].

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /de/news/evox-genesis

