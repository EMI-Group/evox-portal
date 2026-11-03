---
title: "EvoX v1.4.1 Release Note"
pubDate: 2026-10-30
summary: "A maintenance release correcting CMA-ES, DE variants, PSO, evolution strategies, tournament selection, and hypervolume calculation."
---

**EvoX v1.4.1** fixes algorithm correctness and runtime issues in the stable 1.x series.

## Algorithm fixes

- **CMA-ES:** Corrected the rank-one covariance update and cumulation constant `c_c`; fixed a crash in `torch.cond` and re-enabled the test ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **DE variants:** Changed `DE_binary_crossover` sampling from a normal to a uniform distribution. Fixed SHADE's adaptation of `F` and `CR`, and ensured DE-variant initial populations are sampled within bounds ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO:** Fixed bound device transfer ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **Evolution strategies:** Fixed ASEBO when its gradient subspace activates, default `pop_size` issues in XNES/SeparableNES, and Guided ES subspace crashes ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## Operators and metrics

- Fixed tournament selection crashes with `n_round=1` ([#259](https://github.com/EMI-Group/evox/pull/259)).
- Hypervolume (`hv`) now ignores points that do not dominate the reference point ([#254](https://github.com/EMI-Group/evox/pull/254)).

Thanks to @bbopen, @raashish1601, @Arthur031221, and @flyingdoubleG for their first contributions.

**Release**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **Full changelog**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
