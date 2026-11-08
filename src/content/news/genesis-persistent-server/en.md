---
title: "Genesis Server: A Persistent Runtime for Software Development"
pubDate: 2026-11-02
summary: "From the headless release in 0.13.11 to logout persistence in 0.14.0, Genesis develops an independently deployable home for its dashboard and agents."
updatedDate: 2026-11-08
---

Genesis 0.14.0, released on November 2, 2026, adds detection of systemd lingering and offers to enable it when starting the server. It follows the headless distribution introduced in 0.13.11 on October 30. Together, these changes give development work an execution environment whose lifecycle can be managed separately from a desktop session.

![A server keeps tasks active beside a closed terminal](./persistent-server-session.webp)

## A server distribution with operational controls

The headless release packages the dashboard and agent runtime for Linux x64/arm64 and macOS arm64. Its CLI covers serving, starting, stopping, status, logs, health and version reporting. The installation script verifies checksums, installs or upgrades the package and links the executable. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Addressing the lifecycle around execution

On Linux systems using systemd, user services may need lingering to remain available after logout. Version 0.14.0 checks that condition and offers configuration through `GENESIS_LINGER` or the `--no-linger` option. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

The preceding release also improves remote startup: commands use a POSIX shell wrapper, paths containing spaces are handled correctly, and connection errors provide readable reasons. Server-mode fixes and accurate uptime reporting make the operational state easier to diagnose. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Before leaving the server running

Before moving a long task to the server, check its status, logs and `/health` response. On a systemd host, confirm the lingering setting and check availability again after logout. These checks establish the execution baseline; [development history](/news/genesis-development-history) then helps follow the code produced there.
