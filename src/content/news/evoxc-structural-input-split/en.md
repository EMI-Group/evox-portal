---
title: "EvoX Compiler separates reusable preparation from changing inputs"
pubDate: 2026-11-28
summary: "New structural graph transforms expose a prepare/apply boundary, helping developers inspect what can be reused and what must run for every input."
---

A repeated calculation often mixes inputs that stay fixed with inputs that change every call. Recomputing the fixed contribution can be wasteful, but retaining an arbitrary intermediate can silently change behavior. EvoX Compiler main now exposes split_by_inputs and analyze_inputs: a structural pass separates one traced graph into preparation and application graphs, with an inspectable tensor boundary. The source graph stays unchanged. The November 27–28 development changes make reuse an explicit program decision rather than a hidden runtime cache. [Implementation and contract][contract]

![A printing press holds one prepared engraved plate while different sheets pass through a separate feed](./cover.webp)

*Concept illustration: prepare the fixed contribution once, then reuse it for changing inputs.*

## Choose what remains fixed

Imagine evaluating many candidate tensors against the same reference data. If a straight-line graph derives a reference-only intermediate before combining it with each candidate, that derivation can belong to prepare. The varying candidate belongs to apply, which consumes both its changing input tree and the tuple of prepared tensors. This example describes a suitable workload shape, not a measured speedup.

The fixed mask mirrors the input pytree: True selects a fixed tensor, while False or None selects a varying tensor. Alternatively, fixed_leaves names flat tensor-input indices. Supply exactly one selector. Static leaves are already graph specializations and are not boundary inputs; a non-None mask there is rejected. Both halves require tensor inputs, so selecting none or all as fixed is invalid. Plain tuples, lists and dictionaries are pruned per tensor leaf; partially pruning a fixed-arity registered node, dataclass or namedtuple is refused. [Input selection][split]

## Inspect the boundary before paying for it

The pass propagates input-dependence masks through straight-line SSA, traces backward from outputs to remove dead operations, and selects fixed-only values needed by mixed operations or returned outputs. Operations are cloned into fresh modules. Constants are copied into the relevant half rather than shipped as prepared outputs. Unused varying inputs remain in the apply signature for stability.

SplitPlan reports the prepared boundary, shapes, dtypes, estimated bytes and operation counts. Unknown static sizes produce an unknown byte estimate. Counts refer to distinct source-operation IDs: a constant copied into both halves appears in each count but only once in the union used to calculate dropped operations. Adding the two counts therefore need not reproduce the source count. The report helps compare retained storage and repeated computation without pretending that operation counts predict wall-clock time. [Analysis API][analysis]

## Reuse is a snapshot with explicit limits

Changing a fixed input requires running prepare again. Neither graph maintains invalidation state. Operations with effects beyond pure/read are rejected because input independence alone does not make an operation safe to execute once. The initial pass also refuses nested-region control flow such as cond, while_loop and scan. Collectives, callbacks and external/custom calls therefore need another approach when blocked by these gates.

analyze_inputs inspects the same dependency machinery without executing, tracing or importing a backend. It reports whether splitting is supported, the blocking reason, input consumers, affected outputs and the boundary cost of fixing each input alone where legal. Start there: a large retained boundary or little fixed-only work may make the split unattractive. A rejection is useful feedback about the graph, not a reason to suppress a side effect.

## Check both halves against the original

Use a source checkout containing these commits. Obtain a SplitPlan and call its verify method to check graph invariants and boundary wiring. Stage each ordinary Graph through lower, compile and load; build deliberately rejects an already-traced Graph. Run prepare with only fixed arguments, then run apply with the varying input tree and prepared tuple. Compare outputs with the original over several varying inputs under the backend’s numerical tolerances, then change the fixed inputs and repeat preparation. Measure setup, recurring execution and retained memory separately. The [earlier compilation-pipeline article][related] explains the surrounding stages.

[contract]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/CONTEXT.md
[split]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/split.py
[analysis]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/analyze.py
[related]: /news/evoxc-custom-compilation-pipeline
