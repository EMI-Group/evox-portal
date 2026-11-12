---
title: "EvoRL: Gradienten, Geräte und Metriken in Einklang halten"
pubDate: 2026-11-08
summary: "Die Entwicklung vom 8. November behandelt JAX-Differentiation und Playground-Kompatibilität nach Korrekturen an Platzierung und Populationsmetriken."
---

Ein Lernlauf kann vor dem ersten Fortschritt scheitern oder mit Protokollen enden, die das Gemessene verschleiern. Die main-Änderungen von EvoRL vom 8. November 2026 behandeln JAX-Differentiation und Umgebungskompatibilität nach den Oktoberkorrekturen an Geräteplatzierung und Populationsmetriken. Der [Quelltag v0.2.0][s1] hält diesen Entwicklungsstand reproduzierbar fest.

![Ein simulierter Laufroboter zwischen ausgerichteten Kalibrierrahmen](./cover.webp)

*Konzeptillustration: Konsistentes Training benötigt mehrere aufeinander abgestimmte Ausführungsverträge.*

## Ein versionsabhängiger Gradientenpfad

Die [Kompatibilitätsänderung][s2] erweitert den lokalen Workaround auf JAX 0.12.0.1. In JAX 0.12.0 und 0.12.0.1 können Ableitungen von `erf` und `erfc` innerhalb von `shard_map` VMA-Prüfungen verletzen. Der betroffene Tanh-Normal-Pfad verwendet für diese Versionen eine alternative Normal-Log-CDF-Berechnung einschließlich einer Randentwicklung.

Beim kontinuierlichen Steuern muss die Policy-Verteilung differenzierbare Wahrscheinlichkeiten für Parameterupdates liefern. Eine Umgebung kann korrekt initialisieren und erst beim Gradienten scheitern. Die Korrektur ist versionsbegrenzt, andere JAX-Versionen behalten den bisherigen Pfad. Das getaggte README empfiehlt für diesen Stand die getestete Kombination JAX 0.11.0 mit CUDA 13.

## Annahmen zu Umgebung und Gerät explizit machen

Derselbe Commit begrenzt die Abhängigkeit auf `playground>=0.2.0,<1`, um die JAX/MJX-Schnittstelle des Adapters zu erhalten. Ändert ein Umgebungsupdate diese Schnittstelle, verändert es die Grundlage trotz gleicher Trainingskonfiguration.

Im Oktober wurden erfasste Array-Standardwerte durch explizite Kopien neu aufgebaut, damit Eager-JAX das aktive Mesh respektiert. ARS nutzt bei abgeschalteter Beobachtungsnormalisierung den normalen Evaluator und erhebt keine unpassenden Statistiken. Platzierung und Normalisierung werden damit überprüfbare Verträge statt versteckter Initialisierungsannahmen. [Geräte- und ARS-Korrektur][s3]

## Eine Population ist keine einzelne Policy

Die [Metrikkorrektur vom 28. Oktober][s4] unterscheidet Sammlungen und Einzelresultate. `pop_episode_returns` und `pop_episode_lengths` erhalten die Populationsachse; einzelne und zentrale Policies nutzen passende Singularnamen. Der einzelne ERL-EDA-Lerner bekommt skalare Trainingsmetriken, Lernersammlungen behalten Arrays.

Wer einen schon aggregierten Wert nochmals mittelt oder einen Populationsvektor als Skalar behandelt, kann beim Vergleich mit einer Einzelpolicy plausible, aber irreführende Kurven erzeugen. Prüfen Sie vor der Wiederverwendung von Analyseskripten Namen und Formen an der Protokollgrenze. Die Migration muss die beabsichtigten Reduktionen über Populationen, Episoden und Lerner erhalten.

## Vor der Fortsetzung einen kleinen Lauf reproduzieren

Der Quellstand erfordert Python 3.12 oder neuer und JAX/jaxlib 0.10.0 oder neuer. Die Distribution heißt `evorl-jax`, der Import bleibt `evorl`. Für Skripte und Konfigurationen den Tag auschecken und dessen Anleitung nutzen. Das Grundbeispiel lautet `python scripts/train.py agent=ppo env=brax/ant`.

Prüfen Sie Gradienten, Platzierung und Metrikformen in einem kleinen Lauf vor dem Kurvenvergleich. Aim gehört zum Standardlogging, optionale Recorder benötigen ihre SDKs. Bewahren Sie Umgebung, Seed und Budget auf. Die [EvoRL-Einführung][related] erklärt Lernen und Evolution; diese Änderungen machen die Annahmen einzelner Versuche überprüfbarer.

[s1]: https://github.com/EMI-Group/evorl/blob/v0.2.0/README.md
[s2]: https://github.com/EMI-Group/evorl/commit/5c889cad465ca88e3ec0d9112b0ec55835eb68fc
[s3]: https://github.com/EMI-Group/evorl/commit/a1ca25e9b232fdb6a6160c12cfc8bd702477096b
[s4]: https://github.com/EMI-Group/evorl/commit/992a554eb164a87ef9249592711cebd319ad9ebc
[related]: /de/news/evorl
