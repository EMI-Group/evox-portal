---
title: "Genesis Server: A Persistent Runtime for Software Development"
pubDate: 2026-11-02
summary: "From the headless release in 0.13.11 to logout persistence in 0.14.0, Genesis develops an independently deployable home for its dashboard and agents."
---

Genesis 0.14.0, released on November 2, 2026, adds detection of systemd lingering and offers to enable it when starting the server. It follows the headless distribution introduced in 0.13.11 on October 30. Together, these changes give development work an execution environment whose lifecycle can be managed separately from a desktop session.

## A server distribution with operational controls

The headless release packages the dashboard and agent runtime for Linux x64/arm64 and macOS arm64. Its CLI covers serving, starting, stopping, status, logs, health and version reporting. The installation script verifies checksums, installs or upgrades the package and links the executable.

These are practical interfaces for operating a persistent process. A health endpoint reports status, version and uptime; logging exposes what the service is doing. A healthy process, however, does not establish that an agent's changes are correct or that a project has passed its tests. Runtime health and software validation remain different responsibilities.

## Addressing the lifecycle around execution

On Linux systems using systemd, user services may need lingering to remain available after logout. Version 0.14.0 checks that condition and offers configuration through GENESIS_LINGER or the --no-linger option. This is a platform-specific lifecycle feature, not a promise that every operating system behaves identically.

The preceding release also improves remote startup: commands use a POSIX shell wrapper, paths containing spaces are handled correctly, and connection errors provide readable reasons. Server-mode fixes and accurate uptime reporting make the operational state easier to diagnose.

## Why deployment belongs in the story

For long development tasks, placing execution on a suitable machine is part of the workflow. The server release provides a deployable component with explicit lifecycle controls. It extends Genesis beyond a desktop-only entry point and strengthens the operational side of EvoX's software-development infrastructure, without replacing review, validation or the decisions about which results to accept.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)
