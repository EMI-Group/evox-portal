---
title: "Genesis 0.14.3: Pause a Task, Resume Its Whole Agent Tree"
pubDate: 2026-11-19
summary: "Durable per-agent checkpoints connect task recovery, visible execution phases and bounded tool concurrency in Genesis 0.14.3."
---

Long-running development work needs more than a restart button: it needs to retain which agents were working, what each had learned and which file state can actually be recovered. [Genesis 0.14.3][release], released on November 19, 2026, brings task-level pause and resume together with durable agent state, clearer live activity and changes to configuration, approvals and deployment.

![A branching mechanical tree reconnects to its individually anchored bases](./whole-tree-resume.webp)

*Concept illustration: restoring a task means reconnecting its branches to their own saved state.*

## Pause one task without cancelling it

A running task can move through `pausing` to `paused`. Its agents finish their in-flight tool batches, checkpoint their conversations and commit their worktrees before stopping. Paused tasks remain visible and resumable; they do not become completed or cancelled work. The same task ID is used when work resumes.

This is useful when a multi-agent implementation must stop between work sessions. Keep the task's persist-agent-state option enabled, request pause, and wait for the paused state before treating the work as settled. Persistence is on by default and can also be controlled through `persistent_state` on `genesis_start_task`. Interactive sessions cannot be paused, and disabling persistence makes a task non-resumable. The [versioned implementation][pause] also requires a durable root-agent record; child records alone cannot justify restarting the objective.

## Recover the tree, with an explicit file boundary

A separate SQLite store retains per-agent conversations, run identities and progress through tool and subagent batches. On a whole-tree resume, completed children contribute stored results; running children resume from their own durable checkpoints and worktree bases. Stable agent IDs preserve these associations, with a warning fallback when an identity is already occupied.

Git references under `refs/genesis/agent-state` keep checkpoint commits reachable after worker branches are reclaimed. A clean pause can recreate the worktree from its recorded pause commit. After interruption, the [resume notice][notice] identifies the checkpoint that is guaranteed: uncommitted changes from the killed run are not guaranteed to survive. If no checkpoint is available, the notice explains the fallback to the task base.

For a resumed task that had been editing files and launching jobs, inspect the named commit, `git status` and `job_list` before repeating operations. Interrupted tool calls receive repair information, rather than invented successful results. The release also fixes duplicate subagent spawning, interactive sessions incorrectly restored as dirty-paused tasks, and turn-limit recovery.

## See work that previously looked idle

The inspector and Assistant now consume live activity and atomic watch snapshots. Context compression and preparation of the next turn have dedicated busy phases instead of appearing idle. Live calls appear as tail rows in Context Memory while historical reasoning stays static. This makes a quiet interval easier to interpret without confusing compression with a stalled request.

Scheduler-owned tool permits bound concurrent invocation and retain ownership through background handoffs. Abandoned launches are rejected and timeout containment finishes before tool tasks stop. Background completion notices and OS status probes move off the registry's blocking path; session finalization also avoids synchronous persistence barriers. The checkpoint writer coalesces queued work and applies backlog and payload caps, containing storage pressure rather than allowing it to stall every agent.

## Configuration and approvals become more explicit

Schema-driven settings APIs support partial updates, while Assistant can discover configuration and look up projects read-only. Approval dialogs and notifications expose the requesting identity, its authority and execution status. Notification scoping, focus handling, permission prompts and reduced-motion behavior are improved.

Project-aware Assistant sessions also carry isolated conversations, uploads and task following into this release; the [project-workflow article][workflow] explains that interaction in detail. Explicit local skill-inventory commands bypass tool permission checks, and an automatic commit fallback handles a missing or failed agent commit step.

## Upgrade and check the recovered work

For an existing headless-server installation, the [versioned updater guide][update] documents:

```bash
genesis update --check
genesis update
```

The check exits with code 10 when an update is available. Let active work finish before upgrading; the updater checks server activity, stages the release, restarts and verifies health. On the new version, pausing remains busy for the update gate, while paused tasks remain resumable and do not block it. Fresh server packages are linked from the release for Linux x64, Linux ARM64 and macOS ARM64.

Database upgrades now use normal migrations instead of a separate historical reconciliation step. Conflicting legacy identities are reconciled additively, while residual or incomplete migration state is rejected. A SQLite repair path is development-only. Unused resume helpers and a completion alias leave the public API, so custom integrations should review those removals.

Dependencies include Plug 1.20.4's multipart length-limit security fix and ReqLLM 1.31.0; Nix dependency hashes and preflight checks are refreshed. After updating, verify the server's reported version and health, then try a small persistent task: pause it, confirm its checkpoint, resume the same task and inspect child results and activity labels. Keep the [full release notes][release] alongside any deployment-specific migration diagnostics.

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.3
[pause]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/task_registry/pause.ex
[notice]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/agent/resume/notice.ex
[update]: https://github.com/EMI-Group/genesis/blob/v0.14.3/docs/server-update.md
[workflow]: /news/genesis-assistant-project-workflows

