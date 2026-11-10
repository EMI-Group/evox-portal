---
title: "Genesis 0.14.1: Modellauswahl bleibt mit der Aufgabe verbunden"
pubDate: 2026-11-10
summary: "Anbieter-Kontoprofile verbinden Modell- und Reasoning-Auswahl; die Remote-Entwicklung nutzt einen gemeinsamen Server."
---

Zur Modellauswahl gehören auch Konto, Zugangsdaten und Reasoning-Einstellungen. Genesis 0.14.1 vom 8. November 2026 führt diese Auswahl durch Settings, Projects, Assistant, Scheduler und Laufzeit und verringert Unterschiede zwischen Aufgabenwunsch und tatsächlicher Ausführung. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![Ein ausgewählter Konto-Reiter bleibt mit den Modelloptionen verbunden](./provider-account-continuity.webp)

## Ein Profil für eine konsistente Auswahl

Kanonische Anbieterprofile trennen das Konto von der Modellauswahl. Gemeinsame Selektoren bieten Modell und Reasoning; Scheduler-Korrekturen erhalten explizite Aufgabenentscheidungen und die vollständige gespeicherte Konfiguration. Unterstützte Profile erhalten OAuth-/Abonnement-Anmeldung, individuellen Login-Status und den Import von Zugangsdaten aus Anbieter-CLIs.

## Ein Server für lokalen und entfernten Betrieb

Remote-Entwicklung nutzt nun wie das Headless-Dashboard genesis_server. Die separate Distribution genesis_remote entfällt. Die CLI verwaltet entfernten Start, Stopp, Status und Logs; Distribution lässt sich zur Laufzeit umschalten, während HTTP verfügbar bleibt.

## Übergabe beim Upgrade prüfen

Prüfen Sie nach dem Upgrade Konto, Modell und Reasoning in Settings sowie eine Aufgabe mit expliziter Auswahl. Eigene OAuth-Pfade gehören zu einzelnen Modellprofilen. Prüfen Sie die gemeinsame Serverstruktur vor der Wiederverwendung alter Daemon-Skripte. Die Release Notes enthalten Migration und Korrekturen vollständig. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant: Laufende Arbeit verstehen und steuern](/de/news/genesis-development-2026-11-07)
