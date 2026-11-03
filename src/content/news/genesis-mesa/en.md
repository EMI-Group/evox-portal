---
title: "Genesis Rebuilds 13 MESA Modules in Rust"
pubDate: 2026-11-03
summary: "Genesis’s MESA case demonstrates redevelopment of scientific software, with 1,052 tests passing and US$10.64 in reported model-token charges."
---

Scientific software redevelopment must preserve established numerical behavior. Genesis’s MESA evidence record, dated September 7, 2026, describes rewriting **13 Fortran modules as Rust crates**, using the existing implementation as a reference.

The record reports **139,414 lines of Fortran → 89,946 lines of Rust**, **1,052 tests passing**, and **US$10.64 in model-token charges**. The repository documents golden tests against original Fortran outputs and reports 18 ignored tests alongside the passing tests.

The Evidence page gives **1.55–6.87× median speedups**. These are reported benchmark figures, not a universal acceleration of MESA. Separately, the repository README’s August 5 benchmark table reports **1.25×** for its end-to-end one-zone burn proxy. Different snapshots and workloads should remain distinct.

The port covers the selected numerical and physics modules, not the complete MESA system; stellar and binary evolution engines are outside the documented scope. The case shows how an existing codebase can guide redevelopment through behavior checks. Results are project-reported, without independent reproduction, and the token cost excludes hardware.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
