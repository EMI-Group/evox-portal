---
title: "Genesis Multi-Repository Work: One Objective, Separate Histories"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 adds persistent worktrees for writable companion repositories, extending cross-repository development with explicit review and integration boundaries."
updatedDate: 2026-11-08
---

A feature may span an API service, a client application and a shared library. Their changes belong to one objective but not necessarily one Git repository. Genesis 0.13.4, released on September 26, 2026, adds persistent worktrees for writable companion repositories, giving cross-repository work a more explicit execution boundary.

![Three separate courtyards connected by a red ribbon, each with its own gate](./companion-worktrees.webp)

## From access to isolated work

Version 0.11.4 introduced read-write support for additional repositories, including repository-specific review and write gates for read-only repositories. Version 0.13.4 builds on that foundation: agents work in a persistent worktree for each writable companion repository without moving its main HEAD or disturbing its primary working tree. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

Paths into that repository resolve against the worktree. The initial agent context exposes its location, and cross-repository delegation uses that location as its base. This makes the place where changes happen explicit, particularly when repositories have different directory layouts or independent development activity. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Integration remains a per-repository decision

Version 0.13.0 introduced review cards with separate merge and reject controls, merge checks and resolution states. A merge-all shortcut can accept outstanding repositories together, while individual outcomes remain visible. The same release corrected review flows for tasks that change only companion repositories. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

For an API change, review the service, client and shared-library contributions in their own histories. Agree on interface versions and the order of integration, then run checks against the combined result.

## Prepare the cross-repository review

Before delegating, identify each repository's writable worktree. Afterward, use its review card to inspect changes, merge checks and resolution status. This gives a cross-project task a concrete set of acceptance decisions. The [development-history view](/news/genesis-development-history) helps trace the commits behind those decisions.
