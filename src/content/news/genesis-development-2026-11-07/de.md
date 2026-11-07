---
title: "Genesis-Entwicklungsstand: Assistant und gemeinsamer Remote-Server"
pubDate: 2026-11-07
summary: "Der main-Zweig erhält einen Bedienchat, einen gemeinsamen Remote-Server und einfachere Hintergrundaufträge."
---

Die vom 4. bis 7. November 2026 in den Genesis-Zweig `main` aufgenommenen Änderungen verbessern den täglichen Betrieb.

Genesis Assistant wird zum Bedienchat im Dashboard: Er kann Aufgaben und Systemkapazität prüfen sowie Aufgabenaktionen oder Konfigurationsänderungen anfordern. Die Ausführungsstufen read/write/sudo trennen Abfragen von Aktionen, die eine Freigabe des genauen Codes erfordern; sudo besitzt eine eigene Freigabekarte. Die Grenzen erläutert der [Assistant-Leitfaden][assistant].

Remote-Entwicklung und HTTP-Dashboard teilen nun eine Serverinstanz. `genesis remote stop` deaktiviert die Remote-Verteilung, während HTTP weiterläuft. Hintergrundaufträge erhalten kurze Kennungen wie `bash-1`; bei genau einem Auftrag des aufrufenden Agenten kann `job_output` die Angabe `job_id` weglassen.

In Entwicklungsbuilds gehört ein abweichender OAuth-Zugangsdatenpfad nun zum jeweiligen Modellprofil (`[[llm.models]]`) statt zur globalen Einstellung `[llm] oauth_file`.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

