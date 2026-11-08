---
title: "EvoX Genesis: Building Software That Can Keep Evolving"
pubDate: 2026-08-17
updatedDate: 2026-11-08
summary: "Genesis extends EvoX's evolutionary AI direction to software: agents generate changes, validation selects accepted work, and the project carries progress forward."
---

Genesis brings the EvoX vision into Agentic AI by treating an evolving software project as the persistent result of many local contributions. Code generation, execution, review and integration form a development cycle. Accepted implementations and their validation records provide the material from which subsequent work can continue. [Genesis](https://github.com/EMI-Group/genesis)

![A layered software tower with a continuous red staircase](./software-world-continuity.webp)

![image1.png](./evox-genesis-1.png)

The EvoX team from the Department of Data Science and Artificial Intelligence at The Hong Kong Polytechnic University has released **EvoX Genesis**, a recursive AI system for long-horizon autonomous software evolution.

EvoX Genesis no longer relies on a persistent agent to sustain long-horizon development. Instead, it lets the software world itself keep evolving.

Starting from an empty repository, the system built a **248,989-line C compiler** in 123.4 hours, across 1,019 agent episodes, with a model token cost of just **$44.38**.

## Long-Horizon Coding: The Boundary Keeps Moving

The working time of coding agents has grown from single short tasks to tens of hours.

OpenAI ran Codex from an empty repository for about 25 hours straight, producing roughly 30K lines of code.

Anthropic used 16 Claude agents, through nearly 2,000 sessions, about two weeks, and nearly $20,000 in API costs, to build a roughly 100K-line C compiler from scratch.

Time keeps getting longer, agents keep getting more numerous, and software keeps getting more complex.

But the center of research remains the agent:

stronger models, longer contexts, more persistent memory, more agents.

**The EvoX team turned the question in a different direction:**

**Why must the agent persist?**

What if what truly needs to persist is the software world it lives in?

## 123.4 Hours, 250K Lines

We let EvoX Genesis start from a repository with an empty implementation.

There was only one goal: build a C compiler.

123.4 hours, 1,019 agent episodes, **248,989 lines of code**, and a model token cost of just **$44.38**.

The final compiler passed 220/220 c-testsuite tests, 32/36 LLVM test cases, and 93/93 Csmith randomized program tests.

No existing compiler was waiting there to be completed — **it started from zero.**

![image2.png](./evox-genesis-2.png)

_Figure 1: C compiler experiment results / code size, running time, agent episodes, cost, and test results_

_(using the DeepSeek V4 Flash model)_

## Don't Keep the Agent Alive — Keep the Software World Alive

The life of complex software is naturally longer than a single agent session.

EvoX Genesis organizes software into a recursively unfolding software world:

upper-level agents decompose goals, and new agents complete the work in local positions;

once the results are verified, they enter the software's version history and become the reality for the next round of development.

Then the agents can disappear,

and new agents continue from the software world that has already taken shape.

What persists is not some conversation, not an ever-growing scratchpad, and not an always-online "master agent."

What persists is the code, the structure, the constraints, the verification results, and the history that has already happened.

**What persists is not the agent, but the software world.**

**Agent does not persist. Its validated consequences do.**

This is how EvoX Genesis sustains long-horizon autonomous software evolution. For users, it also means one very simple thing:

**You don't build agents — you only describe what you want the software to become.**

There is no need to pre-design agents, roles, or workflows, nor to manually decompose a complete task tree.

The user only needs to describe the software development goal in a short piece of text;

how tasks are decomposed, how agents are generated, how recursion unfolds, and how results are verified — all of this is done by EvoX Genesis itself.

![image3.png](./evox-genesis-3.png)

_Figure 2: The Persistent Recursive World concept / agents are born, act, and disappear; the software world keeps unfolding_

## Models Can Be Swapped; the Software World Continues

This continuity does not even require using the same model throughout.

In another set of experiments, a software world initially built by GLM 5.2 was handed over to DeepSeek V4 Flash to continue developing.

In the end, it passed 1,820/1,820 of the retained LLVM SingleSource tests.

Models can be replaced, agents can be replaced — the software world continues.

![image4.png](./evox-genesis-4.png)

_Figure 3: The cross-model continuation experiment, GLM 5.2 → DeepSeek V4 Flash_

## From Scratch, or Inheriting History

Building from zero is only one end of a software lifecycle;

the other end is a software world that has existed for years, rich in structure and history.

We applied EvoX Genesis to MESA — a long-developed scientific computing system for stellar evolution.

The experiment involved 13 Fortran modules, totaling **139,414 lines**;

EvoX Genesis refactored them into corresponding Rust crates, with a model token cost of about **$10.6**.

A software world can be created from nothing, or it can inherit history and keep changing.

![image5.png](./evox-genesis-5.png)

_Figure 4: MESA Fortran → Rust, 13 modules, 139,414 lines of code, $10.6_

## Cost Advantages Compound Over Time

In EvoX Genesis, verified code, structure, and development history keep accumulating and become the foundation for the next round of work. Subsequent agents do not need to re-understand the entire project from scratch; much of the existing information can be directly cached and reused, with a cache hit rate of up to 97.4%.

## EvoX Genesis Is Now Open Source

The project is open source, with installation packages available for Windows, macOS, and Linux.

🌐 Website:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Downloads**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Paper:**

**https://arxiv.org/abs/2608.10450**

🌐 QQ group: 297969717

![image7.png](./evox-genesis-7.png)

**Agents leave; the software world keeps evolving**

**EvoX Genesis**

References:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).

Start a continuation from an accepted revision, with its build commands and regression tests. Review the next contribution against that baseline before integrating it. [Genesis: Keeping Agent Contributions in Software History](/news/genesis-development-history)
