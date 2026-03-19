---
title: "EvoX v1.1.1 릴리스 노트"
pubDate: 2025-03-16
summary: "torch.compile 그래프 캡처, use_state 그래프 중단(break), BatchedTensor 누수(leak)에 대한 버그 수정."
---

**변경 사항**

**이번 마이너 릴리스는 주로 버그 수정 및 개선 사항을 포함합니다:**

- `torch.compile`이 `workflow.step`을 올바르게 캡처하지 못하는 문제를 수정했습니다.

- `use_state`로 인해 그래프 중단(graph break)이 발생하는 문제를 수정했습니다.

- 일부 잘못된 모델 버퍼 사용을 수정했습니다.

- `monitor.plot`이 의도한 대로 작동하지 않는 문제를 수정했습니다.

- `torch.compile` 및 `torch.vmap`의 특정 제한 사항을 우회하기 위해 새로운 래퍼인 `evox.compile`을 도입했습니다.

- 다양한 `BatchedTensor` 관련 문제를 해결했습니다: `EvalMonitor`가 있는 워크플로우에 vmap을 적용할 때 `BatchedTensor` 누수가 발생하는 버그를 수정했습니다.

- `HPOProblem`이 `BraxProblem`과 함께 작동하지 않는 문제를 수정했습니다.

- 성능과 신뢰성을 높이기 위해 `RVEA`와 `CSO`의 구현을 개선했습니다.

- `BraxProblem`의 구현을 개선했습니다.

- 기타 다양한 수정 및 개선 사항.

**오픈 소스 코드 및 커뮤니티**

**논문**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**업스트림 프로젝트 (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ 그룹**: 297969717

![image.png](./evox-1-1-1-1.png)

  QQ 그룹 | Evolving Machine Intelligence