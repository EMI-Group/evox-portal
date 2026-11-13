---
title: "EvoRL: Keep Every Write, Read One Record per Training Step"
pubDate: 2026-11-13
summary: "Local JSONL recording preserves experiment metadata and metric writes, then merges repeated steps for analysis without a tracking SDK."
---

A training iteration can produce several observations: a loss, an evaluation return, then a corrected metric. Treating every write as a new iteration misaligns the experiment; discarding repeated steps loses information. EvoRL, the reinforcement learning and evolutionary learning framework, added [local JSONL recording][change] to `main` on November 12, 2026. A [filename follow-up][fix] arrived on November 13, Beijing time. Together, they provide a local record of what was written and a separate, step-aligned view for analysis.

![Raw experiment sheets retained beside an archive grouped by matching observation steps](./jsonl-recording-cover.webp)

*Concept illustration: preserve individual observations, organize their combined view by training step.*

## A local artifact with the experiment attached

Selecting `recorders=[log,jsonl]` saves machine-readable metrics alongside ordinary logs without adding a tracking SDK. The [versioned quickstart][guide] documents the same recorder setup used by the training scripts, so the JSONL backend receives the project, run name, resolved configuration, tags, output path and optional group.

Initialization writes that context as a metadata header. Each subsequent write appends one JSON object containing the supplied integer `step` and nested `data`, then flushes the file. The raw file preserves arrival order, including out-of-order steps and repeated writes. This makes it useful when moving an experiment's output directory to a separate analysis machine: configuration and observations travel together in a readable local artifact.

## Merge at reading time, not during recording

The loader `load_jsonl_records(path)`, exported from `evorl.recorders`, reads the complete dataset and returns a list sorted by step. It recursively merges dictionaries for the same step; later writes replace conflicting values while leaving unmentioned metrics intact. Arrays are replaced as whole values, and a later `null` also replaces an earlier value. The loader skips the optional first-line metadata header rather than including it in the metric list.

Consider training loss and evaluation return written separately at step 10, followed by a corrected loss for that step. The raw file retains all three writes. The loaded record contains the latest loss and the evaluation return. A step 8 record arriving afterward sorts before step 10. This distinction matters when plotting learning curves: iteration identity comes from `step`, not from line position or the number of logging calls.

## Know what survives serialization

The [implementation and regression tests][change] cover NumPy, JAX and pandas values. Arrays and Series become lists. DataFrames retain columns and row data, but omit their index. NaN, infinity and pandas missing values become JSON `null`. If a DataFrame index identifies samples, promote it to an explicit column before recording; that follows directly from the stored table representation.

Malformed or incomplete lines raise an error identifying the file and line number. The loader does not silently discard a truncated final record. It loads the complete dataset into memory, so plan analysis memory around the accumulated file. An application metric named `step` remains inside `data`, distinct from the recorder's outer iteration field.

## Give each run a distinct destination

The follow-up shares `sanitize_filename` between JSONL and script-created log files. It replaces `/` with `_`: `MetaWorld/Hammer-v3` becomes `MetaWorld_Hammer-v3`. Other characters remain unchanged, and metadata keeps the original run name. The files use separate `.jsonl` and `.log` extensions. This replaces the initial commit's percent-encoding rule; filename normalization is not a uniqueness guarantee.

Reinitializing the same JSONL file path overwrites its contents. Use a distinct output directory or filename for each run, especially where names differ only by slash versus underscore. Start with the configuration above on a source checkout containing both commits, then load a small experiment and inspect its header, repeated-step merge and destination before collecting a longer run. The [earlier EvoRL development report][related] explains the gradient, device and metric-shape context; this update makes those observations easier to retain and revisit locally.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /news/evorl-jax-training-consistency
