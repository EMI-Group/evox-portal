---
title: "EvoNAS: before searching for a better network, make the comparison count"
pubDate: 2026-11-14
summary: "Sharing weights makes architecture search affordable. EvoNAS tackles the harder question: whether the resulting scores can guide us toward a vision model worth deploying."
---

A network can win during search and disappoint after training. That is a particularly expensive mistake in neural architecture search: every generation uses earlier evaluations to decide what to explore next. If those evaluations rank candidates incorrectly, more search can reinforce the wrong choice.

[EvoNAS](https://github.com/EMI-Group/evonas) puts this problem at the centre of multi-objective search for vision models. Its approach connects how a shared supernet learns, how candidate models are evaluated, and how accuracy is traded against computational cost. The aim is to make an affordable comparison useful enough to guide the next architecture decision.

![Conceptual illustration: different network-shaped frames view the same street scene, with a fine geometric edge highlighted.](./evonas-editorial.webp)

## The shortcut that can change the ranking

Training every candidate independently would give architecture search a formidable bill. A supernet offers a shortcut: many smaller networks inherit weights from one larger network, so each candidate does not have to start learning from scratch.

But sharing weights also couples their learning. The candidate that benefits most from the shared parameters may not be the one that performs best when trained on its own. For evolution, this is more than a noisy score. Selection determines which architectures survive and produce the next generation, so a distorted comparison can change the direction of the entire search.

For dense vision, that comparison also needs to preserve what matters in the image. Recognising a building is different from locating its boundary precisely. In depth estimation or segmentation, a thin railing, a sharp corner or the edge between foreground and background can carry information that a broad semantic representation misses.

## Keep the details when the network gets smaller

The [EvoNAS paper](https://arxiv.org/abs/2603.19563v1) combines Vision State Space modules and Vision Transformers in a searchable VSS–ViT supernet. Progressive Supernet Training (PST) starts with large configurations before extending training to compact variants. This gives smaller candidates a learned starting point as the space of active architectures expands.

Cross-Architecture Dual-Domain Knowledge Distillation (CA-DDKD) addresses the representation itself. It aligns features in both spatial and frequency domains, using discrete cosine transform constraints to help retain fine geometric information. The two views are complementary: where a feature appears matters, and so do the changes that define its edges and texture.

This makes the training strategy part of the search method. Better shared representations give the evolutionary process a more useful basis for comparing candidates; simply increasing the number of candidates would not repair an unreliable ranking.

## A faster evaluation must still be a fair comparison

The other bottleneck is evaluating the population. EvoNAS introduces Distributed Multi-Model Parallel Evaluation (DMMPE), using GPU resource pooling and asynchronous scheduling to process multiple models. Evaluation throughput matters because a search repeatedly returns to this step.

The deployment question remains specific. Imagine a depth estimator that must finish within a frame budget: a slightly more accurate architecture may be unusable if it takes too long. Multi-objective search keeps alternatives along that trade-off, allowing the final choice to follow the application's constraints. A latency comparison only helps when candidates are measured under comparable hardware and runtime conditions.

## Follow the candidate all the way to retraining

The [repository workflow](https://github.com/EMI-Group/evonas/blob/e4f6866e8092545b2b9b28f3fe0162e038e34f3c/README.md) runs from ImageNet-1k supernet pretraining through task-specific PST fine-tuning and evolutionary search to subnet retraining. It includes depth estimation on KITTI and NYU Depth v2, detection on COCO, and segmentation on ADE20K.

For a first experiment, follow one task through that complete path. The search configuration defines what counts as promising; retraining reveals what the chosen architecture delivers after learning. Comparing those two stages is directly relevant to the ranking problem that motivates EvoNAS.

The README currently lists the required pretrained supernet download as forthcoming. Before starting, check its availability and match the Mamba SSM wheel to the documented Python, CUDA and PyTorch environment.

Within the [EvoX ecosystem](/libs), EvoNAS makes a useful research question concrete: how do we spend the search budget on comparisons that lead to better decisions? The [code](https://github.com/EMI-Group/evonas) and [paper](https://arxiv.org/abs/2603.19563v1) offer a route into that question, from shared features to the model ultimately selected for deployment.
