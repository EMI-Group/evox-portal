---
title: "EvoX v1.2.0 릴리스 노트"
pubDate: 2025-04-23
summary: "final_step(), Mujoco Playground 환경, 사용자 튜토리얼 및 EvoMO 통합을 포함한 새로운 기능."
---

**새로운 기능, 개선 사항 및 중요한 버그 수정으로 가득 찬 "EvoX v1.2.0"의 릴리스를 발표하게 되어 기쁩니다!**

**이번 업데이트는 주요 모듈 전반에 걸쳐 프레임워크의 유연성과 성능을 향상시킵니다**.

**하이라이트:**

-  더 원활한 실행 워크플로우를 위해 `final_step()`을 추가하고 `hpo_wrapper` 및 `std_workflow`를 업데이트했습니다.

-  강화 학습 실험을 위한 새로운 환경인 "Mujoco Playground"를 도입했습니다.

-  사용자가 빠르게 적응할 수 있도록 돕는 새로운 [튜토리얼](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")을 공개했습니다.

-  [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/")와 같은 자매 프로젝트와의 더 나은 통합을 가능하게 하는 새로운 EvoX 확장 기능을 추가했습니다.

-  더 나은 안정성과 명확성을 위해 다양한 버그 수정 및 문서 업데이트가 이루어졌습니다.

**관련 Pull Requests:**

- MOEA에 대한 Docstring 업데이트 -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py`의 `vmap` 수정 -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  RVEAa 추가 및 DTLZ, IGD, RVEA 지원 개선 -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- 워크플로우 모듈의 `final_step()` 업데이트 -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground 환경 -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  문서 개선 -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playground 버그 수정 -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  새로운 사용자 튜토리얼 -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**전체 변경 로그**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**오픈 소스 코드 / 커뮤니티 리소스**

논문:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

업스트림 프로젝트 (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 그룹: 297969717

![图片11.png](./evox-1-2-0-1.png)

QQ 그룹 | Evolving Machine Intelligence