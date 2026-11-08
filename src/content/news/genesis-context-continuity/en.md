---
title: "Genesis: Keep Long Tasks Moving While Context Shrinks"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 connect context compression, persistent background jobs and budget-aware checkpoints to support longer development tasks."
updatedDate: 2026-11-08
---

A test run may still be working when an agent's conversation fills up. Genesis 0.13.8–0.13.10, released October 26–29, 2026, give those two lifecycles separate mechanisms: compress the model's working context, while detached shell jobs keep their output and completion status available.

![A red press compacts a fragmented ribbon while a separate thread remains continuous](./context-compression-continuity.webp)

*Compact working context, continuing execution.*

## Compression follows the model's budget

Version 0.13.8 introduced two stages: pruning tool results without a model call, followed by checkpoint summarization. The trigger is relative to the context window, with per-agent window settings and a refreshed runtime snapshot. A visible context meter exposes usage and compression counts so operators can inspect what is happening. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

Version 0.13.10 addresses a difficult boundary case: an oversized recent message could prevent compression from reducing the conversation sufficiently. Recent messages are now constrained by a token budget, tool-call/result pairs remain intact, and obsolete runtime refreshes are removed. Exactly one current runtime refresh is retained. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## Execution can outlast a conversation segment

Detached background shell jobs, introduced in 0.13.8, survive context compression and report completion. An agent can inspect output, list jobs or stop a job instead of keeping the whole operation inside one blocking tool call. Version 0.13.9 also fixes jobs on the systemd sandbox backend that otherwise remained stuck in a running state. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## Continuity needs observable state

For a long build or test, use a detached job and follow its status and output after compression. The context meter makes usage and compression counts visible; a job's terminal status tells you whether execution completed or failed. These are complementary signals for deciding the next step. See the [Genesis introduction](/news/evox-genesis) for the broader development workflow.
