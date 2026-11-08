---
title: "Genesis Assistant: A Clearer View of Running Work"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Inspect tasks, understand system capacity and act through one conversation. Genesis’s recent main-branch changes also simplify remote services, background jobs and model credentials."
---

A long-running software task raises questions long after it starts: which work is still active, why did a task fail, and what should happen next? Changes merged into Genesis’s `main` branch on November 4–7, 2026 bring those questions into the dashboard’s Assistant conversation, alongside improvements to the services underneath it.

![A developer reviews running and paused tasks](./genesis-assistant-task-flows.webp)

*One conversation, several work streams: an editorial illustration of the update’s central idea.*

## Start with the task, not the control

Genesis Assistant can read Genesis’s source and documentation, inspect tasks and check live scheduler capacity. A developer can ask it to examine a failed task’s status, error and result, then request a next step such as resuming earlier work. The conversation connects explanation with operations on the node currently being viewed.

The [Assistant guide][assistant] gives concrete starting points: list running work, check available model slots, or pause scheduling during a merge. Pausing affects scheduling while work already in flight continues. Temporary runtime changes and saved configuration remain distinct, so a setting changed for the current session need not silently become a permanent default.

Inspection uses the `read` tier. Changes use `write`, with approval of the exact code; `sudo` has a separate approval card. This makes the proposed action visible at the point where a question turns into an operation.

## One server, two ways to connect

Remote development and the HTTP dashboard now share a single server instance. Previously, the remote command family started a separate distribution-only instance. With the [shared-server change][remote], `genesis remote stop` disables remote distribution while the HTTP dashboard stays available. Disconnecting remote development no longer requires stopping that shared HTTP service.

## Small details that make work easier to follow

[Background jobs][jobs] now receive short identifiers such as `bash-1`. When the calling agent owns exactly one job, `job_output` can resolve it without a `job_id`; with several jobs, it returns their identifiers, statuses and labels so the agent can select the right one.

[OAuth credential-file overrides][oauth] now belong to individual model profiles under `[[llm.models]]`, replacing the global `[llm] oauth_file` setting. Developers using custom credential paths can keep each path alongside the model it serves.

Together, these changes give developers clearer points of contact with work already under way: a task to inspect, an action to approve and a service whose state is easier to follow. For the broader system, read the [Genesis introduction][intro]; for specific operations, use the [Assistant guide][assistant].

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /news/evox-genesis

