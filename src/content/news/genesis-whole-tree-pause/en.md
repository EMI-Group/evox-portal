---
title: "Genesis pauses the whole task tree without completing unfinished children"
pubDate: 2026-11-26
summary: "A coordinated snapshot preserves parent waits, child identities and worktree checkpoints, then resumes the same task through a clean or repair-aware path."
---

A development task can be waiting on several child agents when its owner presses Pause. Finishing those child batches merely to stop would change the work being preserved. Genesis changes on main on November 25, 2026 introduce a coordinated whole-tree snapshot: parents retain their waiting position, children retain their identities and checkpoints, and Resume reconstructs that relationship under the same task ID. [Snapshot design and implementation record][design]

![A branching kinetic mobile held in position by an archival support frame](./cover.webp)

*Concept illustration: preserve every unfinished branch before resuming the whole structure.*

## Pause is a task lifecycle, not a global throttle

The scheduler-wide pause stops new work from being admitted; it does not put one running task into a durable resting state. The task-level protocol moves a task through pausing to paused, preserving its result context and leaving its finish timestamp unset. Cancellation remains a separate action and wins if it arrives while the pause is in progress. Interactive sessions are outside this protocol. [Registry integration][registry]

For example, an agent coordinating a parser and its test suite may be parked waiting for two children. A task pause must preserve that wait rather than invent completed child results. The coordinator marks the live task roster for pause, removes queued model/tool-slot requests and parks parents blocked on their subagent batch. Each agent stops at a turn boundary after its tool batch, or at the parked waiting position. [Freeze coordinator][coordinator]

## Preserve work before reclaiming resources

Before stopping, an agent reaps background jobs, checkpoints its worktree, preserves the durable pending-tool marker and flushes its state. Checkpoint commits are anchored so later worktree reclamation does not discard them. The snapshot records whether an agent was at a turn boundary, awaiting children or inside an interrupted batch. A pause reports its own outcome; it does not report success for an unfinished child or merge that child’s work. [Agent freeze path][agent]

The wait is bounded. The documented default allows 120 seconds for quiescence, followed by a 10-second forced-freeze grace. A clean pause requires every agent to prove an uninterrupted durable stop. If the budget expires or that proof is missing, the task records a dirty pause. This distinction describes the saved execution state, rather than promising that arbitrary external side effects can be undone.

## Resume reconstructs the existing collaboration

Resume re-enqueues the same task with its persisted options. A durable root row is required; child rows alone are insufficient, and an unreadable state store produces an explicit error. The restore planner rebuilds identities, topology and positions. A completed child contributes its stored result, a running child restarts under its own identity and checkpoint, and a child frozen before registration can be started from its original call specification. The parent continues waiting until real results arrive. [Thaw path][thaw]

A clean frozen batch is restored without the dangling-tool repair used for interrupted work. A dirty snapshot applies repair and a resume notice, preserving the distinction between known completed work and uncertain execution. When a checkpoint cannot be proven, restoration must not silently adopt it as a clean child checkpoint. On restart or lease reconciliation, a running or pausing task with persistent state and a durable root row becomes a dirty paused task; a non-resumable task retains the failed lease-expiry behavior.

## Check one pause and resume before relying on it

Use a source build containing these commits with durable agent state enabled. Pause a development task with active children, wait for the recorded paused state, then resume and confirm the same task identity, child relationships and saved work. Inspect any dirty-pause notice before continuing external operations. With persistent state disabled, pause is refused; recovery is bounded by durable checkpoints. The [earlier task workflow][related] provides the surrounding project and approval context, while this change defines how unfinished execution is preserved.

Related update · 2026-11-28: [Genesis v0.15.0: keep project work connected, from sign-in to recovery](/releases/genesis-0-15-0).

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /news/genesis-assistant-project-workflows
