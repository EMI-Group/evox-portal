# Genesis Evidence blog revision — 2026-11-10

Five existing articles are revised in place. English is the content source; all twelve existing translations follow it. Publication dates and article slugs are retained. The editorial revision date is 2026-11-10. Existing artwork is retained; conceptual artwork is not used as experimental evidence.

## Source revisions

| Project | Source revision | Use |
| --- | --- | --- |
| EvoX Compiler | `v0.1.0`, commit `2b289f034f6f8e16b6c9b55932dfed76cc54690e` | Inspectable implementation and tests; release counts explicitly separated from the October 28 Evidence snapshot |
| MESA Rust redevelopment | `2ad071e658f8d4de21aa9f0e906592c364e10023` | Golden tests, numerical deviations, integration test and August 5 benchmark table |
| jcc | `a8c116ec7ed3d59479ad3be8fed3e63384f50a87` | Architecture, milestone definitions and regression mechanisms; not a reconstruction of the continuation run |
| WASM renderer | `67f620392b667714ba028f320d0e24f8ed32a16a` | Checked-in final verification record and source; report identifies tested bundle `c4ffbff` |

Evidence records were read on 2026-11-10. They remain project-reported accounts, not independent replications. No compiler, GPU, astrophysics or graphics benchmark was rerun for this editorial task.

## Article-to-claim map

### `genesis-evoxc`

- Historical totals, cost, scope, missing model/runtime data: [GW-000005](https://genesis.evox.group/evidence/evoxc/).
- Layer dependencies and integration-package boundary: [versioned package contracts](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md).
- Distinct stages, explicit closure capture, physical placement and errors: [specification tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py).
- Per-function preservation, IREE/NumPy comparison and StableHLO selection: [population integration tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py).
- Separate checkpoint/compute/staging model: [model integration contract](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md).
- Completion-event waiting, cleanup and fake-plugin limits: [synchronization tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py).
- Release totals and Genesis attribution: [release README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals).

The old `bench_logs/hf_bench_results.md` link returned 404 through the GitHub connector on 2026-11-10, and `bench_logs/` is absent from the inspected release tree. It is mentioned by the README but is not treated as inspected raw benchmark evidence. The revision removes that broken article link and makes no newly verified hardware-speed ranking claim. Source test definitions are described as definitions, not as newly executed tests or an archived sequence of agent repairs.

### `genesis-mesa`

- Archive size/cost/speedup range: [GW-000003](https://genesis.evox.group/evidence/mesa/).
- Crate membership: [Cargo manifest](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml).
- Grid reconstruction, implicit REAL(4) intermediates, 3.05e-8 difference and differentiated tolerances: [interpolation golden test](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs).
- Analytic Jacobian development and benchmark counters: [network development notes](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md).
- Quad-versus-f64 checksum residual and 1e-8 default: [benchmark helper](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py).
- EOS wiring, conservation and out-of-grid clamping: [one-zone integration test](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs). Its counters are not mixed with the benchmark counters.
- Matched inputs and timed loop: [workload contract](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md).
- Timing/checksum orchestration: [benchmark script](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py).
- Test counts, ignored tests, compilation flags, 15-run medians, timings and exclusions: [pinned README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md).

### `genesis-compiler-continuation`

- Model transition, carried context, depth and 1,820-case result: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/).
- Inherited compiler interfaces and stopping points: [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md).
- Run/fail corpora, diagnostics and verifier checks: [testing guide](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md).
- Output comparison, default tolerance and exit-code behavior: [LLVM runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py).

No claim is made about which exact defects the receiving model repaired, the starting pass rate, or the incremental cost. The 36-case repository subset is not the 1,820-case handoff evaluation. The recommended handoff package is explicitly editorial guidance, not a reported archived artifact.

### `genesis-wasm-render`

- Runtime architecture: [source contract](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md).
- Validation-order fix `7d8718a`, PNG fixes `89e4559`/`9bd7811`, affected subtest counts, bundle identifier, manifest denominator, renderer-active guard, residual controls and reproduction command: [final conformance report](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md).
- Decoder implementation: [PNG source](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts).
- Model, cost, history span, tracked-line composition and separate visual subsets: [GW-000004](https://genesis.evox.group/evidence/tbench-wasm/).

Detailed CTS JSON outputs are documented as gitignored; the article does not call them publicly inspected raw results. Chromium controls are attributed to the project report. No controlled ranking against trials with different budgets is asserted.

### `evox-genesis` (C compiler case within the existing introduction)

- Formation totals, model, cost and evaluated test counts: [GW-000001](https://genesis.evox.group/evidence/c-compiler/).
- Compiler stages and milestones: [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) and [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md).
- Correctness and rejection behavior: [testing](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) and [C11 policy](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md).
- External harnesses: [c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py), [LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py), [Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py).
- Csmith 93/0/7, lz4 gate and SQLite operation scope: [pinned README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md).

The old 93/93 Csmith wording is replaced with 93 passes, 0 failures and 7 skips from 100 seeds. Old figures embedded in the introduction are replaced by the retained conceptual hero and textual, source-linked results; no new experimental chart is fabricated. Unrelated comparisons with other vendors and repeated slogans are removed from this case-focused revision.

## Editorial validation

- `pnpm build`: 1,040 pages built successfully.
- `python scripts/check-blog-seo.py`: 494 localized blog pages checked; no errors. The generated audit report is updated in `docs/blog-seo-audit.json`.
- All 65 revised Markdown files retain matching source URLs, image paths, inline code, fenced code and revision dates across locales. Numerical tolerances and grouped test counts were checked with localized decimal/grouping conventions.
- All 29 distinct versioned GitHub source URLs in the English articles resolve to paths present in the inspected Git trees.
- Browser checks cover five articles × thirteen locales × two widths (1,440 px and 390 px): 130 responses successful, no document-level horizontal overflow and no broken article images. English checks pin the browser's locale preference so automatic language routing does not substitute a different edition. Lazy images are explicitly loaded before checking.
- Chinese desktop/mobile screenshots of the two priority articles were visually reviewed. Existing editorial illustrations and the historical renderer result figure are retained.
- Ten standalone reading previews (English and Simplified Chinese for each article) and a local index are exported under ignored `dist-preview/evidence-editorial/reading/`. Rendering assets are embedded; exported JavaScript dependencies are bundled and browser-language redirection is disabled only in the exported copies.

These checks validate the editorial sources and website output. They do not reproduce the original software experiments. Production publication and its verification are recorded separately from these editorial checks.
