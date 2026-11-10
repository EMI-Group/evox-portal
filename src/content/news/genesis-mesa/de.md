---
title: "Genesis und MESA: Rückverfolgung numerischer Differenzen durch einen Fortran-zu-Rust-Rewrite"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Interpolationspräzision, analytische Jacobi-Matrizen und abgestimmte Benchmark-Eingaben zeigen, wie dreizehn MESA-Module in Rust neu aufgebaut und geprüft wurden."
---

Ein Rewrite wissenschaftlicher Software kann plausible Antworten liefern, während sich der numerische Pfad, der sie erzeugt hat, ändert. Der MESA-Fall von Genesis bietet konkrete Prüfungen für dieses Problem: originale Fortran-Ausgaben, erklärte Gleitkommadifferenzen, Solver-Schrittzähler und Benchmarks, die übereinstimmende Arbeitslasten vergleichen.

![Fortran- und Rust-Ausgaben unter einer Lupe verglichen](./mesa-numerical-continuity.webp)

*Konzeptillustration: Eine neue Implementierung wird gegen bestehendes numerisches Verhalten geprüft.*

Der [Evidence-Datensatz](https://genesis.evox.group/evidence/mesa/) berichtet von dreizehn neu entwickelten Modulen, 139.414 Zeilen Fortran und 89.946 Zeilen Rust. Die unten aufgeführten technischen Details stammen aus der [Repository-Revision 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), deren dokumentierte Benchmarks auf den 5. August 2026 datiert sind. Diese Benchmark-Ergebnisse behalten ihre eigenen Definitionen für Arbeitslast und Zeitmessung bei.

## Aufbau einer Abhängigkeitskette statt dreizehn isolierter Übersetzungen

Der Workspace folgt der Kette von Konstanten, Hilfsprogrammen und Mathematik über Matrizen, Interpolation und numerische Solver bis hin zu Chemie, Raten, Neutrinoverlusten, Reaktionsnetzwerken, Zustandsgleichung (EOS) und Opazität. Jedes ursprüngliche Modul hat ein entsprechendes Rust-Crate. Das [Workspace-Manifest](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) macht diese Paketbeziehungen explizit.

Dies bedeutet, dass eine Reaktionsnetzwerk-Aufgabe davon abhängt, dass numerische Routinen und physikalische Daten zusammen verwendbar sind. Öffentliche APIs und verzeichnisspezifische Kontextdokumente bilden den Integrationsvertrag. Die [Repository-Übersicht](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) beschreibt Rust-Structs, Methoden und `Result`-Werte, wobei die ursprünglichen Fortran-Namen in der Dokumentation beibehalten wurden, wo sie für den Abgleich nützlich sind.

Die Implementierung umfasst Rust-Solver, anstatt LAPACK oder BLAS über FFI aufzurufen. Der Umfang beschränkt sich auf den ausgewählten numerischen und physikalischen Stack: Die vollständigen Stern- und Doppelstern-Evolutions-Engines, der volle EOS-Blend und andere aufgeführte Komponenten liegen außerhalb des Ports.

## Warum eine Abweichung vom Referenzwert nicht durch eine einzige lose Toleranz gelöst wurde

Der [Golden-Test für zweidimensionale Interpolation](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) rekonstruiert das ursprüngliche 31-mal-35-Gitter und die Auswertungspunkte. Er unterscheidet zwischen Werten, die exakt übereinstimmen, und Werten, die eine dokumentierte Toleranz benötigen.

Die Untersuchung des Tests dokumentiert eine aufschlussreiche Diskrepanz. Einige ursprüngliche Fortran-Hermite-Interpolations-Temporärvariablen waren implizit `REAL(4)`: einfache Genauigkeit innerhalb einer ansonsten höherpräzisen Berechnung. Der Rust-Port verwendet `f64`. Die Quellkommentare berichten, dass eine explizit doppeltpräzise Fortran-Transkription mit dem Rust-Ergebnis übereinstimmte, während der ursprüngliche Pfad mit gemischter Präzision die ältere Referenzausgabe reproduzierte.

Die größte aufgezeichnete relative Differenz für diese Interpolationswerte lag bei etwa 3,05e-8, bei einer relativen Toleranz von 1e-7. Andere Größen behalten exakte Vergleiche oder wesentlich engere Toleranzen bei. Dies ist eine nützliche technische Unterscheidung: Der Test bewahrt den Ursprung einer numerischen Differenz, anstatt zuzulassen, dass jedes Ergebnis unter einem globalen Schwellenwert abweicht. Der `_sg`-Testblock für einfache Genauigkeit bleibt außerhalb des Ports.

## Das Reaktionsnetzwerk benötigte sowohl den Ableitungspfad als auch den Wertepfad

Die [Entwicklungsnotizen zum Reaktionsnetzwerk](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) beschreiben die Arbeit an der analytischen approx21-Jacobi-Matrix, also den Ableitungen, die vom steifen Solver verwendet werden. Ihre aufgezeichneten Vorher-Nachher-Messungen zeigen, dass sich die Prüfsumme näher an Fortran bewegt und die Integrationszähler eine exakte Übereinstimmung erreichen.

Für die dokumentierte Benchmark-Arbeitslast erreichten beide Implementierungen **199 Schritte: 198 akzeptiert und 1 abgelehnt**, mit **8.889 Funktionsauswertungen und 199 Jacobi-Auswertungen**. Diese Zähler helfen dabei, einen scheinbar schnelleren Durchlauf zu erkennen, der lediglich einen anderen Solver-Pfad genommen hat.

Eine verbleibende Differenz der Restprüfsumme von etwa 3,1e-9 blieb bestehen. Der [Benchmark-Helper](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) führt dies darauf zurück, dass der Fortran-Wertepfad Quad-Präzision verwendet, während Rust f64 nutzt. Das Test-Harness verwendet daher eine dokumentierte relative Prüfsummentoleranz von 1e-8; die Anforderung von 1e-9 markiert diese Arbeitslast absichtlich als fehlerhaft. Übereinstimmende Schrittzähler stützen den Vergleich, während die Differenz im Wertepfad explizit bleibt.

## Integrationstests prüfen auch, ob Module tatsächlich verbunden sind

Ein separater [Ein-Zonen-Integrationstest](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) führt den Burner mit einem Ideal-Gas-Provider und mit einem EOS-Tabellen-Provider über das öffentliche `BurnEosInfo`-Interface aus. Er erwartet, dass sich die beiden Berechnungen unterscheiden, prüft die Erhaltungssätze sowie endliche Ausgaben und verifiziert, dass die EOS-Aufrufe der Summe aus Funktions- und Jacobi-Auswertungen entsprechen.

Dies ist ein Verdrahtungstest mit einer spezifischen physikalischen Grenze: Die Burn-Temperatur überschreitet das Maximum der verfügbaren Tabelle, sodass der EOS-Lookup auf die oberste Zeile begrenzt wird. Er demonstriert, dass der Provider die Berechnung beeinflusst; es handelt sich nicht um die Validierung einer vollständigen Hochtemperatur-Stern-EOS. Seine Schrittzahlen gehören ebenfalls zu diesem separaten Test, nicht zum obigen Benchmark.

## Vergleich der gleichen Arbeit vor der Meldung einer Beschleunigung

Die [Arbeitslastspezifikation](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) legt Eingaben, Größen, Solver-Parameter und Prüfsummendefinitionen für beide Sprachen fest. Zum Beispiel wertet der Interpolations-Benchmark zwei Millionen deterministische Punkte auf demselben Gitter aus; das Setup liegt außerhalb dieser zeitgemessenen Schleife.

Der [Benchmark-Orchestrator](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) liest treiberinterne Zeitmessungen und Prüfsummen, vergleicht diese und schreibt einen Bericht. Die Tabelle vom 5. August in der README verwendet Mediane aus 15 Durchläufen, die auf die CPUs 0–3 fixiert wurden, und vergleicht gfortran `-O3 -march=native` mit dem Rust-Release-Profil.

| Ausgewählte Arbeitslast | Fortran | Rust | Gemeldete Beschleunigung |
| --- | --- | --- | --- |
| Zwei Millionen bikubische Auswertungen | 0,162522 s | 0,090700 s | 1,79× |
| Zehntausend Newton-Lösungen | 0,057918 s | 0,009029 s | 6,41× |
| Ein-Zonen-approx21-Burn-Proxy | 0,303473 s | 0,243294 s | 1,25× |

Quelle: [Versionierte Benchmark-Tabelle](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). Die Evidence-Seite berichtet separat über eine Median-Spanne von 1,55–6,87×. Diese Aufzeichnungen etablieren keine universelle Beschleunigung, und der Ein-Zonen-Proxy misst keine vollständige Sternsimulation.

## Folgen der Test- und Benchmark-Einstiegspunkte

Das Repository meldet **1.052 bestanden, 0 fehlgeschlagen und 18 ignoriert**. Die README identifiziert die ignorierten Tests als Benchmarks und den langsamen Burn über die volle Dauer. In einer vorbereiteten Rust- und Fortran-Umgebung lauten die dokumentierten Einstiegspunkte:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Dies sind quellendokumentierte Befehle, keine neue Reproduktion, die für diesen Artikel durchgeführt wurde. Der Betrag von 10,64 US-Dollar im Evidence-Datensatz deckt nur die Modell-Token ab; Modell, Anzahl der Episoden und Echtzeit wurden nicht gemeldet.

Für eine nützliche erste Inspektion lesen Sie den Interpolations-Golden-Test zusammen mit seinen Vergleichen der Originalausgaben und folgen Sie dann dem Eingabevertrag des Benchmarks. Dieser Pfad macht den Rewrite durch spezifisches numerisches Verhalten und gemessene Arbeit bewertbar.
