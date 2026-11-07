---
title: "Genesis: Keeping Agent Contributions in Software History"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 connect task-scoped Git history with agent lanes so contributions remain inspectable after individual agents finish."
---

An agent tree describes who is working now. A project's history must also explain what remains afterward. Released on September 26, 2026, Genesis 0.13.4 develops the commit-history view introduced in 0.13.2 and the durable task references added in 0.13.3. Together they connect temporary activity to inspectable software versions.

## From live agents to durable task references

The task-scoped history API resolves durable references and the task's base commit. This lets the temporal view retain commits from recycled agents. The earlier API queries commit ranges and references across repositories; the task layer supplies the context needed to keep following a particular development effort.

When an agent delegates a module and then finishes, its contribution may still need review. Git history gives the change a durable identity; the task view helps locate it within the larger effort. The end of an agent episode need not erase the relationship between a task and its resulting code.

## Showing how contributions relate

Version 0.13.4 organizes commits into agent lanes, keeps subtrees together and shows delegation and merge-back edges. Unowned commits have a neutral lane. Selection, hover synchronization and keyboard access support inspection, while partial repository-fetch failures no longer blank the entire graph.

The display signals when history is truncated at its 100-commit limit. It is a navigable view into development, not an unlimited archive or a complete explanation of every decision.

## Traceability supports selection

A graph shows where a change came from and how it joined a branch; it cannot establish correctness. Diffs, tests and review remain necessary. For EvoX's evolutionary software direction, this makes the relationship between proposed contributions and retained versions more visible, helping users decide what to carry into subsequent development.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
