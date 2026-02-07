---
title: "EvoX 1.1 Release: Now with torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduces full torch.compile (TorchDynamo) integration, replacing TorchScript for better compatibility and performance."
---

We are excited to announce the release of **EvoX 1.1**, introducing **full integration of torch.compile (TorchDynamo)** as the backend compiler! This update replaces the previous TorchScript approach, making EvoX **more user-friendly and highly compatible with the broader Python ecosystem**.

By leveraging **torch.compile**, EvoX now captures computation graphs dynamically at runtime, eliminating the need for manual tracing while optimizing performance automatically.

**What's New?**

**torch.compile: Smarter, More Flexible Compilation**

In EvoX 1.1, we fully adopt **torch.compile** as the new compilation backend. Unlike the previous tracing-based approach, torch.compile--which **internally uses TorchDynamo**--intercepts Python execution, dynamically extracts computation graphs, and optimizes them in real time.

This means:

l  **No more manual tracing** -- Just call **torch.compile(workflow.step)**, and EvoX takes care of the rest.

l  **Seamless Python compatibility** -- Works with native Python functions and external libraries like NumPy and SciPy.

l  **Better performance** -- Optimized computation graphs result in **faster execution and better hardware utilization**.

l  **Future-proof design** -- Aligns with PyTorch's roadmap, ensuring long-term compatibility and performance improvements.

**Why Move from TorchScript to torch.compile?**

In earlier versions, EvoX relied on **tracing-based methods**:

l  **Pre-1.0.0** used **JAX tracing** for computation graph extraction.

l  **v1.0.0** switched to **TorchScript**, enhancing PyTorch integration.

However, these methods had several drawbacks:

l  **Complex to use** -- Users had to manually trace graphs and handle intricate debugging.

l  **Limited compatibility** -- Struggled with dynamic workflows and non-PyTorch functions.

l  **Restricted flexibility** -- Loops, conditionals, and other Python constructs were not always correctly captured.

With torch.compile and **TorchDynamo**, **these issues are gone**. EvoX now optimizes dynamically, supporting a broader range of workflows with **zero extra effort from users**.

**How EvoX 1.1 Makes Your Life Easier**

l  **No more hassle with tracing** -- Everything happens behind the scenes, making your code cleaner and easier to maintain.

l  **Works with your existing Python code** -- No need to modify your workflow for compatibility.

l  **Faster execution, better scaling** -- Benefit from PyTorch's latest optimizations for GPUs and TPUs.

l  **Future-ready** -- Stay aligned with PyTorch's long-term evolution, ensuring continuous performance gains.

**Upgrade to EvoX 1.1 Now!**

EvoX 1.1 is now officially available! Upgrade today to experience a **smarter, faster, and more intuitive** computational workflow.

**Get EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Have questions or feedback? Open an issue on GitHub or join our community discussion. Let's push the boundaries of **computational intelligence together!**

**Source code / Community / Documentation**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentation: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ Group: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
