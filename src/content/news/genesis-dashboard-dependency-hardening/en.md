---
title: "Genesis hardens the dependencies behind its dashboard"
pubDate: 2026-11-25
summary: "The main branch updates Phoenix, LiveView, Bandit and jsv; source deployments need a rebuilt application to receive the changes."
---

Genesis dashboard maintenance on November 23, 2026 updates four dependencies on `main`. The change concerns the shared web infrastructure through which users reach the workbench, rather than a new task interface. For teams building Genesis from source, the important artifact is the dependency set used to build the running service. [Dependency update][lock]

![A replacement latch component strengthens a shared door mechanism](./cover.webp)

*Concept illustration: maintaining the components that protect a shared entrance.*

## What changed beneath the interface

The Genesis dependency declaration links the Phoenix update to presence-tracker and broadcast-dispatch crash fixes, and the LiveView minimum to a fix for session initialization hooks being skipped when a join omits its URL. It also describes Bandit’s HTTP/2 validation and hardening changes. These are the reasons recorded by the Genesis maintainers; the commit does not establish whether a particular deployed instance was exposed. [Declared requirements][pins]

The lockfile moves Phoenix from 1.8.16 to 1.8.17, LiveView from 1.2.13 to 1.2.15, Bandit from 1.14.1 to 1.15.0, and jsv from 0.28.0 to 0.28.1. The declared LiveView minimum is 1.2.14, while the locked build uses 1.2.15. A companion Nix change recalculates the dependency hash for the updated lockfile. [Locked versions][lock] · [Nix build update][nix]

## Check the build you actually deploy

For example, a self-hosted team can update its checkout yet continue running an older dashboard binary. To apply this change, use a revision containing these commits and rebuild and redeploy through the project’s normal installation procedure. Check the build’s `mix.lock`, retain the matching Nix dependency hash when applicable, and verify dashboard access and live reconnection after deployment. Updating a source directory alone does not replace the running service. [Build and installation guide][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md
