---
title: "Genesis and MESA: Rewrite the Code, Preserve the Numerical Behavior"
pubDate: 2026-11-03
updatedDate: 2026-11-08
summary: "Thirteen MESA modules became a Rust workspace. Golden tests and a one-zone burn proxy show how the project checks what survives the rewrite."
---

Rewriting scientific software means carrying forward more than algorithms. A new implementation must preserve the numerical behavior on which later calculations depend. In Genesis's MESA case, thirteen Fortran modules were redeveloped as Rust crates, with original outputs serving as references. The interesting story is how the project makes that continuity checkable.

![Fortran and Rust outputs compared under a magnifying glass](./mesa-numerical-continuity.webp)

*Concept illustration: a new implementation, a shared numerical reference.*

## Thirteen modules, one connected numerical stack

The [September 7, 2026 Evidence record](https://genesis.evox.group/evidence/mesa/) covers **13 modules**, with **139,414 lines of Fortran** and a reported **89,946 lines of Rust**. These are snapshot-level size figures, not interchangeable with the repository's library-only line count.

The port covers a chain of numerical and physics modules, including interpolation, solvers, reaction networks, equation of state and opacity. It does not replace the complete MESA system: stellar and binary evolution engines and other documented components remain outside scope.

## Check the calculation, not just the build

The repository organizes the port as one Rust crate per module and documents their interfaces and constraints. Golden tests compare results with original Fortran output files; integration tests exercise interactions between modules.

Numerical equivalence needs an explicit tolerance and workload. A matching scalar result alone may hide a different solver path, so the repository also records integration-step behavior for its one-zone burn proxy. These checks make migration claims more informative than a successful build.

## What the test record contains

The repository reports **1,052 passing tests, no failures and 18 ignored tests**; the ignored set includes benchmark tests and a slow full-duration burn. The Evidence record lists **US$10.64 in model-token charges**, excluding hardware, and leaves the model, episode count and wall time unspecified.

These are source-reported results from a single run, without independent reproduction. The useful starting point is the documented module and workload coverage.

## Two snapshots, different speedup figures

The [Evidence](https://genesis.evox.group/evidence/mesa/) page reports **1.55–6.87× median speedups**. Separately, the repository's August 5 benchmark table uses medians of 15 runs and reports **1.25×** for its end-to-end one-zone burn proxy. [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)

For the one-zone burn proxy, the README records **199 integration steps, 198 accepted and 1 rejected** in both implementations. Comparing this behavior alongside output tolerances makes the speed measurement more informative than timing a calculation with a different numerical path.

## Reproduce a workload before expanding the scope

The [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md) lists the toolchain requirements, build steps, test commands and benchmark drivers. After preparing that environment, the workspace test entry point is:

```bash
cargo test --workspace
```

Start with a workload relevant to your research and inspect its reference outputs, tolerances and benchmark driver in the [MESA redevelopment repository](https://github.com/EMI-Group/genesis-demo-mesa-rs). The broader [Genesis project](/news/evox-genesis) supplies the agentic development context; this case supplies a concrete way to examine whether a rewrite has kept the behavior you need.
