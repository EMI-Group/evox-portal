---
title: "Genesis verbindet Kontoeinrichtung, Modellauswahl und ChatGPT-Anmeldung"
pubDate: 2026-11-22
summary: "Ein erneuerter Anbieterassistent bündelt Zugangsdaten, Modellbestand, Denkstufen und Zeitpläne mit einer von Genesis verwalteten ChatGPT-Verbindung."
---

Eine nutzbare Modellverbindung braucht mehr als einen Namen: Authentifizierung, Endpunkt, unterstützte Denkstufen und gemeinsame Kontolimits müssen zusammenpassen. Am 19. und 20. November 2026 in Genesis `main` übernommene Änderungen bauen Welcome und Settings um Anbieterkonten neu auf. PR #175 ergänzt **Sign in with ChatGPT** und ersetzt den bisherigen Codex-Zugangsdatenimport für ChatGPT-Abonnementprofile. [Integration][pr]

![Ein Kontoschlüssel und ausgewählte Modellkomponenten liegen geordnet in einem Instrumentenkoffer](./cover.webp)

*Konzeptillustration: Authentifizierung und Modellauswahl gehören zu einem konfigurierten Konto.*

## Erst das Konto, dann die Modelle einrichten

Welcome verwendet einen schrittweisen Anbieterassistenten; Settings dient der weiteren Kontoverwaltung. Automatisch erzeugte Namen und Kennungen stammen vom Anbieter statt vom gewählten Modell. Ein Konto kann mehrere Modelle und Denkstufen mit gemeinsamen Zugangsdaten, Parallelität und Zeitplänen enthalten. Bei unterschiedlichen Eigenschaften bleiben getrennte Konten sinnvoll. [Profilvertrag][profiles]

Ein Team mit OpenAI-kompatiblem Endpunkt kann beispielsweise Basis-URL und Zugangsdaten einmal einrichten, tatsächlich angebotene Modelle hinzufügen und danach Modell und Denkstufe pro Aufgabe auswählen. Die Integration macht die API-Schlüsseleingabe für eigene Endpunkte erreichbar und leitet benutzerdefinierte Modellkonten über OpenAI Chat Completions. Jedes auswählbare Modell braucht weiterhin einen Inventareintrag; der Standardmodellname allein registriert es nicht. Testen Sie das gewählte Modell, nicht bloß ein ausgefülltes Zugangsdatenfeld. [Integration und Browserprüfungen][pr]

Der Assistent trennt angebotene Denkstufen vom Standardwert eines Modells. Der gewählte Standard gelangt in den gespeicherten Modelleintrag und die Verbindungsprüfung. Die kanonische Leiter lautet `none`, `minimal`, `low`, `medium`, `high`, `xhigh`; der Altwert `max` wird als `xhigh` gelesen und später entsprechend gespeichert. Anbieterspezifische Schreibweisen werden an der Anfragegrenze umgesetzt. Maßgeblich bleibt das konkrete Modell: Die angezeigte Leiter beweist nicht, dass jeder Endpunkt alle Stufen akzeptiert. [Denkstufenregeln][profiles]

## ChatGPT über Genesis autorisieren

Wählen Sie **ChatGPT Subscription** in Welcome oder **Settings → LLM → Provider accounts**. Die versionierte Anleitung nennt `genesis chatgpt login`, `genesis chatgpt status` und `genesis chatgpt models` für Anmeldung und Kontrolle. Im Quellcheckout lautet der Einstieg `mix genesis.chatgpt login`. Öffnen Sie die angezeigte URL im Browser und autorisieren Sie Genesis. [Abonnementanleitung][oauth]

Nutzen Sie danach **Check connection**, wählen Sie die Registrierung und ein dort verfügbares Modell. In Settings speichern Sie das Konto vor **Connection Test**; Welcome prüft das Modell vor Abschluss. Für Kompatibilität bleibt `provider = "openai_codex"` erhalten, zusammen mit `auth_mode = "oauth"`; `siwc_account` bezeichnet die Genesis-Registrierung.

Bestehende Abonnementprofile müssen über Genesis neu autorisiert werden: Früher aus Codex importierte Zugangsdaten werden hier nicht verwendet. Fehlt das zuvor gewählte Modell im neu ermittelten Bestand, wählen Sie ein verfügbares. OpenAI-API-Schlüsselkonten bleiben eine separate Möglichkeit. Für mehrere Registrierungen verwenden Sie einen Alias wie `genesis chatgpt login --account work` und wählen diesen im Profil. [Migration und Aliase][oauth]

## Die Verbindung auf dem Ausführungshost halten

Zugangsdaten des ausgewählten Kontos werden auf dem Ausführungsknoten aufgelöst und erneuert. Aktualisierungen zwischen Anmelde-CLI und laufendem Server werden serialisiert. Eine im Browser sichtbare Registrierung wird dadurch nicht mit einer Verbindung auf einem anderen entfernten Host verwechselt. [Kontospeicher][store]

Für selbst gehostete Installationen beschreibt die Anleitung SSH-Weiterleitung des Loopback-Anmeldeports und Anmeldung mit demselben Benutzerkonto und Konfigurationsverzeichnis wie der Genesis-Dienst. Sie dokumentiert auch geschützte Zugangsdatenübertragung und `GENESIS_SIWC_HTTPS_PROXY` für Hosts mit HTTP-CONNECT-Proxy. Befolgen Sie vor der Inferenzprüfung die jeweiligen Hostanweisungen; eine Laptop-Anmeldung konfiguriert keinen unabhängigen Server.

Die ChatGPT-Erneuerungs- und Streamingprüfungen der PR verwendeten Fixtures; eine frische Browserautorisierung mit einem realen ChatGPT-Konto war in dieser Prüfung noch offen. Eine tatsächliche Modellantwort auf dem gewünschten Host bestätigt Ihre eigene Einrichtung praktisch. [Prüfumfang][pr]

## Kontozeitpläne ausdrücklich festlegen

Dasselbe Kontomodell trägt Spitzen-/Nebenzeitparallelität, Zeitzone und Zeitplan. Neue Vorgaben können unterstützte Anbieterzeitpläne vorfüllen; ihre Slotzahlen sind jedoch editierbare Genesis-Standardwerte, keine Zusage von Anbieterkapazität oder Einsparungen. Alle Modelle eines Kontos teilen Slots; ein zusätzliches Modell schafft keinen neuen Quotenpool. [Vorgabenimplementierung][presets]

`off_peak_holidays = "CN"` ergänzt den mitgelieferten chinesischen Kalender einschließlich Ausgleichsarbeitstagen. Die statischen Daten decken 2025–2027 ab und aktualisieren sich nicht selbst. Prüfen Sie Zeitzone, Wochenendregeln und Annahmen der Vorgaben. Spitzenparallelität null stellt neue Anfragen zurück; verringerte Kapazität verdrängt keine laufenden Anfragen. [Zeitplansemantik][profiles]

Prüfen Sie nach Umstieg auf einen Build mit diesen Änderungen Modellbestand, Standarddenkstufe und Ausführungshost jedes Kontos. Autorisieren Sie ChatGPT erneut und führen Sie den Verbindungstest aus. Prüfen Sie bei geplanten Konten den gespeicherten Zeitplan und den nächsten erwarteten Wechsel. Das kontrolliert die Identitäten und Grenzen, die spätere Aufgaben tatsächlich nutzen.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
