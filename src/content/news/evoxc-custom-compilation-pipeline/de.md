---
title: "EvoX Compiler öffnet seine Pipeline für eigene Kompilierung"
pubDate: 2026-11-25
summary: "Die main-Änderungen unterstützen Custom Calls, eingebettetes StableHLO und bearbeitete Module; Backend-Fähigkeiten machen Grenzen explizit."
---

Eine experimentelle Operation kann eine Tensorbibliothek überfordern, ohne dass das übrige Programm geändert werden muss. Die Änderungen im Standardbranch von EvoX Compiler vom 23.–24. November 2026 ermöglichen compilerspezifische Operationen, die Kompilierung bearbeiteten Zwischencodes und eigene Backends. Entscheidend ist die Grenze: Soll die Erweiterung im Compiler, als Laufzeitkernel oder als vollständiges Backend arbeiten? [Implementierung und Anleitung][guide]

![Eine austauschbare optische Kassette ergänzt eine modulare Schiene mit durchgehendem rotem Lichtweg](./cover.webp)

*Konzeptillustration: Eine Stufe austauschen und die umgebende Pipeline sichtbar halten.*

## Die Grenze für eigene Operationen wählen

`custom_call` erzeugt einen benannten StableHLO-Aufruf mit deklarierten Ergebnissen und optionaler Backend-Konfiguration. Der externe Compiler entscheidet, ob das Ziel existiert und umgesetzt werden kann. `inline_stablehlo` bettet stattdessen einen rohen Ausschnitt ein: Operanden heißen `%in0` und fortlaufend, Ergebnisse müssen `%out0` und den folgenden Indizes zugewiesen werden. Ergebnisspezifikationen bleiben explizit. Namen, Konfiguration und Ausschnitte sind statische Werte zur Spezialisierung des Graphen. [Operationsvertrag][ops]

Diese Schnittstellen registrieren keine beliebigen Kernel bei IREE oder PJRT. Für Python- oder Triton-Kernel zur Laufzeitausführung bleibt die vorhandene `external_call`-Registrierung relevant. Eine portable Operation aus normalen EvoX-Compiler-Operationen lässt sich auch als Block mit eigener Zerlegung ausdrücken. So bleibt eine Compilerdeklaration von einer Laufzeitimplementierung unterscheidbar.

## Zwischenprogramm bearbeiten und kompilieren

Ein Compilerentwickler kann etwa mit `source_text()` ein Executable untersuchen, dessen StableHLO bearbeiten und den Text mit Ein- und Ausgabespezifikationen an `compile_text` übergeben. Tracing und Graphaufbau entfallen; danach folgen die normalen Compile- und Load-Stufen. Die Spezifikationen beschreiben äußere Tupel, deren Ein-/Ausgabevertrag bei der Ausführung erhalten bleiben muss. Der externe Compiler validiert das Modul; angenommener Text belegt noch keine numerische Korrektheit. [Pipeline-Implementierung][pipeline]

Bewahren Sie kleine Testeingaben auf und vergleichen Sie nach jeder Änderung mit dem Original. Ein fehlendes Ziel ist bei der Compiler-Legalisierung zu diagnostizieren, nicht durch einen stillen Backendwechsel zu umgehen. NumPy-Interpreter und native CPU-Engine lehnen diese Erweiterungen explizit ab. Den neuen Graphoperationen fehlen zudem automatische Batching- und Differentiationsregeln; dafür ist eine unterstützte Alternative nötig. [Fähigkeiten und Grenzen][guide]

## Ein Backend bewusst einbinden

Backend-Instanzen bleiben nun über die Pipeline-Stufen hinweg erhalten. Die Registrierung unterstützt explizites Ersetzen und Entfernen, Entry Points ermöglichen externe Backend-Pakete. Ein Compilerbackend deklariert Fähigkeiten und unterstützte dtypes und implementiert Kompilieren und Laden; eine leere dtype-Menge lehnt alle Graphen ab. Eigene IREE-Compiler- und Runtime-Module lassen sich über Optionen oder Umgebungsvariablen wählen. Damit können eigene Compilerbuilds getestet werden, ohne ihre Runtime mit dem Standardmodul zu verwechseln. [Backend-Anleitung][guide]

## Transfers und numerische Vergleiche getrennt prüfen

Im selben Entwicklungszeitraum ändern sich Vulkan-Transfers: Uploads bis 16 MiB verwenden gemappte kohärente Puffer, größere einen Kopierpfad. Der Rücktransfer unterscheidet Hostspeicher von lediglich hostsichtbarem GPU-Speicher. Die aufgezeichneten Messungen betreffen eine Intel-iGPU/Mesa/IREE-Konfiguration; messen Sie Transfer und Ausführung auf Ihrer Hardware getrennt. [Transferimplementierung][transfer]

Die native CPU verwendet Speicher großer Puffer und eingehender Arrays erneut, um wiederholte Allokationen zu reduzieren. Reduktionen verteilen unabhängige Ausgaben unter Erhaltung ihrer jeweiligen Faltungsreihenfolge. Compileradapter bieten zudem `split_reduction_threshold` und `split_reduction_non_exact`; prüfen Sie bei einer geänderten Reduktionsstrategie sowohl Ergebnisse als auch Laufzeit. [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

Eine native CPU-Korrektur an `power` gleicht die Exponentenbehandlung außerdem an NumPys Gleitkommapotenzpfad an. Das Vergleichswerkzeug trennt exakte Ganzzahl-/Bool-Prüfungen von toleranzbasierten Gleitkommavergleichen. Bewahren Sie vor Übernahme dieser Quellrevision Referenzausgaben auf, testen Sie Compiler und Gerät und prüfen Sie die Toleranz. Die frühere [Version v0.1.1][release] erklärt die Vorbereitungspipeline; diese Änderungen erweitern deren Anpassbarkeit. [Numerische Korrektur][power]

[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /de/releases/evoxc-0-1-1
