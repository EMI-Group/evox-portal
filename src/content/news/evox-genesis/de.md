---
title: "EvoX Genesis: Ein rekursives evolutionäres KI-System, das einen 250.000-Zeilen-C-Compiler von Grund auf gebaut hat"
pubDate: 2026-08-17
summary: "Das EvoX-Team des Departements für Datenwissenschaft und Künstliche Intelligenz der Hong Kong Polytechnic University hat EvoX Genesis veröffentlicht, ein rekursives evolutionäres KI-System. Statt sich auf einen persistenten Agenten zu verlassen, der langfristige Entwicklung aufrechterhält, lässt es die Softwarewelt selbst weiter evolvieren: Ausgehend von einem leeren Repository hat das System in 123,4 Stunden einen C-Compiler mit 248.989 Zeilen gebaut, bei Modell-Token-Kosten von nur 44,38 $."
---

# EvoX Genesis: Ein rekursives evolutionäres KI-System, das einen 250.000-Zeilen-C-Compiler von Grund auf gebaut hat

![image1.png](./evox-genesis-1.png)

Das EvoX-Team des Departements für Datenwissenschaft und Künstliche Intelligenz der Hong Kong Polytechnic University hat **EvoX Genesis** veröffentlicht, ein rekursives evolutionäres KI-System.

EvoX Genesis verlässt sich nicht mehr auf einen persistenten Agenten, um langfristige Entwicklung aufrechtzuerhalten. Stattdessen lässt es die Softwarewelt selbst weiter evolvieren.

Ausgehend von einem leeren Repository hat das System in 123,4 Stunden, über 1.019 Agenten-Episoden hinweg, einen **C-Compiler mit 248.989 Zeilen** gebaut, bei Modell-Token-Kosten von nur **44,38 $**.

## Langfristiges Coden: Die Grenze verschiebt sich immer weiter

Die Arbeitszeit von Coding-Agenten hat sich von kurzen Einzelaufgaben auf Dutzende Stunden ausgedehnt.

OpenAI ließ Codex ausgehend von einem leeren Repository rund 25 Stunden am Stück laufen und erzeugte dabei etwa 30.000 Zeilen Code.

Anthropic nutzte 16 Claude-Agenten, über fast 2.000 Sessions, etwa zwei Wochen und knapp 20.000 $ an API-Kosten, um von Grund auf einen C-Compiler mit rund 100.000 Zeilen zu bauen.

Die Zeit wird immer länger, die Agenten immer zahlreicher und die Software immer komplexer.

Aber im Zentrum der Forschung steht nach wie vor der Agent:

stärkere Modelle, längere Kontexte, dauerhaftere Erinnerung, mehr Agenten.

**Das EvoX-Team hat die Frage in eine andere Richtung gedreht:**

**Warum muss der Agent persistieren?**

Was, wenn das, was wirklich persistieren muss, die Softwarewelt ist, in der er lebt?

## 123,4 Stunden, 250.000 Zeilen

Wir ließen EvoX Genesis mit einem Repository beginnen, dessen Implementierung leer war.

Es gab nur ein Ziel: einen C-Compiler zu bauen.

123,4 Stunden, 1.019 Agenten-Episoden, **248.989 Zeilen Code** und Modell-Token-Kosten von nur **44,38 $**.

Der finale Compiler bestand 220/220 c-testsuite-Tests, 32/36 LLVM-Testfälle und 93/93 Csmith-Tests mit zufällig generierten Programmen.

Da wartete kein fertiger Compiler auf seine Vervollständigung — **er startete bei null.**

![image2.png](./evox-genesis-2.png)

_Abbildung 1: Ergebnisse des C-Compiler-Experiments / Codegröße, Laufzeit, Agenten-Episoden, Kosten und Testergebnisse_

_(mit dem Modell DeepSeek V4 Flash)_

## Halten Sie nicht den Agenten am Leben — halten Sie die Softwarewelt am Leben

Das Leben komplexer Software ist von Natur aus länger als eine einzelne Agenten-Session.

EvoX Genesis organisiert Software in eine sich rekursiv entfaltende Softwarewelt:

Agenten auf höherer Ebene zerlegen Ziele, und neue Agenten erledigen die Arbeit an lokalen Stellen;

sobald die Ergebnisse verifiziert sind, gehen sie in die Versionsgeschichte der Software ein und werden zur Realität für die nächste Entwicklungsrunde.

Dann können die Agenten verschwinden,

und neue Agenten machen in der bereits gestalteten Softwarewelt weiter.

Was persistiert, ist kein Gespräch, kein immer weiter wachsendes Scratchpad und auch kein ständig online befindlicher „Master-Agent".

Was persistiert, sind der Code, die Struktur, die Constraints, die Verifikationsergebnisse und die bereits geschehene Geschichte.

**Was persistiert, ist nicht der Agent, sondern die Softwarewelt.**

**Der Agent persistiert nicht. Seine verifizierten Folgen schon.**

Das ist die rekursive autonome Evolution von EvoX Genesis. Für die Nutzer bedeutet das auch etwas sehr Einfaches:

**Sie bauen keine Agenten — Sie beschreiben nur, was die Software werden soll.**

Es muss weder vorab Agenten, Rollen oder Workflows entworfen werden, noch ein vollständiger Aufgabenbaum manuell zerlegt werden.

Die Nutzer müssen das Software-Entwicklungsziel nur in einem kurzen Text beschreiben;

wie Aufgaben zerlegt werden, wie Agenten entstehen, wie sich die Rekursion entfaltet und wie Ergebnisse verifiziert werden — all das erledigt EvoX Genesis selbst.

![image3.png](./evox-genesis-3.png)

_Abbildung 2: Das Konzept der Persistent Recursive World / Agenten entstehen, handeln und verschwinden; die Softwarewelt entfaltet sich weiter_

## Modelle können ausgetauscht werden; die Softwarewelt geht weiter

Diese Kontinuität erfordert nicht einmal, durchgehend dasselbe Modell zu verwenden.

In einer weiteren Experimentreihe wurde eine zunächst von GLM 5.2 aufgebaute Softwarewelt an DeepSeek V4 Flash übergeben, um die Entwicklung fortzusetzen.

Am Ende bestand sie 1.820/1.820 der beibehaltenen LLVM-SingleSource-Tests.

Modelle können ersetzt werden, Agenten können ersetzt werden — die Softwarewelt geht weiter.

![image4.png](./evox-genesis-4.png)

_Abbildung 3: Das Modellübergreifende Fortführungsexperiment, GLM 5.2 → DeepSeek V4 Flash_

## Von Grund auf, oder Geschichte erben

Von null aufzubauen ist nur ein Ende eines Software-Lebenszyklus;

das andere Ende ist eine Softwarewelt, die seit Jahren existiert und reich an Struktur und Geschichte ist.

Wir haben EvoX Genesis auf MESA angewendet — ein lange entwickeltes wissenschaftliches Rechensystem für Stellarentwicklung.

Das Experiment umfasste 13 Fortran-Module mit insgesamt **139.414 Zeilen**;

EvoX Genesis refaktorierte sie in entsprechende Rust-Crates, bei Modell-Token-Kosten von etwa **10,6 $**.

Eine Softwarewelt kann aus dem Nichts erschaffen werden — oder sie erbt Geschichte und verändert sich weiter.

![image5.png](./evox-genesis-5.png)

_Abbildung 4: MESA Fortran → Rust, 13 Module, 139.414 Zeilen Code, 10,6 $_

## Kostenvorteile verzinsen sich mit der Zeit

Langfristige Softwareentwicklung bedeutet nicht, dass die Kosten linear weiterwachsen.

In EvoX Genesis akkumulieren sich verifizierter Code, Struktur und Entwicklungsgeschichte fortlaufend und werden zur Grundlage der nächsten Arbeitsrunde. Nachfolgende Agenten müssen das gesamte Projekt nicht von Grund auf neu verstehen; viele der vorhandenen Informationen können direkt gecacht und wiederverwendet werden, mit einer Cache-Trefferquote von bis zu 97,4 %.

Während das System weiterläuft, wird der wiederverwendbare Entwicklungszustand reicher, redundante Berechnungen nehmen ab, und die Stückkosten der Entwicklung sinken mit der Zeit tatsächlich.

Das ist technische Zinseszinsen, die sich mit der Zeit ansammeln.

## EvoX Genesis ist jetzt Open Source

Das Projekt ist Open Source, mit Installationspaketen für Windows, macOS und Linux.

🌐 Website:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Downloads**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Paper:**

**https://arxiv.org/abs/2608.10450**

🌐 QQ-Gruppe: 297969717

![image6.png](./evox-genesis-6.png)

**Agenten gehen; die Softwarewelt evolviert weiter**

**EvoX Genesis**

Referenzen:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
