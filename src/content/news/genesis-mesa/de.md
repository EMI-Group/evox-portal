---
title: "Genesis baut 13 MESA-Module in Rust neu auf"
pubDate: 2026-11-03
summary: "Der MESA-Fall von Genesis zeigt die Neuentwicklung wissenschaftlicher Software mit 1,052 bestandenen Tests und gemeldeten Modell-Token-Kosten von 10.64 US-Dollar."
---

Wissenschaftliche Software muss bei einer Neuentwicklung ihr numerisches Verhalten bewahren. Der MESA-Eintrag vom 7. September 2026 beschreibt die Übertragung von **13 Fortran-Modulen in Rust-Crates**, mit der ursprünglichen Implementierung als Referenz.

Gemeldet werden **139,414 Zeilen Fortran → 89,946 Zeilen Rust**, **1,052 bestandene Tests** und **10.64 US-Dollar** Modell-Token-Kosten. Das Repository dokumentiert Referenztests gegen Fortran-Ausgaben sowie 18 ignorierte Tests zusätzlich zu den bestandenen.

Die in Evidence angegebenen medianen Beschleunigungen von **1.55–6.87×** gelten für Benchmarks, nicht pauschal für MESA. Separat nennt die README-Tabelle vom 5. August **1.25×** für das Einzonen-Brennen als durchgängige repräsentative Arbeitslast. Unterschiedliche Messstände und Arbeitslasten müssen getrennt bleiben.

Portiert wurden ausgewählte numerische und physikalische Module, nicht das gesamte MESA-System; Stern- und Doppelsternentwicklung liegen außerhalb des Umfangs. Verhaltensprüfungen machen den vorhandenen Code zur Grundlage der Neuentwicklung. Die Ergebnisse sind Eigenangaben ohne unabhängige Reproduktion; die Token-Kosten enthalten keine Hardwarekosten.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
