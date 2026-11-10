---
title: "Genesis 0.14.1: Die Modellwahl durch die gesamte Aufgabe erhalten"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Kontobezogene Modellprofile, Abonnement-Anmeldung und ein gemeinsamer Remote-Server verändern die Konfiguration in Genesis 0.14.1. Die Mechanismen und Prüfschritte beim Upgrade."
---

Mit einem Modell wählen Sie auch das zahlende Konto, dessen Zugangsdaten und die Denkeinstellungen für die Aufgabe. **Genesis 0.14.1 wurde am 8. November 2026 regulär veröffentlicht** und führt diese Identität konsistent durch Settings, Projects, Assistant, Scheduler und Laufzeit. Die Version vereinheitlicht außerdem den Remote-Betrieb auf dem Headless-Server und erweitert die kontrollierte Untersuchung zur Laufzeit. [Vollständige Versionshinweise][release]

![Ein ausgewählter Kontoreiter bleibt mit seinen Modelloptionen verbunden](./provider-account-continuity.webp)

## Ein Konto konfigurieren, eine Aufgabe genau auswählen

Ein provider profile enthält Authentifizierung, Endpunkt, Parallelität und Zeitpläne. Das darunterliegende Modellinventar beschreibt verfügbare Modelle und modellspezifische Generierungs- und Denkeinstellungen. Die Aufgabenauswahl enthält keine Geheimnisse: Profil-ID, Modell-ID und optionalen Denkaufwand. Eine konkrete Auswahl fixiert diese Identität für die weitere Ausführung; **Auto** überlässt die Entscheidung den konfigurierten Regeln.

Zwei Modelle eines Arbeitskontos teilen beispielsweise dessen Parallelitätsplätze und Warteverhalten bei Ratenbegrenzung. Ein weiteres Modell erzeugt keinen eigenen Quotenpool. Ein persönliches Konto kann andere Zugangsdaten und Zeitpläne nutzen. Für getrennte API keys brauchen Sie neben unterschiedlichen Profil-IDs auch unterschiedliche Namen der Zugangsdaten. [Konfiguration und Auswahlregeln][profiles]

Jedes auswählbare Modell benötigt einen Eintrag in `[[llm.providers.models]]`; `default_model` allein genügt nicht. Der voreingestellte Denkaufwand ist unabhängig von der Liste unterstützter Stufen. Bei einer nicht leeren Liste ohne aufgelösten Standard wählt das Dashboard den ersten Wert; ein Aufruf der Kern-API ohne Denkaufwand kann den Parameter dagegen weglassen. Prüfen Sie Modell und Stufe nach einem Profilwechsel.

Die Version behebt verlorene explizite Auswahlen zwischen Aufgabe, Agent und System, fehlerhafte Scheduler-Ausweichpools und unvollständige gespeicherte Modellsnapshots, die `:model_spec_schema_unavailable` auslösen konnten. Archivierte Einstellungen sind nun JSON-sicher und verbergen Zugangsdaten. Das betrifft neue Aufgaben ebenso wie die Wiederverwendung gespeicherter Konfigurationen.

## Abonnement-Anmeldungen folgen der Kontokonfiguration

Unterstützte Profile erhalten OAuth-/Abonnement-Authentifizierung und einen eigenen Anmeldestatus. Genesis importiert Anmeldedateien der Anbieter-CLIs in eine verwaltete Datei für ReqLLM. `openai_codex` unterstützt ausschließlich OAuth; Anthropic-Abonnementprofile nutzen `auth_mode = "oauth"`. Die versionsgebundene Anleitung beginnt mit `codex login` oder einer Claude-CLI-Anmeldung auf dem Knoten, der das Konto nutzt. [Abonnement einrichten][oauth]

Standardmäßig liegt die verwaltete `auth.json` neben `config.toml`. Ein eigenes `oauth_file` gehört ins provider profile; der globale Schlüssel `[llm] oauth_file` entfällt. Neue Dateien erhalten Modus `0600`, Importe erfolgen atomar. Die Datei enthält einen Eintrag je provider. Unterschiedliche Profil-IDs allein trennen daher mehrere Abonnement-Anmeldungen nicht.

Prüfen Sie bei Remote-Ausführung den Anmeldestatus auf dem entfernten Knoten. Ist die Anbieteranmeldung vorhanden, das verwaltete Ziel aber schreibgeschützt, wählen Sie im Profil einen beschreibbaren privaten Pfad. Eine erneute Anmeldung behebt das Ziel nicht. Nur über Umgebungsvariablen bereitgestellte OAuth tokens lassen sich nicht automatisch erneuern. Die überarbeiteten Statusmeldungen unterscheiden diese Fälle.

## Ein Server für Remote-Arbeit und Dashboard

Die separate Distribution `genesis_remote` entfällt. Remote-Befehle und Bootstrap nutzen den gemeinsamen `genesis_server`. HTTP bleibt verfügbar; Erlang distribution lässt sich zur Laufzeit über ein durch SIGHUP ausgelöstes Dateiprotokoll umschalten. Die CLI bietet `genesis remote start`, `stop`, `status` und `logs`. [Server und Installation][readme]

Wenn das Dashboard auf dem Laptop bleibt und Aufgaben auf einem SSH-Host laufen, ändert sich die Dienstverwaltung: Prüfen Sie Skripte mit dem alten Distributionsnamen und verwalten Sie den gemeinsamen Server. Hinzu kommen Remote-Projekttests und das Fortsetzen von Testläufen beim Aufruf. Der Headless-HTTP-Server lauscht standardmäßig auf localhost und hat keine integrierte Authentifizierung; der dokumentierte Fernzugriff nutzt einen SSH-Tunnel.

## Interaktionen in langen Läufen leichter fortsetzen

Der gestufte, vermittelte Elixir-Evaluator ergänzt die Freigabe des genauen Codes und eine im Chat wiederaufnehmbare Freigabe. Ausgabe wird auf das verbleibende Budget gekürzt, statt deshalb fehlzuschlagen. Weitere Änderungen sind ein kurzes Wiederherstellungsfenster nach dem Rundenlimit, werkzeugfreie Schlussantworten, kürzere fortlaufende Job-IDs und stabile Prompt-Cache-Identitäten je Agentenlauf für GPT-Aufrufe über OpenAI/Codex. Das Dashboard erhält zudem ein zusammengeführtes Kapselpanel und gemeinsame Aufgaben-/Modellsteuerungen. [Änderungen im Detail][release]

## Mit sichtbarer Konfiguration aktualisieren

1. Nutzen Sie die Installationsdateien oder Serverarchive von [v0.14.1][release] für Ihre Plattform. Sichern Sie vor Änderungen an der Kontostruktur Ihre Konfiguration. Das alte `[[llm.models]]` bleibt kompatible Eingabe; kanonische provider profiles haben Vorrang, und explizites Speichern in Settings/config führt die Migration aus.
2. Prüfen Sie unter **Settings → LLM → Provider profiles** Authentifizierung, Modellinventar, Denkstandards und eigene `oauth_file`-Pfade. Der ausführende Prozess muss die Zugangsdaten erreichen, auch auf einem Remote-Server.
3. Nutzen Sie nach dem Neustart des Headless-Servers `genesis status`. Prüfen Sie danach eine explizite Profil-/Modell-/Stufenauswahl, Auto und die tatsächlich genutzte Remote-Verbindung. Kontrollieren Sie alte Daemon-Skripte vor der Wiederverwendung. Diese Prüfschritte ergeben sich aus den dokumentierten Änderungen.

Zur Bedienung laufender Aufgaben lesen Sie [Genesis Assistant: Laufende Arbeit klarer überblicken](/de/news/genesis-development-2026-11-07).

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
