---
title: "Genesis connects account setup, model choices and ChatGPT sign-in"
pubDate: 2026-11-22
updatedDate: 2026-11-25
summary: "A rebuilt provider wizard keeps credentials, model inventories, reasoning choices and schedules together, with a new Genesis-managed ChatGPT subscription connection."
---

A usable model connection needs more than a model name: authentication, the endpoint, supported reasoning choices and shared account limits must agree. Changes merged into Genesis `main` on November 19–20, 2026 rebuild Welcome and Settings around provider accounts. PR #175 adds **Sign in with ChatGPT**, replacing the older imported-Codex credential path for ChatGPT subscription profiles. [Merged integration][pr]

![An account key and selected model settings fit into a single organized instrument case](./cover.webp)

*Concept illustration: authentication and model choices belong to one configured account.*

## Configure the account, then its models

The Welcome flow now uses a step-by-step provider wizard, with Settings providing the continuing account-management surface. Account names and generated identifiers come from the provider rather than a selected model. One account can contain several models and reasoning choices that share credentials, concurrency and scheduling. Separate accounts remain appropriate when those properties differ. [Profile contract][profiles]

For example, a team using an OpenAI-compatible endpoint can configure its base URL and credential once, add the models actually served there, then choose a model and reasoning level for a task. The merged integration makes API-key entry reachable for custom endpoints and routes custom-model accounts through OpenAI Chat Completions. Every selectable model still needs an inventory entry; a default-model name alone does not register it. Test the selected model, not merely whether a credential field has been filled. [Integration and browser checks][pr]

The wizard keeps a model's advertised reasoning choices separate from its default. A selected default reaches the saved model row and connection-test request. The canonical ladder is `none`, `minimal`, `low`, `medium`, `high`, `xhigh`; an old `max` value loads as `xhigh` and is written canonically on a later save. Provider-specific spellings are handled at the request boundary. Support still depends on the actual model, so displaying the ladder is not evidence that every endpoint accepts every level. [Reasoning rules][profiles]

## Authorize ChatGPT through Genesis

Choose **ChatGPT Subscription** in Welcome or **Settings → LLM → Provider accounts**. The versioned guide gives `genesis chatgpt login`, `genesis chatgpt status` and `genesis chatgpt models` as the sign-in and inspection commands. From a source checkout, the login entry is `mix genesis.chatgpt login`. Open the displayed browser URL and complete authorization for Genesis. [Subscription guide][oauth]

After signing in, use **Check connection**, select the registration and choose from the models available to that account. In Settings, save the account before **Connection Test**; Welcome tests the selected model before finishing setup. The profile retains `provider = "openai_codex"` for compatibility and uses `auth_mode = "oauth"`, with `siwc_account` identifying the Genesis registration.

Existing subscription profiles require reauthorization through Genesis: older credentials imported from Codex are not used by this connection. If a previously selected model is absent from the newly discovered inventory, choose an available one. OpenAI API-key accounts remain a separate option. For multiple registrations, use an explicit account alias such as `genesis chatgpt login --account work`, then select that alias in the profile. [Migration and aliases][oauth]

## Keep the connection on the execution host

The selected account's credentials are resolved and refreshed on the execution node. Credential updates are serialized across the login CLI and the running server. This keeps a browser-visible registration from being mistaken for a connection on a different remote host. [Account store][store]

For self-hosted use, the guide documents forwarding the loopback sign-in port through SSH and running login with the same account and configuration directory as the Genesis service. It also documents a protected credential-transfer path and an optional `GENESIS_SIWC_HTTPS_PROXY` for hosts requiring an HTTP CONNECT proxy. Follow the appropriate host-specific instructions before testing inference; signing in on a laptop alone does not configure an unrelated server.

The PR's ChatGPT refresh and streaming checks used fixtures, and fresh authorization with a real ChatGPT account remained unverified in that review. Treat a successful model response on the intended host as the practical confirmation of your own setup. [Verification scope][pr]

## Make account schedules explicit

The same account model carries peak/off-peak concurrency, timezone and scheduling policy. New presets can prefill supported provider schedules, but their slot counts are editable Genesis defaults, not a guarantee of vendor capacity or savings. All models within an account share its slots; adding a model does not create another quota pool. [Preset implementation][presets]

`off_peak_holidays = "CN"` adds the bundled Chinese calendar to account scheduling, including make-up working days. The calendar is static, covers 2025–2027 and does not update itself. Review timezone, weekend rules and preset assumptions before relying on it. A peak concurrency of zero queues new requests; reducing capacity does not evict work already in flight. [Schedule semantics][profiles]

After moving to a build with these changes, recheck each account's model inventory, default reasoning choice and execution host. For a ChatGPT profile, reauthorize and run its connection test. For a scheduled account, inspect the saved schedule and expected next transition. These checks validate the identities and limits that future tasks will actually use.

## After saving, refresh the model choices

Updates on `main` on November 23, 2026 connect saved ChatGPT registrations to configuration refresh. On the same execution node, a configuration change reloads the project’s model picker; closing the workbench Settings window also requests a reload. Dropped results now produce a retryable error instead of leaving the picker indefinitely loading. Wait for the remote connection to become ready before retrying. [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

An incomplete account no longer forces the scheduler into a crash loop. It logs the unresolved default; complete the account’s model inventory and select a valid model before relying on that default. [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
