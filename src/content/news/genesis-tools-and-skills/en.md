---
title: "Genesis Tools and Skills: Bringing Project Methods into Development"
pubDate: 2026-09-26
summary: "Custom tools in Genesis 0.13.1 and worktree-aware skill changes in 0.13.4 make project-specific operations and reusable guidance part of the development workflow."
updatedDate: 2026-11-08
---

Projects carry more than source code: they also have ways to build, check and change it. Genesis 0.13.4, released on September 26, 2026, makes skill-tool changes worktree-aware and reviewable in Git. Combined with custom tools introduced in 0.13.1 on September 21, this provides two distinct ways to bring project methods into agent-assisted development.

![Project tools beside reusable instruction cards](./project-tools-guidance.webp)

## Expose operations through custom tools

Version 0.13.1 loads user-defined tools from the tools directory in the configuration folder. They appear in the custom-tools settings panel, can be included in custom-agent tool whitelists and are routed through the central dispatcher. A project can therefore supply an explicit operation instead of relying only on a general shell interface. [v0.13.1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1)

For example, a team could wrap its existing project checker with a defined input and output contract.

Version 0.13.4 also allows tool results to combine text with images or audio, so a project operation can return an artifact that the agent can inspect alongside its textual report. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Keep skill changes where code is reviewed

Version 0.13.4 changes skill tools to read and write within the agent's worktree and supports committing those changes, with an optional commit flag. Agent-authored guidance can thus appear on the agent's branch for inspection. The release also corrects skill discovery and removal behavior. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

Tools define what an agent can call; skills explain when to call it and how to use the result. A project checker and its interpretation guide make a useful pair: an executable operation alongside reviewable instructions.

## Try one project operation first

Start with one repeatable project check. Define its inputs, outputs and permissions as a custom tool, then write a skill explaining when it belongs in the workflow. Review the skill diff on the agent branch and exercise the tool before reuse. The [development-history view](/news/genesis-development-history) helps follow later revisions.
