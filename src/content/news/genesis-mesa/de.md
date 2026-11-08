---
title: "Genesis und MESA: Code neu schreiben, numerisches Verhalten erhalten"
pubDate: 2026-11-03
updatedDate: 2026-11-08
summary: "Dreizehn MESA-Module wurden zu einem Rust-Workspace. Referenztests und ein Einzonen-Brennmodell zeigen, wie das Projekt numerische Kontinuität prüft."
---

Wissenschaftliche Software neu zu schreiben heißt, mehr als Algorithmen zu übernehmen. Auch das numerische Verhalten, auf dem spätere Berechnungen beruhen, muss erhalten bleiben. Im MESA-Fall von Genesis wurden dreizehn Fortran-Module als Rust-Crates neu entwickelt; ursprüngliche Ausgaben dienen als Referenz. Entscheidend ist, wie diese Kontinuität überprüfbar wird.

![Eine geschichtete Sternskulptur über zwei unterschiedlich gestalteten Ringen mit übereinstimmenden Konturen](./mesa-numerical-continuity.webp)

*Konzeptillustration: neue Implementierung, gemeinsame numerische Referenz.*

## Dreizehn Module als zusammenhängender numerischer Stack

Der [Evidence-Eintrag vom 7. September 2026](https://genesis.evox.group/evidence/mesa/) umfasst **13 Module**, von **139.414 Fortran- zu 89.946 Rust-Zeilen**. Diese Snapshot-Zahlen sind nicht mit reinen Bibliothekszeilen gleichzusetzen.

Der Port enthält Interpolation, Löser, Reaktionsnetzwerke, Zustandsgleichung und Opazität. Er ersetzt nicht ganz MESA; stellare und binäre Entwicklungsengines sowie weitere dokumentierte Komponenten bleiben ausgenommen.

## Die Berechnung prüfen, nicht nur den Build

Jedes Modul entspricht einer Crate mit dokumentierten Schnittstellen und Bedingungen. Golden Tests vergleichen ursprüngliche Fortran-Ausgaben, Integrationstests prüfen das Zusammenspiel.

Numerische Gleichwertigkeit braucht Toleranzen und definierte Aufgaben. Ein gleicher Skalar kann abweichende Lösungswege verdecken; daher dokumentiert das Repository auch Integrationsschritte des Einzonen-Brennproxies. Das belegt mehr als ein erfolgreicher Build.

## Was die Testbilanz enthält

Das Repository meldet **1.052 bestandene Tests, keine Fehler und 18 ignorierte Tests**; darunter sind Benchmarks und ein langsamer Brennlauf über die volle Dauer. Evidence nennt **10,64 US-Dollar Modell-Token-Kosten**, ohne Hardware; Modell, Episodenzahl und Laufzeit sind nicht angegeben.

Dies sind von der Quelle berichtete Ergebnisse eines einzelnen Laufs ohne unabhängige Reproduktion. Der dokumentierte Modul- und Workload-Umfang bietet einen konkreten Ausgangspunkt für die Prüfung.

## Zwei Momentaufnahmen, unterschiedliche Beschleunigungen

[Evidence](https://genesis.evox.group/evidence/mesa/) berichtet **1,55–6,87× mediane Beschleunigung**. Die README-Tabelle vom 5. August verwendet Mediane aus 15 Läufen und nennt **1,25×** für den durchgängigen Einzonen-Brennproxy. [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)

Für das Einzonen-Brennmodell dokumentiert die README in beiden Implementierungen **199 Integrationsschritte, davon 198 akzeptiert und 1 verworfen**. Dies gemeinsam mit Ausgabetoleranzen zu vergleichen macht die Zeitmessung aussagekräftiger als der Vergleich unterschiedlicher numerischer Rechenwege.

## Einen Workload reproduzieren, dann den Umfang erweitern

Die [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md) enthält Toolchain, Build-, Test- und Benchmarkanweisungen. Nach Einrichtung der Umgebung:

```bash
cargo test --workspace
```

Wählen Sie einen relevanten Workload und prüfen Sie Referenzausgaben, Toleranzen und Benchmark-Treiber im [MESA-Neuentwicklungsrepository](https://github.com/EMI-Group/genesis-demo-mesa-rs). Die [Genesis-Projektvorstellung](/de/news/evox-genesis) liefert den Hintergrund zur Agentenentwicklung; dieser Fall zeigt, wie sich benötigtes Verhalten nach einer Neufassung konkret überprüfen lässt.
