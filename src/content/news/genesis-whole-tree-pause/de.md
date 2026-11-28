---
title: "Genesis pausiert den gesamten Aufgabenbaum, ohne unfertige Kinder abzuschließen"
pubDate: 2026-11-26
summary: "Ein koordinierter Snapshot bewahrt Wartepositionen der Eltern, Identitäten der Kinder und Worktree-Checkpoints und setzt dieselbe Aufgabe sauber oder mit Reparatur fort."
---

Eine Entwicklungsaufgabe kann beim Drücken von Pause noch auf mehrere Kindagenten warten. Deren Stapel nur zum Anhalten abzuschließen würde die zu bewahrende Arbeit verändern. Genesis-Änderungen auf main vom 25. November 2026 führen einen koordinierten Snapshot des gesamten Baums ein: Eltern behalten ihre Warteposition, Kinder ihre Identität und Checkpoints. Die Fortsetzung stellt diese Beziehungen unter derselben Aufgaben-ID wieder her. [Snapshot-Entwurf und Implementierung][design]

![Ein verzweigtes Mobile wird durch einen Stützrahmen in Position gehalten](./cover.webp)

*Konzeptillustration: Jeden unfertigen Zweig bewahren, bevor die gesamte Struktur weiterläuft.*

## Pause ist ein Aufgabenzustand, keine globale Drossel

Die globale Scheduler-Pause stoppt die Annahme neuer Arbeit; sie versetzt keine einzelne laufende Aufgabe in einen dauerhaft gespeicherten Ruhezustand. Das Aufgabenprotokoll führt über pausing zu paused, bewahrt den Ergebniskontext und lässt den Abschlusszeitpunkt leer. Abbrechen bleibt eine eigene Aktion und hat Vorrang, wenn sie während der Pause eintrifft. Interaktive Sitzungen gehören nicht zu diesem Protokoll. [Registry-Integration][registry]

Ein Agent, der einen Parser und dessen Tests koordiniert, kann beispielsweise auf zwei Kinder warten. Die Pause muss dieses Warten bewahren, statt abgeschlossene Ergebnisse zu erfinden. Der Koordinator markiert die aktiven Aufgabenmitglieder, entfernt wartende Modell- und Werkzeugslot-Anfragen und parkt Eltern, die auf ihren Subagentenstapel warten. Jeder Agent stoppt an einer Rundengrenze nach dem Werkzeugstapel oder an seiner geparkten Warteposition. [Einfrierkoordinator][coordinator]

## Arbeit sichern, bevor Ressourcen freigegeben werden

Vor dem Stopp räumt ein Agent Hintergrundjobs auf, erstellt einen Worktree-Checkpoint, bewahrt die dauerhafte Markierung ausstehender Werkzeuge und schreibt seinen Zustand. Checkpoint-Commits werden verankert, damit eine spätere Worktree-Freigabe sie nicht verwirft. Der Snapshot hält fest, ob der Agent an einer Rundengrenze, beim Warten auf Kinder oder in einem unterbrochenen Stapel war. Die Pause meldet ihr eigenes Ergebnis; sie meldet kein unfertiges Kind als erfolgreich und führt dessen Arbeit nicht zusammen. [Einfrierpfad des Agenten][agent]

Die Wartezeit ist begrenzt. Dokumentiert sind standardmäßig 120 Sekunden bis zum Ruhezustand und anschließend 10 Sekunden Nachfrist für erzwungenes Einfrieren. Eine saubere Pause verlangt von jedem Agenten den Nachweis eines ununterbrochenen dauerhaften Stopps. Läuft die Frist ab oder fehlt dieser Nachweis, wird eine dirty pause gespeichert. Das beschreibt den gesicherten Ausführungszustand und verspricht keine Rücknahme beliebiger externer Nebenwirkungen.

## Die bestehende Zusammenarbeit rekonstruieren

Die Fortsetzung stellt dieselbe Aufgabe mit ihren gespeicherten Optionen erneut in die Warteschlange. Ein dauerhafter Wurzeleintrag ist nötig; Kindzeilen allein reichen nicht, und ein unlesbarer Zustandsspeicher erzeugt einen expliziten Fehler. Der Wiederherstellungsplan baut Identitäten, Topologie und Positionen auf. Ein abgeschlossenes Kind liefert sein gespeichertes Ergebnis, ein laufendes startet mit eigener Identität und Checkpoint neu, und ein vor der Registrierung eingefrorenes Kind kann aus der ursprünglichen Aufrufspezifikation starten. Der Elternagent wartet auf echte Ergebnisse. [Auftaupfad][thaw]

Ein sauber eingefrorener Stapel wird ohne die Reparatur offener Werkzeugaufrufe für unterbrochene Arbeit wiederhergestellt. Ein dirty Snapshot erhält eine Reparatur und einen Fortsetzungshinweis. So bleiben nachweislich abgeschlossene Arbeit und unsichere Ausführung getrennt. Ein nicht belegbarer Checkpoint darf nicht stillschweigend als sauberer Kind-Checkpoint übernommen werden. Nach Neustart oder Lease-Abgleich wird eine running- oder pausing-Aufgabe mit Persistenz und dauerhaftem Wurzeleintrag als dirty pausiert; nicht fortsetzbare Aufgaben scheitern weiterhin bei abgelaufener Lease.

## Eine Pause und Fortsetzung zunächst prüfen

Verwenden Sie einen Quellbuild mit diesen Commits und aktivierter dauerhafter Agentenspeicherung. Pausieren Sie eine Entwicklungsaufgabe mit aktiven Kindern, warten Sie auf paused und setzen Sie sie fort. Prüfen Sie Aufgabenidentität, Kindbeziehungen und gesicherte Arbeit. Beachten Sie Hinweise auf eine dirty pause, bevor externe Operationen weiterlaufen. Ohne Persistenz wird Pause abgelehnt; Wiederherstellung reicht nur bis zu dauerhaften Checkpoints. Der [bisherige Aufgabenablauf][related] liefert den Projekt- und Freigabekontext; diese Änderung definiert den Erhalt unfertiger Ausführung.

Weiterführende Aktualisierung · 2026-11-28: [Genesis v0.15.0: Projektarbeit von der Anmeldung bis zur Wiederaufnahme verbinden](/de/releases/genesis-0-15-0).

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /de/news/genesis-assistant-project-workflows
