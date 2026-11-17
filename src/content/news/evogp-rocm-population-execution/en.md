---
title: "EvoGP: Keep Population Reporting in Tensor Operations"
pubDate: 2026-10-16
updatedDate: 2026-11-17
summary: "A focused correction replaces Python-level fitness extrema with torch reductions in the standard genetic-programming pipeline."
---

Progress reporting should not become the expensive part of a search generation. EvoGP's [October 16, 2026 merge][s1] replaces Python-level maximum and minimum over a fitness tensor with tensor reductions. The correction targets reporting overhead in the standard pipeline while retaining the intended extrema.

![A measuring bridge spans many program trees to identify population extremes together](./reporting-reduction.webp)

*Concept illustration: compute population extrema collectively rather than handling candidates one at a time.*

## Keep population statistics in tensor operations

The reporting change replaces Python's built-in maximum and minimum over the fitness tensor with `torch.max` and `torch.min`. Iterating a large device tensor through Python creates work at the language boundary that a tensor reduction can handle within the numerical framework. This becomes especially relevant when the fitness function itself is inexpensive.

For symbolic regression with a large population, evaluating candidate expressions may be highly parallel while printing each generation's extrema remains unexpectedly costly. The correction removes that mismatch without changing the intended statistic. The pull request reports a large improvement in its million-individual example, but does not provide a complete benchmark protocol; the actionable lesson is to profile the whole generation, including reporting.

For an existing experiment, compare complete generation time with reporting enabled and disabled while keeping inputs, seed and population fixed. Confirm that the reported extrema match the fitness tensor before increasing the workload. The [EvoGP overview][related] explains tensorized program trees; the independent [AMD ROCm update][rocm] covers hardware access and extension builds. Neither a faster reduction nor a supported backend alone establishes the performance of the full search.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[related]: /news/evogp
[rocm]: /news/evogp-amd-rocm
