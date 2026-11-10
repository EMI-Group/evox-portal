---
title: "Genesis Development: Give Projects a Persistent Registry"
pubDate: 2026-11-10
summary: "The November 9 main-branch changes replace recent-project tracking with a database-backed registry and keep local and remote project choices separate."
---

Opening a repository on another machine should not mix its identity with local projects. Changes merged into Genesis main on November 9, 2026 connect the Projects page and project palette to a database-backed VCT project registry, replacing the previous recent-project list. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Project folders stay in separate host cabinets with matching registry tags](./project-host-registry.webp)

## A project has a registered place

Opening or creating a project registers its mount through the node-aware project interface. The palette searches registered paths, while the active project can show its mount point. Remote project lists come from the selected host; while a remote connection is pending, local entries stay out of that view. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Check the host before continuing

For development builds using these changes, reopen a local and a remote repository and check their project identity and path suggestions. The registry is the navigation record; continue reviewing code changes through the project’s normal validation workflow.

[Genesis Multi-Repository Work: One Objective, Separate Histories](/news/genesis-multi-repository)
