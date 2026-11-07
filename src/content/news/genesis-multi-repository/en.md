---
title: "Genesis Multi-Repository Work: One Objective, Separate Histories"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 adds persistent worktrees for writable companion repositories, extending cross-repository development with explicit review and integration boundaries."
---

A feature may span an API service, a client application and a shared library. Their changes belong to one objective but not necessarily one Git repository. Genesis 0.13.4, released on September 26, 2026, adds persistent worktrees for writable companion repositories, giving cross-repository work a more explicit execution boundary.

## From access to isolated work

Version 0.11.4 introduced read-write support for additional repositories, including repository-specific review and write gates for read-only repositories. Version 0.13.4 builds on that foundation: agents work in a persistent worktree for each writable companion repository without moving its main HEAD or disturbing its primary working tree.

Paths into that repository resolve against the worktree. The initial agent context exposes its location, and cross-repository delegation uses that location as its base. This makes the place where changes happen explicit, particularly when repositories have different directory layouts or independent development activity.

## Integration remains a per-repository decision

Version 0.13.0 introduced review cards with separate merge and reject controls, merge checks and resolution states. A merge-all shortcut can accept outstanding repositories together, while individual outcomes remain visible. The same release corrected review flows for tasks that change only companion repositories.

For an API change, this means reviewing the service, client and library contributions in their own histories. The repositories still need compatible interfaces and appropriate tests; a multi-repository merge action is not evidence of an atomic transaction or automatic cross-project compatibility.

## A foundation for larger software systems

The milestone concerns the organization of work as much as its generation. Genesis can coordinate contributions across repository boundaries while preserving the places where users inspect and accept them. This extends EvoX's evolutionary software direction toward systems composed of several independently maintained parts, with accepted versions providing the starting points for subsequent development.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.11.4) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
