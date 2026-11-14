---
title: "Genesis Assistant: Pick up the conversation where it paused"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "Genesis main keeps Assistant conversations in interactive sessions and brings pending approvals into a review dialog with the exact code and target node."
---

A developer may ask Genesis Assistant to inspect a failed task, leave to review the changes, and return with a follow-up. That sequence depends on finding the conversation and keeping enough context to continue it. Changes merged into Genesis `main` on November 10–12, 2026 give Assistant conversations a persistent interactive session during their lifetime and move the conversation list into the dashboard sidebar. [Assistant guide][guide]

![A developer returns to a marked conversation and examines one proposed action](./genesis-assistant-interactive-sessions.webp)

*Editorial illustration of resuming an Assistant conversation and reviewing a proposed action.*

## Return to a waiting conversation

Open **Conversations** beneath **Active Tasks**. The list shows the selected node's live sessions alongside locally cached chats. The status labels distinguish a session waiting for input, one running, and one that has ended. Selecting a conversation opens it at `/assistant?session=<agent_id>`. Older `/help` links redirect to `/assistant` with their query string preserved. [Route change][route]

The session can yield after an exchange. While it waits for input, it releases its execution slot and retains its context and worktree. A follow-up resumes the same agent session with the same prompt-cache identity. **New chat** starts a separate conversation and leaves the previous one in the list. An ended chat can still appear as history. [Session implementation][session]

## Inspect the task before deciding what to change

Consider a failed test task. Ask the Assistant to read its status, error and result on the node you are viewing. Then open the review page, compare the diff with the failure and return through **Conversations** with a narrower question. The existing conversation provides the context for that follow-up. On a local instance, download the Genesis source when prompted so the Assistant can consult its checkout.

If the next step is a retry, ask the Assistant to propose starting a new task using the earlier task as context. The inspection uses the read tier, while starting work uses a write call. The write needs a decision about the specific call on the selected node. [Task inspection and execution tiers][guide]

## Review the proposed write without losing your place

A fixed strip between the transcript and composer shows when requests are pending. **Review** opens a dialog with one request at a time. Check the exact code and execution target, then choose **Allow once** or **Deny**. Requests in the `sudo` tier carry a prominent warning because they run native Elixir under the Genesis server's identity.

The dialog now reads the target node stamped by the runtime and displays any warning attached to the request. When several requests are queued, the review steps through them. A recovered request can be shown while it remains pending. The transcript and composer keep their positions as the strip changes, so reviewing an action need not displace the conversation you were reading. [Approval changes][approval]

## Follow the result back to the task

After a write is accepted, inspect the resulting task and check its status before treating the work as finished. If the response was interrupted or the write timed out, check current state before asking for a second write. To try the interaction on a build containing these changes, start with a read-only task inspection, switch to another dashboard page, and return through **Conversations** for the follow-up. The [previous Assistant overview][related] describes the operator tools this session flow builds on. [Current Assistant guide][guide]

## Keep the final answer when a session ends

November 14 update: changes merged into `main` on November 13 pass a final, authoritative snapshot to Assistant and the selected-agent inspector. Transcript and terminal status are applied together; late task broadcasts cannot reopen the sealed conversation. If the handoff is unavailable, the last coherent cached text remains visible rather than starting a separate history read. An inspector can retain ended-agent details outside the live tree. On a build containing this change, keep a conversation selected through completion and check that its final text and status agree before retrying work. [Terminal handoff implementation][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
