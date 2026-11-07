---
title: "Genesis: Keeping Development Moving Across Context Windows"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 connect context compression, persistent background jobs and budget-aware checkpoints to support longer development tasks."
---

A long build, a large tool response and a growing conversation can place different pressures on an AI development task. Genesis 0.13.10, released on October 29, 2026, completes a sequence of changes begun in 0.13.8 that separates ongoing execution from the limited conversation available to the model. For EvoX's software-development infrastructure, continuity depends on managing both.

## Compression follows the model's budget

Version 0.13.8 introduced two stages: pruning tool results without a model call, followed by checkpoint summarization. The trigger is relative to the context window, with per-agent window settings and a refreshed runtime snapshot. A visible context meter exposes usage and compression counts so operators can inspect what is happening.

Version 0.13.10 addresses a difficult boundary case: an oversized recent message could prevent compression from reducing the conversation sufficiently. Recent messages are now constrained by a token budget, tool-call/result pairs remain intact, and obsolete runtime refreshes are removed. Exactly one current runtime refresh is retained. These are measures to preserve a usable working context, not a claim of lossless memory.

## Execution can outlast a conversation segment

Detached background shell jobs, introduced in 0.13.8, survive context compression and report completion. An agent can inspect output, list jobs or stop a job instead of keeping the whole operation inside one blocking tool call. Version 0.13.9 also fixes jobs on the systemd sandbox backend that otherwise remained stuck in a running state.

## Continuity needs observable state

Consider a lengthy test run: its execution, status and output need a lifecycle independent of a summary of the conversation. These updates make that separation more explicit. They do not guarantee that every task completes or that summaries preserve every detail. Their value is a more inspectable foundation for continuing work while model context remains finite.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)
