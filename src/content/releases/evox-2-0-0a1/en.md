---
title: "EvoX v2.0.0a1: Rebuilt on the EvoX Compiler"
pubDate: 2026-10-30
summary: "An experimental alpha with a new functional API and an explicit tensor-graph compiler. The stable 1.x series remains recommended for production."
---

![Program structure exposed for compiler inspection](./experimental-compiler-runtime.webp)

**EvoX v2.0.0a1** is the first alpha of a complete rewrite built on [EvoX Compiler (`evoxc`)](https://github.com/EMI-Group/evoxc).

> **Experimental pre-release:** The new API is incompatible with 1.x. This is not a drop-in upgrade; the stable 1.x series remains recommended for production use. Try the alpha in a separate environment.

## An explicit compiler pipeline

EvoX Compiler makes tensor graphs inspectable and transformable, separating tracing, graph transformations, lowering, compilation, and execution. It supports composable transformations such as `vectorize`/`vmap`, `grad`, `jvp`, `vjp`, and `batch_functions`, with NumPy, IREE, TVM, and XLA/PJRT backends. StableHLO provides a common lowering boundary for compiled backends.

EvoX 2.0 no longer depends on PyTorch or JAX. NumPy is the only required runtime dependency of EvoX Compiler; compiled backends are optional.

## New functional API

- Algorithms use `init(config, key)` and `step(config, state, evaluate)`.
- Problems use `evaluate(config, state, candidates)`.
- Configurations are immutable, tensor state is explicit, and randomness uses reproducible PRNG keys.
- `StdWorkflow` traces an evolutionary step, compiles it with the selected backend, and runs the optimization loop.

## Included in this alpha

- **32 algorithm classes** and **15 evolutionary operators**.
- Basic numerical benchmarks, DTLZ, CEC2022, and virtual neuroevolution.
- GD, IGD, and hypervolume metrics; Plotly visualization and `.exv` traces.
- Host-side hyperparameter optimization and extension discovery through `evox_ext`.

The upstream release reports **552 passing tests on the NumPy backend**; this does not establish equivalent coverage for compiled backends or GPUs.

## Installation

Requires **Python 3.11+**. In a separate environment, choose one installation:

```bash
pip install --pre "evox==2.0.0a1"
```

For optional compiler support:

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## Current limitations

Distributed workflows, Brax/MuJoCo, PyTorch neural-network integration, and Triton kernels have not yet been ported. Compiled backends and GPU execution remain experimental, and some operators and control-flow patterns are unsupported across backends. Monitoring, visualization, metrics, and HPO currently run outside compiled graphs. APIs may change throughout the pre-release series.

Bug reports, benchmarks, and API feedback are welcome in [GitHub Issues](https://github.com/EMI-Group/evox/issues).

**Release and full notes**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
