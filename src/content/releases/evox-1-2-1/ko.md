---
title: "EvoX v1.2.1 릴리스 노트"
pubDate: 2025-05-13
summary: "새로운 벤치마크 함수(Ellipsoid, Griewank) 추가 및 버그 수정을 통한 안정성 개선."
---

이번 릴리스는 안정성 향상과 버그 수정에 중점을 둔 마이너 릴리스이며, 몇 가지 편의성 개선이 포함되어 있습니다.

**새로운 기능**

새로운 벤치마크 함수: 단일 목적 수치 함수인 `Ellipsoid`와 `Griewank`가 추가되었습니다.

**버그 수정**

* `StdWorkflow`가 다른 알고리즘을 상속받은 알고리즘과 함께 작동하지 않던 문제를 수정했습니다.

* `latin_hypercube_sampling_standard` 함수의 버그를 수정했습니다.

* `torch.compile` 환경에서 `non_dominate`가 실패하던 문제를 해결했습니다.

* 특정 상황에서 `PSO`가 기본 디바이스(default device)를 올바르게 사용하지 않던 문제를 수정했습니다.

**리팩토링 및 유지보수**

* 편의를 위해 자주 사용되는 유틸리티를 최상위 레벨로 재내보내기(re-export) 했습니다. 예:

* `evox.core.compile` 대신 `evox.compile`

* `evox.core.vmap` 대신 `evox.vmap`.

* 더 이상 사용되지 않거나(deprecated) 중복된 코드를 제거했습니다.

전체 변경 로그: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**오픈 소스 코드 / 커뮤니티 리소스**

논문:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

업스트림 프로젝트 (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 그룹: 297969717

![图片11.png](./evox-1-2-1-1.png)

QQ 그룹 | Evolving Machine Intelligence