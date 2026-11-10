---
title: "Genesis and MESA: Tracing Numerical Differences Through a Fortran-to-Rust Rewrite"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Interpolation precision, analytic Jacobians and matched benchmark inputs show how thirteen MESA modules were rebuilt and checked in Rust."
---

A scientific-software rewrite can produce plausible answers while changing the numerical path that produced them. Genesis's MESA case offers concrete checks for that problem: original Fortran outputs, explained floating-point differences, solver-step counters and benchmarks that compare matching workloads.

![Fortran and Rust outputs compared under a magnifying glass](./mesa-numerical-continuity.webp)

*Concept illustration: a new implementation checked against existing numerical behavior.*

The [Evidence record](https://genesis.evox.group/evidence/mesa/) reports thirteen redeveloped modules, 139,414 lines of Fortran and 89,946 lines of Rust. The engineering details below come from [repository revision 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), whose documented benchmarks are dated August 5, 2026. Those benchmark results retain their own workload and timing definitions.

## Rebuild a dependency chain, not thirteen isolated translations

The workspace follows the chain from constants, utilities and mathematics through matrices, interpolation and numerical solvers to chemistry, rates, neutrino losses, reaction networks, equation of state and opacity. Each original module has a corresponding Rust crate. The [workspace manifest](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) makes those package relationships explicit.

This means a reaction-network task depends on numerical routines and physics data being usable together. Public APIs and per-directory context documents provide the integration contract. The [repository overview](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) describes Rust structs, methods and `Result` values, with original Fortran names retained in documentation where useful for cross-checking.

The implementation includes Rust solvers rather than calling LAPACK or BLAS through FFI. Scope remains the selected numerical and physics stack: the complete stellar and binary evolution engines, full EOS blend and other listed components are outside the port.

## Why a golden-output mismatch was not solved with one loose tolerance

The [two-dimensional interpolation golden test](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) reconstructs the original 31-by-35 grid and evaluation points. It distinguishes values that match exactly from values that need a documented tolerance.

The test's investigation records a revealing discrepancy. Some original Fortran Hermite interpolation temporaries were implicitly `REAL(4)`: single precision inside an otherwise higher-precision calculation. The Rust port uses `f64`. The source comments report that an explicitly double-precision Fortran transcription matched the Rust result, while the original mixed-precision path reproduced the older golden output.

The largest recorded relative difference for those interpolation values was about 3.05e-8, with a 1e-7 relative tolerance. Other quantities keep exact comparisons or much tighter tolerances. That is a useful engineering distinction: the test retains the origin of a numerical difference instead of allowing every result to drift under one global threshold. The single-precision `_sg` test block remains outside the port.

## The reaction network needed the derivative path as well as the value path

The [reaction-network development notes](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) describe work on the analytic approx21 Jacobian, the derivatives used by the stiff solver. Their recorded before/after measurements show the checksum moving closer to Fortran and the integration counters reaching an exact match.

For the documented benchmark workload, both implementations reached **199 steps: 198 accepted and 1 rejected**, with **8,889 function evaluations and 199 Jacobian evaluations**. These counters help detect an apparently faster run that simply took a different solver path.

A residual checksum difference of about 3.1e-9 remained. The [benchmark helper](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) attributes it to the Fortran value path using quad precision while Rust uses f64. The harness therefore uses a documented 1e-8 relative checksum tolerance; asking for 1e-9 deliberately flags this workload. Matching step counters supports the comparison, while the value-path difference remains explicit.

## Integration tests also check that modules are actually connected

A separate [one-zone integration test](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) runs the burner with an ideal-gas provider and with an EOS-table provider through the public `BurnEosInfo` interface. It expects the two calculations to differ, checks conservation and finite outputs, and verifies that EOS calls equal the sum of function and Jacobian evaluations.

This is a wiring test with a specific physical boundary: the burn temperature exceeds the available table's maximum, so the EOS lookup clamps to its top row. It demonstrates that the provider affects the calculation; it is not validation of a full high-temperature stellar EOS. Its step counts also belong to this separate test, not the benchmark above.

## Compare the same work before reporting a speedup

The [workload specification](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fixes inputs, sizes, solver parameters and checksum definitions for both languages. For example, the interpolation benchmark evaluates two million deterministic points on the same grid; setup is outside that timed loop.

The [benchmark orchestrator](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) reads driver-internal timings and checksums, compares them and writes a report. The README's August 5 table uses medians of 15 runs pinned to CPUs 0–3, comparing gfortran `-O3 -march=native` with the Rust release profile.

| Selected workload | Fortran | Rust | Reported speedup |
| --- | --- | --- | --- |
| Two million bicubic evaluations | 0.162522 s | 0.090700 s | 1.79× |
| Ten thousand Newton solves | 0.057918 s | 0.009029 s | 6.41× |
| One-zone approx21 burn proxy | 0.303473 s | 0.243294 s | 1.25× |

Source: [versioned benchmark table](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). The Evidence page separately reports a 1.55–6.87× median range. These records do not establish one universal speedup, and the one-zone proxy does not measure a complete stellar simulation.

## Follow the test and benchmark entry points

The repository reports **1,052 passed, 0 failed and 18 ignored**. Its README identifies the ignored set as benchmarks and the slow full-duration burn. In a prepared Rust and Fortran environment, the documented entry points are:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

These are source-documented commands, not a new reproduction performed for this article. The Evidence record's US$10.64 covers model tokens only; model, episode count and wall time were not reported.

For a useful first inspection, read the interpolation golden test alongside its original-output comparisons, then follow the benchmark's input contract. That path makes the rewrite assessable through specific numerical behavior and measured work.
