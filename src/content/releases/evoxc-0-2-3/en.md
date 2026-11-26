---
title: "EvoX Compiler v0.2.3: Install the backend that matches your workload"
pubDate: 2026-11-26
summary: "The 0.2 release line brings IREE 3.13, automatic XLA plugin discovery and corrected numerical behavior; v0.2.3 ships the verified distribution artifacts."
---

EvoX Compiler v0.2.3 was published on November 25, 2026 UTC, with Python wheels and a source archive. Its short GitHub note links the v0.2.2-to-v0.2.3 comparison; the versioned changelog records the substantive 0.2-line changes and packaging repairs that lead to this distribution. For users moving from 0.1, the main questions are which compiler/runtime pair to install, how to select the physical device and which numerical checks to repeat. [Release][release] · [Changelog][changes]

![A keyed adapter aligned with its matching socket beside a checked package](./cover.webp)

*Concept illustration: a usable release must fit its execution environment.*

## Keep the compiler and runtime together

The IREE extra now requires both compiler and runtime in the range 3.13.0 to below 3.14. Compiled artifacts are version-specific: do not assume a saved artifact from another compiler/runtime pair can be loaded unchanged. The upstream record revalidated llvm-cpu and ROCm/HIP on an AMD Instinct MI300X with ROCm 7.1, including loops and scans that had failed on earlier IREE versions. Those checks do not extend automatically to CUDA, multi-rank execution or every model benchmark. [Versioned requirements][requirements] · [Changelog][changes]

The adapter also controls device-to-host readback rather than relying blindly on the runtime shortcut. This matters when a program runs correctly but fails while retrieving results. Host memory can retain a mapped path; device buffers require an explicit transfer. Treat transfer time as part of the application workload, separately from kernel timing.

## Let XLA discover a plugin, then choose its device

XLA registration no longer performs an option-less plugin probe before the caller can supply a path. Discovery considers an explicit plugin option, its environment variable, known locations and installed JAX plugin packages, without importing JAX itself. Availability is checked at compile/load time, where options are available. The build helpers now forward resolved options into loading, fixing the case where compilation found a plugin but loading lost it. [Backend guide][guide]

A ROCm plugin must serve a ROCm device, and a CUDA plugin a CUDA device. Leaving the default CPU selection while providing a GPU plugin is rejected. For a GPU experiment, choose the corresponding device and explicitly move tensors there. Check output placement before copying results to the host. A failed XLA execution also clears cached output-pointer slots so a later call cannot reuse stale buffer pointers.

## Recheck semantics before comparing speed

The NumPy reference interpreter uses cached dispatch plans, releases dead intermediate values at last use and shares an immutable host-device instance. These changes reduce preparation and allocation overhead without requiring a new public calling style. The changelog’s TensorNEAT measurements concern specific workloads, not a universal acceleration factor.

The compiled remainder operation now follows NumPy floormod: the result takes the divisor’s sign. Negative inputs are therefore useful upgrade tests. Keep fixed inputs and reference outputs, then compare interpreter and compiler results using appropriate dtype tolerances. The packaging fixes accept maturin’s bundled shared-library directory and stage tested distribution files flat, addressing failures that prevented the artifacts from reaching publication. [Recorded fixes][changes]

## Upgrade in a clean environment

Python 3.11 or newer is required. Install the selected 0.2.3 wheel from the release assets with pip; the release provides Linux, macOS and Windows wheels plus a source archive. For the IREE extra, use `pip install "evoxc[iree]==0.2.3"`, and confirm the paired IREE dependencies. The separate evoxc-hf distribution keeps its own version. Run `pip check`, inspect the installed version and repeat one representative graph, negative-remainder case and device round trip before moving a larger workload. [Installation guide][guide]

For the graph transforms, custom operations and explicit compilation stages around these backends, see the [custom-compilation article][related] alongside this release’s pinned documentation.

[release]: https://github.com/EMI-Group/evoxc/releases/tag/v0.2.3
[changes]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/CHANGELOG.md
[requirements]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/pyproject.toml
[guide]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/README.md
[related]: /news/evoxc-custom-compilation-pipeline
