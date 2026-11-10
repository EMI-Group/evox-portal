---
title: "EvoX Genesis: Entwicklung eines C-Compilers durch inspizierbare Phasen und Regressions-Gates"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "Das C-Compiler-Fallbeispiel verfolgt eine leere Implementierung durch Compiler-Phasen, Diagnosen und externe Test-Harnesses, wobei die Ergebnisse innerhalb ihres dokumentierten Rahmens verbleiben."
---

Von einer leeren Implementierung auszugehen, ist ein klares Ziel; die Erstellung einer ausführbaren Datei, die sich korrekt verhält, ist eine weitaus anspruchsvollere Abnahmebedingung. Das C-Compiler-Fallbeispiel von Genesis lässt sich anhand der aufgebauten Schnittstellen und der sie umgebenden Verifizierungsschichten untersuchen.

![Source modules assembled into a growing software project](./software-world-continuity.webp)

Der [C Compiler Evidence record](https://genesis.evox.group/evidence/c-compiler/) weist **248.989 Zeilen Rust**, **1.019 archivierte Agent episodes**, **123,4 Stunden** und **44,38 US-Dollar an Modell-Token-Kosten** unter Verwendung von DeepSeek V4 Flash aus. Er listet 220/220 c-testsuite-Fälle, 32/36 evaluierte LLVM-Fälle und 2.904/2.904 Rust-Tests auf. Dies sind vom Projekt gemeldete Ergebnisse, keine neue Reproduktion für diesen Artikel.

## Zuerst ein Programm alle Phasen durchlaufen lassen

Der öffentliche Compiler, jcc, dokumentiert eine Abfolge von technischen Meilensteinen: Einrichtung des Workspace, Erstellung eines End-to-End-Kompilierungsskeletts, Erweiterung der Sprachabdeckung, Hinzufügen von Optimierungen und schließlich die Anwendung externer Suites sowie Anwendungs-Builds. Die [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) definiert diese Gates; sie ist eher als Entwicklungsbericht des Repositorys zu lesen denn als zeitgestempeltes Transkript jeder Genesis-Episode.

Die [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) verbindet Präprozessierung, lexikalische und syntaktische Analyse, semantische Prüfungen, CIR-Lowering, Optimierung, Maschinencode-Generierung, Objekt-Assemblierung und Linking. Separate Crates sind für diese Phasen zuständig.

Diese Struktur erzeugt nützliche Zwischenartefakte. `-E` stoppt nach der Präprozessierung; `-emit-jcc-ir` legt die CIR offen; `-S` gibt Assembly aus; `-c` erzeugt ein Objekt. Wenn ein kompiliertes Programm fehlschlägt, grenzen diese Grenzen die Untersuchung ein, bevor die gesamte Pipeline geändert wird.

## C-Semantik durch die Zwischenrepräsentation bewahren

CIR ist die typisierte SSA-Repräsentation des Compilers, getrennt von LLVM IR. Die Optimierung transformiert CIR in CIR; der dokumentierte Debug-Build-Workflow führt den Verifizierer nach den Durchläufen aus. Der [testing guide](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) beschreibt Prüfungen für Lowering, ungültige Repräsentationen, Rewrites, Instruktionskodierung und das Verhalten der Befehlszeile.

Die Verifizierung der Repräsentation ist eine Schicht, kein Beweis für eine korrekte Kompilierung. Eine strukturell gültige Transformation kann dennoch das Ergebnis eines Programms verändern. Aus diesem Grund kompiliert und führt die Teststrategie auch C-Programme aus und vergleicht deren Ausgabe.

Der Korpus enthält bewusste Kompilierungsfehler: Tests prüfen den Schweregrad der Diagnose, die Nachricht und den Quellcodebereich (Span). Dies bewahrt das Ablehnungsverhalten für ungültige Eingaben neben dem erfolgreichen Ausführungsverhalten. Das [C11 compliance document](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) des Compilers hält unterstützte Konstrukte und die Erweiterungsrichtlinien fest.

## Externe Suites testen den vollständigen Pfad

Der [c-testsuite harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) bietet ein externes Gate für Sprachtests. Der [LLVM runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) steuert CMake mit dem zu testenden Compiler an, baut Programme und vergleicht die Ausführung mit der Referenzausgabe. Sein standardmäßiger numerischer Vergleich verwendet eine Toleranz von 1e-4, während nicht-numerische Token und der Exit-Status exakt übereinstimmen müssen.

Der [Csmith harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) ergänzt differenzielle Tests generierter Programme gegen einen Referenz-Compiler. Im inspizierten README-Snapshot meldet sein Lauf mit 100 Seeds **93 Erfolge, 0 Fehler und 7 Skips**, wobei die Skips darauf zurückzuführen sind, dass beide Compiler in ein Zeitlimit liefen. Dies als „93/93“ ohne die übersprungenen Seeds zu bezeichnen, würde einen Teil der Arbeitslast verbergen.

Diese Prüfungen erkennen unterschiedliche Fehlerklassen: Eine Language-Suite untersucht spezifizierte Konstrukte, Zufallsprogramme explorieren Kombinationen und verknüpfte Anwendungs-Builds testen den Driver, die Objektdateien und die Laufzeitschnittstellen gemeinsam.

## Erfolg an die getestete Operation gebunden halten

Die [versioned README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) berichtet, dass lz4 gebaut wird und seine acht wesentlichen Tests besteht. Sie beschreibt, dass SQLite sauber geparst und transformiert (lowering) wird, wobei weitere Arbeiten zur Verifizierung der vollständigen Datei dokumentiert sind. Das Parsen von SQLite ist ein nützlicher Integrations-Meilenstein; es ist nicht gleichbedeutend mit dem Bestehen der vollständigen Laufzeit-Testsuite von SQLite.

Dieselbe Quelle listet teilweise `long double`-Arithmetik, aufgeschobene Plattformen und dokumentierte Gates für Erweiterungsrichtlinien auf. Das 32/36 LLVM-Ergebnis muss daher seine evaluierte Teilmenge und die Ausschlüsse beibehalten. Die README- und Evidence-Seite weisen zudem unterschiedliche Anzahlen von Workspace-Tests auf; dieser Artikel belässt die Evidence-Gesamtzahl bei ihrem Datensatz, anstatt Snapshots zu kombinieren.

## Was zwischen Entwicklungsaufgaben bestehen bleibt

Das [dokumentierte Entwicklungsmodell](https://genesis.evox.group/getting-started/) von Genesis nutzt rekursive Aufgabenzerlegung rund um ein Softwareprojekt. In diesem Fall sind die dauerhaften technischen Artefakte konkret: Quellmodule, Repräsentationsverträge, Zwischenausgaben, Diagnosen und Regressions-Harnesses. Eine spätere Aufgabe kann auf diesen Artefakten aufbauen, anstatt sich ausschließlich auf die Konversation eines Vorgängers zu verlassen.

Das [Fallbeispiel zur Modell-Fortsetzung](/news/genesis-compiler-continuation) untersucht eine spätere Übergabe und deren separat abgegrenztes Ergebnis mit 1.820 Fällen. Der [MESA rewrite](/news/genesis-mesa) nutzt das ursprüngliche numerische Verhalten als Referenz, während [EvoX Compiler](/news/genesis-evoxc) Tensorgraphen und Geräteverträge prüft. Dies sind eigenständige Verifizierungsprobleme und keine zusätzlichen Durchläufe desselben Compiler-Experiments.

44,38 US-Dollar decken die Modell-Token ab und schließen Hardware aus. Die öffentlichen Aufzeichnungen belegen ein substanzielles Compiler-Bau-Fallbeispiel innerhalb ihres gemeldeten Rahmens; sie begründen keine uneingeschränkte C-Kompatibilität. Um das Ergebnis zu inspizieren, folgen Sie der [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) in einen externen Harness und untersuchen Sie die exakten Programme und Ausgaben, die dessen Gate definieren.
