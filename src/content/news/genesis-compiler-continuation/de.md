---
title: "Genesis Compiler Handoff: Was das nächste Modell erbt und wie die Kontinuität geprüft wird"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Ein Modell-Handoff behält eine akzeptierte Compiler-Abstammung bei. Das berichtete Ergebnis und die Regressions-Harnesses des öffentlichen Compilers zeigen auf, was über diese Grenze hinweg geprüft werden kann."
---

Der [Evidence-Datensatz vom 7. September 2026](https://genesis.evox.group/evidence/compiler-continuation/) beschreibt einen Compiler-Handoff von **GLM 5.2 zu DeepSeek V4 Flash**, ohne den Gesprächskontext des vorherigen Agenten zu übertragen. Der akzeptierte Quellbaum und die Git-Historie blieben verfügbar. Die technische Fragestellung lautet, was das empfangende Modell inspizieren kann und wie nachfolgende Änderungen bewertet werden können.

![Ein Compiler-Projekt, das zwischen verschiedenen Toolsets beibehalten wurde](./compiler-model-handoff.webp)

Der Datensatz berichtet, dass **1.820/1.820 beibehaltene LLVM SingleSource-Fälle** nach der Fortsetzung bestanden haben, wobei die Task-Rekursionstiefe von 4 auf 8 stieg. Ein Transkript pro Fix oder das hinzugefügte Codevolumen und die Kosten der Fortsetzung werden nicht veröffentlicht. Die unten aufgeführten öffentlichen jcc-Quellen erläutern die Schnittstellen und Regressionsmechanismen des Compilers; ihr separater Snapshot rekonstruiert nicht die exakte Abfolge der Handoff-Aktionen.

## Ein geerbter Compiler hat Grenzen, die ein Nachfolger wahren muss

Die [jcc-Architektur](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) trennt Frontend, die typisierte Zwischenrepräsentation CIR, Optimizer, Maschinencode-Backend, Assembler und den Command-Line-Driver. Das Frontend übergibt einen geprüften Syntaxbaum an das Lowering; spätere Stufen verarbeiten die resultierende Repräsentation, anstatt den ursprünglichen Quellcode unabhängig neu zu interpretieren.

Dies ist von Bedeutung, wenn ein neues Modell eine Komponente ändert. Ein arithmetischer Fix im Lowering muss weiterhin die CIR-Typisierung erfüllen; eine Änderung der Aufrufkonvention muss mit der Registerallokation und der Objektausgabe übereinstimmen. Dies sind Beispiele für die in der Architektur dokumentierten Abhängigkeiten, keine Behauptungen über spezifische Reparaturen während des Handoffs.

Der Driver bietet Zwischenstopps an: `-E` für das Preprocessing, `-emit-jcc-ir` für CIR, `-S` für Assembly und `-c` für die Objektausgabe. Diese Artefakte helfen dabei, zu lokalisieren, welche Stufe sich vor dem Testen einer verknüpften ausführbaren Datei geändert hat.

## Regressionsprüfungen decken erfolgreiche Programme und gezielte Ablehnungen ab

Der [Testing-Leitfaden](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) beschreibt Compile-and-Run-Fälle, die den Exit-Status und die Ausgabe prüfen, sowie Compile-Fail-Fälle, die Diagnose-Schweregrad, Meldung und Quellcode-Bereich prüfen. Optimierungsdurchläufe verfügen zudem über Prüfungen zur Verifizierung der Repräsentation.

Ein Nachfolger hat daher mehr als eine Abnahmebedingung. Das Erzeugen einer ausführbaren Datei ist unzureichend, wenn sich deren Ausgabe ändert; das Akzeptieren eines Programms ist unzureichend, wenn die Sprachrichtlinie dessen Ablehnung erfordert. Das Testen von Diagnosen bewahrt ein Verhalten, das ein reiner Erfolgs-Benchmark übersehen würde.

Die [versionierte README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) listet konkrete Einschränkungen auf, wie etwa partielle `long double`-Arithmetik und zurückgestellte Targets. Diese Einschränkungen sind nützliche geerbte Informationen: Die Änderung einer dokumentierten Ablehnung ist eine Feature-Entscheidung und nicht automatisch ein Regressions-Fix.

## Was der LLVM-Harness tatsächlich vergleicht

Der öffentliche [LLVM-Suite-Runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) konfiguriert die Suite mit dem zu testenden Compiler, erstellt ausführbare Dateien und vergleicht deren Ausgabe mit Referenzdateien. Der direkte Vergleich basiert auf Whitespace-Tokens: Nicht-numerische Tokens müssen exakt übereinstimmen; numerische Tokens verwenden eine konfigurierbare Gleitkommatoleranz (Standardwert 1e-4); der finale Exit-Code muss exakt übereinstimmen.

Dies verdeutlicht, warum eine Testanzahl ein Manifest und eine Vergleichsrichtlinie benötigt. Das dokumentierte Regression/C-Subset des Runners mit 36 Fällen stellt einen anderen Evaluierungsumfang dar als die 1.820 beibehaltenen Fälle des Fortsetzungsdatensatzes. Der kleinere Snapshot kann nicht dazu verwendet werden, auf die anfängliche Erfolgsquote des Handoffs zu schließen, und das Subtrahieren der beiden Gesamtzahlen würde den Fortschritt nicht messen.

## Das berichtete Handoff-Ergebnis an seinen Umfang binden

| Element | Was der Fortsetzungsdatensatz berichtet |
| --- | --- |
| Modell-Übergang | GLM 5.2 → DeepSeek V4 Flash |
| Übertragener Gesprächskontext | 0 |
| Erhaltener Projektstatus | Akzeptierte Compiler-Abstammung |
| Task-Rekursionstiefe | 4 → 8 |
| Finale Evaluierung | 1.820/1.820 beibehaltene LLVM SingleSource-Fälle |

Quelle: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Dies sind vom Projekt berichtete Ergebnisse eines Handoffs. Die Rekursionstiefe beschreibt die Task-Dekomposition; das Testergebnis liefert den Verhaltensnachweis.

Die ursprünglichen Compiler- und Fortsetzungsdatensätze verweisen auf dasselbe Repository. Sie sollten nicht als zwei unabhängige Compiler-Projekte gezählt werden, und ihre unterschiedlich dimensionierten Test-Gesamtzahlen sollten getrennt bleiben.

## Einen Handoff inspizierbar machen

Für einen Entwickler, der diesen Ansatz anwendet, besteht ein nützliches Handoff-Paket aus einer akzeptierten Revision, Build-Befehlen, Schnittstellenverträgen, dem exakten Regressions-Manifest und bekannten Ausschlüssen. Dies ist eine praktische Empfehlung, die aus der öffentlichen Architektur und den Harnesses abgeleitet wurde, und keine Behauptung, dass ein vollständiges Paket dieser Form für das Experiment archiviert wurde.

Beginnen Sie mit einer kleinen Änderung und vergleichen Sie deren Zwischenartefakte, Diagnosen und das Verhalten der ausführbaren Datei mit dieser Revision. Die [Genesis-Entwicklungshistorie-Ansicht](/news/genesis-development-history) bietet entsprechenden Kontext, um weiteren Beiträgen zu folgen, nachdem der Agent, der sie erstellt hat, seine Arbeit beendet hat.
