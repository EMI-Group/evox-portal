---
title: "Genesis 0.14.1: Keep Model Choices Attached to the Work"
pubDate: 2026-11-10
summary: "Provider-account profiles connect model and reasoning selection across Genesis, while remote development moves to one shared server."
---

Choosing a model is also choosing an account, credentials and reasoning settings. Released on November 8, 2026, Genesis 0.14.1 carries that selection through Settings, Projects, Assistant, the scheduler and runtime, reducing the gaps between what a task requests and what actually runs. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![A selected account tab stays connected to its model choices](./provider-account-continuity.webp)

## One profile, a consistent selection

Canonical provider profiles separate the provider account from its model selection. Shared selectors expose model and reasoning choices; scheduler fixes preserve explicit task selections and the complete saved configuration. Supported profiles also gain OAuth/subscription authentication, per-profile login status and credential-file import from vendor CLIs.

## One server for local and remote operation

Remote development now uses the same genesis_server distribution as the headless dashboard. The separate genesis_remote release is retired. The CLI manages remote start, stop, status and logs; distribution can be toggled at runtime while HTTP remains available.

## Check the handoff when upgrading

After upgrading, review the provider account, model and reasoning selection in Settings, then check an explicit task selection. Custom OAuth credential paths belong to individual model profiles. Remote operators should review the shared-server change before reusing older daemon scripts. The release notes provide the full migration and fix list. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant: A Clearer View of Running Work](/news/genesis-development-2026-11-07)
