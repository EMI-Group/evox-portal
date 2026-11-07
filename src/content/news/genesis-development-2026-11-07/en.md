---
title: "Genesis Development Update: Assistant and a Shared Remote Server"
pubDate: 2026-11-07
summary: "Recent main-branch work adds an operator chat, a shared remote server and simpler background-job handling."
---

Changes merged into Genesis’s `main` branch on November 4–7, 2026 improve day-to-day operation. **These are development updates, not a new release announcement.** The latest published release checked on November 7 remains v0.14.0.

Genesis Assistant becomes a dashboard operator chat: it can inspect tasks and system capacity and request task or configuration changes. Its read/write/sudo evaluation tiers distinguish inspection from operations requiring exact-code approval; sudo has a separate approval card. See the [Assistant guide][assistant] for the boundaries.

Remote development now shares one server instance with the HTTP dashboard. `genesis remote stop` disables remote distribution while leaving HTTP running. Background jobs receive short identifiers such as `bash-1`; `job_output` can omit `job_id` when the calling agent owns exactly one job.

For users tracking development builds, OAuth credential-file overrides now belong to individual model profiles (`[[llm.models]]`), rather than a global `[llm] oauth_file` setting. Check the linked changes before updating development configurations; these changes should not be assumed available in v0.14.0.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0) · [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

