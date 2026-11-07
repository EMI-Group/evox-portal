---
title: "Genesis Tools and Skills: Bringing Project Methods into Development"
pubDate: 2026-09-26
summary: "Custom tools in Genesis 0.13.1 and worktree-aware skill changes in 0.13.4 make project-specific operations and reusable guidance part of the development workflow."
---

Projects carry more than source code: they also have ways to build, check and change it. Genesis 0.13.4, released on September 26, 2026, makes skill-tool changes worktree-aware and reviewable in Git. Combined with custom tools introduced in 0.13.1 on September 21, this provides two distinct ways to bring project methods into agent-assisted development.

## Expose operations through custom tools

Version 0.13.1 loads user-defined tools from the tools directory in the configuration folder. They appear in the custom-tools settings panel, can be included in custom-agent tool whitelists and are routed through the central dispatcher. A project can therefore supply an explicit operation instead of relying only on a general shell interface.

For example, a team could wrap its existing project checker with a defined input and output contract. That is a possible use of the extension point, not a bundled integration. The implementation of such a tool, its permissions and the meaning of its results still belong to the project.

## Keep skill changes where code is reviewed

Version 0.13.4 changes skill tools to read and write within the agent's worktree and supports committing those changes, with an optional commit flag. Agent-authored guidance can thus appear on the agent's branch for inspection. The release also corrects skill discovery and removal behavior.

Tools expose callable operations; skills carry reusable guidance. Their roles complement each other but should not be confused. Putting a skill change in Git makes it visible and versioned; it does not automatically establish that the guidance is correct or useful.

## Extend capability without losing review

These changes give users concrete extension points while keeping the review of generated methods close to the review of generated code. In EvoX's software-development ecosystem, the work being improved can include both implementation and the instructions used to develop it. Acceptance and validation remain the steps that turn proposed changes into a dependable basis for future work.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
