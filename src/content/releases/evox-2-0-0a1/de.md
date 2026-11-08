---
title: "EvoX v2.0.0a1: Neu aufgebaut auf dem EvoX Compiler"
pubDate: 2026-10-30
summary: "Experimentelle Alpha mit neuer funktionaler API und explizitem Tensorgraph-Compiler. Für den Produktionseinsatz wird weiterhin die stabile 1.x-Reihe empfohlen."
---

![Sichtbare Programmstruktur zur Compilerprüfung](./experimental-compiler-runtime.webp)

**EvoX v2.0.0a1** ist die erste Alpha einer vollständigen Neuentwicklung auf Basis des [EvoX Compiler (`evoxc`)](https://github.com/EMI-Group/evoxc).

> **Experimentelle Vorabversion:** Die neue API ist mit 1.x inkompatibel und erlaubt kein direktes Ersetzen. Für den Produktionseinsatz wird weiterhin die stabile 1.x-Reihe empfohlen. Testen Sie die Alpha in einer separaten Umgebung.

## Explizite Compiler-Pipeline

EvoX Compiler macht Tensorgraphen inspizierbar und transformierbar und trennt Tracing, Graphtransformation, Lowering, Kompilierung und Ausführung. Er bietet kombinierbare Transformationen wie `vectorize`/`vmap`, `grad`, `jvp`, `vjp` und `batch_functions` sowie NumPy-, IREE-, TVM- und XLA/PJRT-Backends. StableHLO bildet die gemeinsame Lowering-Grenze für kompilierte Backends.

EvoX 2.0 benötigt weder PyTorch noch JAX. NumPy ist die einzige erforderliche Laufzeitabhängigkeit von EvoX Compiler; kompilierte Backends sind optional.

## Neue funktionale API

- Algorithmen verwenden `init(config, key)` und `step(config, state, evaluate)`.
- Probleme verwenden `evaluate(config, state, candidates)`.
- Konfigurationen sind unveränderlich, Tensorzustände explizit und Zufallszahlen durch PRNG-Schlüssel reproduzierbar.
- `StdWorkflow` zeichnet einen Evolutionsschritt auf, kompiliert ihn mit dem gewählten Backend und führt die Optimierungsschleife aus.

## In dieser Alpha enthalten

- **32 Algorithmusklassen** und **15 evolutionäre Operatoren**.
- Numerische Grundbenchmarks, DTLZ, CEC2022 und virtuelle Neuroevolution.
- GD-, IGD- und Hypervolumenmetriken, Plotly-Visualisierung und `.exv`-Traces.
- Hyperparameteroptimierung auf Host-Seite und Erweiterungserkennung über `evox_ext`.

Das Upstream-Release meldet **552 bestandene Tests auf dem NumPy-Backend**. Daraus ergibt sich keine gleichwertige Testabdeckung für kompilierte Backends oder GPUs.

## Installation

Erfordert **Python 3.11+**. Wählen Sie in einer separaten Umgebung eine Installationsvariante:

```bash
pip install --pre "evox==2.0.0a1"
```

Für optionale Compiler-Unterstützung:

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## Aktuelle Einschränkungen

Verteilte Workflows, Brax/MuJoCo, die PyTorch-Neuronetzintegration und Triton-Kernel sind noch nicht portiert. Kompilierte Backends und GPU-Ausführung bleiben experimentell; manche Operatoren und Kontrollflussmuster werden nicht auf allen Backends unterstützt. Monitoring, Visualisierung, Metriken und HPO laufen derzeit außerhalb kompilierter Graphen. APIs können sich während der Vorabversionen ändern.

Fehlerberichte, Benchmarks und API-Rückmeldungen sind in [GitHub Issues](https://github.com/EMI-Group/evox/issues) willkommen.

**Release**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
