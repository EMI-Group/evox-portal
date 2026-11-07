---
title: "Genesis und MESA: Die Software hinter wissenschaftlichem Rechnen weiterentwickeln"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Die Rust-Neuentwicklung ausgewählter MESA-Module verbindet agentische Entwicklung mit Bewahrung und Modernisierung wissenschaftlicher Software."
---

*Aktualisiert am 7. November 2026. Historische Ergebnisse behalten ihren ursprünglichen Bezugszeitpunkt.*

Wissenschaftliche Entdeckungen hängen von Software ab, die numerische Methoden und Fachwissen bewahrt. Genesis verbindet bei der Neuentwicklung ausgewählter MESA-Module Agentic AI mit dieser Grundlage von AI for Science: Die Implementierung wird verbessert, vorhandenes numerisches Verhalten dient als Referenz für das zu Bewahrende.

## Ein klar begrenzter Auftrag

Der [Evidence-Eintrag vom 7. September 2026](https://genesis.evox.group/evidence/mesa/) umfasst **13 Module**, von **139.414 Fortran- zu 89.946 Rust-Zeilen**. Diese Snapshot-Zahlen sind nicht mit reinen Bibliothekszeilen gleichzusetzen.

Der Port enthält Interpolation, Löser, Reaktionsnetzwerke, Zustandsgleichung und Opazität. Er ersetzt nicht ganz MESA; stellare und binäre Entwicklungsengines sowie weitere dokumentierte Komponenten bleiben ausgenommen.

## Verhalten vor Geschwindigkeit

Jedes Modul entspricht einer Crate mit dokumentierten Schnittstellen und Bedingungen. Golden Tests vergleichen ursprüngliche Fortran-Ausgaben, Integrationstests prüfen das Zusammenspiel.

Numerische Gleichwertigkeit braucht Toleranzen und definierte Aufgaben. Ein gleicher Skalar kann abweichende Lösungswege verdecken; daher dokumentiert das Repository auch Integrationsschritte des Einzonen-Brennproxies. Das belegt mehr als ein erfolgreicher Build.

## Berichtete Validierung

Das Repository nennt **1.052 bestandene Tests, keine Fehler und 18 ignorierte Tests**. Ausgelassene Aufgaben müssen sichtbar bleiben. Die **10,64 US-Dollar** betreffen Modell-Tokens ohne Hardware; Modell, Episoden und Laufzeit sind nicht berichtet.

Die Ergebnisse wurden nicht unabhängig reproduziert. Sie gelten für den beschriebenen Port und Testumfang, nicht für sämtliche wissenschaftlichen MESA-Workflows.

## Benchmarkstände trennen

Evidence berichtet **1,55–6,87× mediane Beschleunigung**. Die README-Tabelle vom 5. August verwendet Mediane aus 15 Läufen und nennt **1,25×** für den durchgängigen Einzonen-Brennproxy. Daraus darf keine universelle Beschleunigung abgeleitet werden.

Vergleichen Sie gleiche Aufgaben, Daten, Compileroptionen und Toleranzen. Ein schnellerer Interpolationskern beschleunigt eine ganze Sternsimulation nicht automatisch um denselben Faktor.

## Ein Weg zur Modernisierung wissenschaftlicher Software

Die [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md) enthält Toolchain, Build-, Test- und Benchmarkanweisungen. Nach Einrichtung der Umgebung:

```bash
cargo test --workspace
```

Das [MESA-Neuentwicklungsrepository](https://github.com/EMI-Group/genesis-demo-mesa-rs) zeigt, wie agentische Entwicklung an wissenschaftliche Software mit bestehender Geschichte anknüpft. Für EvoX geht es darum, diese Infrastruktur anpassbar zu machen und überprüfbares wissenschaftliches Verhalten zu erhalten. Eine Ausweitung über die berichteten Module hinaus benötigt weitere fachliche Validierung.
