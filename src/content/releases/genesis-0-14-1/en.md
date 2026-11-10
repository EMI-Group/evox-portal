---
title: "Genesis 0.14.1: Keep Model Choices Attached to the Work"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Account-level model profiles, subscription authentication and a shared remote server reshape configuration in Genesis 0.14.1. Here is what changes and what to check when upgrading."
---

Choosing a model also means choosing the account that pays for it, the credentials it uses and the reasoning settings it carries into a task. Released on November 8, 2026, **Genesis 0.14.1** makes that identity consistent across Settings, Projects, Assistant, the scheduler and runtime. The formal release also unifies remote operation around the headless server and adds more controlled runtime inspection. [Full release notes][release]

![A selected account tab stays connected to its model choices](./provider-account-continuity.webp)

## Configure an account once, select a task precisely

A provider profile holds authentication, endpoint, concurrency and schedules. Its nested model inventory holds the models available through that account, with model-specific generation and reasoning overrides. Task selection carries a credential-free identity: provider-profile ID, model ID and optional reasoning effort. A concrete selection locks that identity downstream; **Auto** leaves selection to configured rules.

For example, two models under a work account share its concurrency slots and rate-limit backoff. Adding a model does not create another quota pool. A separate personal account can have different credentials and scheduling. When those accounts need distinct API keys, use distinct credential names as well as distinct profile IDs. [Profile configuration and selection rules][profiles]

Every selectable model needs an entry in `[[llm.providers.models]]`; setting only `default_model` is insufficient. Reasoning defaults are separate from the supported-effort inventory. In the dashboard, a nonempty inventory without a resolved default selects its first effort, while a core API call omitting effort can omit the parameter. Recheck model and effort after switching profiles.

The release fixes explicit selections being lost across task, agent and system layers, scheduler fallback pools, and incomplete saved model snapshots that could cause `:model_spec_schema_unavailable`. Archived settings are now JSON-safe and redact credentials. These fixes matter when returning to saved configuration as much as when creating a new task.

## Subscription login follows the account's configuration

Supported profiles gain OAuth/subscription authentication and per-profile login status. Genesis imports vendor CLI login files into a managed credential file used by ReqLLM. `openai_codex` is OAuth-only; Anthropic subscription profiles use `auth_mode = "oauth"`. The versioned guide starts with `codex login` or a Claude CLI login on the node that will use the account. [Subscription setup][oauth]

The managed default is `auth.json` beside `config.toml`. A custom `oauth_file` belongs on the provider profile; the global `[llm] oauth_file` key is removed. New managed files use mode `0600`, and imports are atomic. The file stores one entry per provider, so distinct profile IDs alone do not isolate multiple subscription logins.

For a remote worker, check login status on that remote node. If a vendor login exists but its managed destination is read-only, change the profile to a writable private path: logging in again will not fix the destination. Environment-only OAuth tokens cannot refresh automatically. The revised status messages distinguish these cases.

## A remote worker and a dashboard use one server

The separate `genesis_remote` distribution is retired. Remote commands and bootstrap now use the shared `genesis_server`, with HTTP always available and Erlang distribution switchable at runtime through a SIGHUP-triggered file protocol. The CLI exposes `genesis remote start`, `stop`, `status` and `logs`. [Server and installation entry points][readme]

For someone keeping a dashboard on a laptop and execution on an SSH host, this changes service management: review scripts naming the old distribution and manage the shared server instead. The release also supports remote project test execution and resuming test runs at call time. The headless HTTP server listens on localhost by default and has no built-in authentication; the documented remote access path uses an SSH tunnel.

## More recoverable interaction during long runs

A tiered, brokered Elixir evaluator adds exact-code approval and recoverable approval in chat. Evaluator output is truncated to the remaining budget instead of failing for exceeding it. Other changes include a short turn-limit recovery window, tool-free final replies, shorter sequential job IDs and stable per-agent-run prompt-cache identities for OpenAI/Codex GPT calls. The dashboard also gains a fused capsule panel and shared task/model controls. [Detailed changes and fixes][release]

## Upgrade with the configuration visible

1. Use the installers or server assets attached to [v0.14.1][release] for the intended platform. Back up existing configuration before changing account structure. Legacy `[[llm.models]]` remains a compatibility input; canonical provider profiles take precedence, and an explicit Settings/config save performs migration.
2. In **Settings → LLM → Provider profiles**, review authentication, the nested model inventory, reasoning defaults and any custom `oauth_file`. Ensure credentials are available to the process running the task, including on a remote server.
3. After restarting the headless server, use `genesis status`; then check a task's explicit profile/model/effort selection, an Auto selection and the remote connection you actually use. Review old daemon scripts before reusing them. These are upgrade checks derived from the documented changes.

For the operator workflow around running tasks, continue with [Genesis Assistant: A Clearer View of Running Work](/news/genesis-development-2026-11-07).

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
