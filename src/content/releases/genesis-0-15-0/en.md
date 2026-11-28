---
title: "Genesis v0.15.0: keep project work connected, from sign-in to recovery"
pubDate: 2026-11-28
summary: "A unified project workbench, browser ChatGPT sign-in and whole-tree task pause arrive together, with clearer review outcomes and safer configuration handling."
---

Genesis v0.15.0 was released on November 27, 2026. It brings the recent project-workbench, account-setup and task-recovery changes into one version. The practical benefit is continuity: choose the execution host and project, configure its model account, follow development, and return to unfinished work without confusing a chat response with a completed task. The release also changes review, background jobs and context handling, making this a broader upgrade than a dashboard refresh. [Full release notes][release]

![A mechanical control desk connects a project ledger, a key and a suspended branching assembly](./cover.webp)

*Concept illustration: identity, project context and recoverable work share one control point.*

## Keep the project and execution host visible

The workbench combines project overviews, task-scoped agent inspection, a shared composer and inline task options. Recent projects and folder browsing shorten selection; VCT workspaces group projects and provide a member picker. Select a concrete member before starting work, because a workspace group has no execution directory. Source Control exposes repository history and diffs. Preview and pinned tabs, middle-click keep-open, Alt+Arrow cycling and overflow navigation make the rail the single list of open views.

For a developer moving between a library and its application, this matters at submission time: the draft, selected model and repository must still describe the intended task. Project-keyed drafts now restore non-text fields after asynchronous loading. History search and filters retain their scope across navigation; review locations and task filters survive node changes. Late project activation no longer closes the palette or redirects an explicit selection away from its overview. [Workbench context][workbench]

## Configure an account, then confirm its model

Browser Sign in with ChatGPT is shared by the dashboard, setup and welcome flows and CLI. Remote hosts have a manual redirect-URL paste path; leaving or closing the flow cancels it. Existing provider accounts can initiate sign-in from Settings. Completing authentication refreshes the configuration snapshot and model picker instead of leaving a stale profile. Account wizards also provide canonical reasoning levels and schedule presets. The off_peak_holidays option uses a static China holiday and make-up-workday calendar for 2025–2027; it is not a worldwide holiday service.

Custom model accounts use OpenAI Chat Completions, while ChatGPT subscription requests include usage-attribution and prompt-cache identity headers. Keenable is an opt-in keyless search provider. Recheck account routing and schedules after upgrading. A partially saved account now falls back to default model selection with a warning rather than crashing the scheduler. Settings refuses a save if the local node identity changed; reload the node context before retrying. Provider keys are redacted from event logs, and Git operations verify project ownership. [Account workflow][accounts]

## Pause unfinished work without completing its children

Task pause now freezes the whole agent tree and resumes it under the same agent identities, replacing the older drain behavior. With durable agent state enabled, saved checkpoints preserve parent waits and child work; clean and interrupted recovery remain distinct. The Review page shows failed, cancelled and no-report outcomes explicitly, removes inapplicable actions and offers “Prepare follow-up task.” A needs-review filter makes those outcomes discoverable. [Pause mechanism][pause]

Background jobs receive globally unique short base36 IDs, per-task log locations and collision-safe registry filenames. Retention protects live owners and keeps tombstones instead of turning expired records into unexplained unknown IDs; registry memory growth is also fixed. Agents automatically commit when their primary commit step fails, and enabled co-authoring reaches merge commits. These changes improve traceability, but task state and repository changes remain the evidence to inspect before accepting a result.

## Upgrade and check the paths you use

CONTEXT.md gains Shared/Local scopes: ancestor context contributes only Shared content, while the assigned node sees the full file. Scoped read/edit tools and consolidated context commits keep local notes out of unrelated prompts. The release also fixes streaming remount state, duplicate live-tool rendering, archive and folded-history controls, timezone validation and dropped remote loads. Security-fixed Phoenix, LiveView, Bandit, idna, jsv and related dependencies ship together. Density and touch targets are unified; obsolete page entrance effects and the duplicate sidebar open-view list are removed. Desktop builds support an optional frameless title bar with platform-specific controls.

Use the v0.15.0 desktop asset for your operating system. The headless server supports Linux x64/ARM64 and macOS ARM64. Existing server installations can run `genesis update --check`, then `genesis update`, which installs the available update and restarts the server. Preserve the configured data directory and review the versioned installation instructions. Afterward, confirm the running version, account/model refresh, one project-scoped draft and a small pause/resume cycle; inspect the review outcome and job log for that task. [Versioned installation guide][guide]

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.15.0
[guide]: https://github.com/EMI-Group/genesis/blob/v0.15.0/README.md
[workbench]: /news/genesis-project-workbench
[accounts]: /news/genesis-provider-account-setup
[pause]: /news/genesis-whole-tree-pause
