---
title: "Genesis adds an opt-in search path without an API key"
pubDate: 2026-11-22
summary: "The Keenable adapter enables public web search explicitly, while preserving keyed access and the existing default provider."
---

Trying an Agent research task can stall before the first query if web search needs a separate credential. Genesis PR #174, merged into `main` on November 19, 2026, adds **Keenable** as an opt-in provider whose public endpoint works without a configured API key. Existing installations keep their current default behavior. [Merged search adapter][pr]

![An open library doorway leads to a small selection of referenced documents](./cover.webp)

*Concept illustration: an optional public route into web research.*

## Enable the public route explicitly

Set `[tools.search]` to `enabled = true` and `provider = "keenable"`. Without a key, the adapter posts the query and result limit to the public endpoint, includes `X-Keenable-Title: Genesis`, and omits `X-API-Key`. Adding `KEENABLE_API_KEY` in the credential store selects keyed access instead. [Request construction][adapter]

The implementation changes both gates needed for this to work: the selected keyless-capable provider can enable the Agent's search tool, and execution no longer rejects that provider solely because a key is absent. Providers that require credentials retain their existing checks.

## Read the results with their limits

For a task gathering documentation references, this removes one setup step before asking the Agent to search. The adapter maps result titles, URLs and `snippet` text into the existing search-result format. It honors `max_results`; Keenable has no equivalent for the adapter's `search_depth` option, so that option is ignored. [Response mapping][adapter]

The public route is rate-limited per IP. The PR records request-builder, parsing and tool-enablement tests, including a mocked execution seam; it does not report a live Keenable API run. After enabling the provider, try one small query from the actual execution host and inspect returned source links and any service error before relying on it for a larger research task. [Recorded checks][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
