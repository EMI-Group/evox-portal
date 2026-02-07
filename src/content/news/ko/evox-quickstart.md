---
title: "EvoX 빠른 시작: 단 10분 만에 GPU 가속 진화 연산 실행"
pubDate: 2025-04-30
summary: "초보자를 위한 튜토리얼로, EvoX를 사용하여 단 10분 만에 GPU 가속 진화 연산을 시작할 수 있습니다."
---

한편으로, 진화 연산은 실제 연구와 엔지니어링에서 매우 강력하지만 사용하기 어렵습니다. 다른 한편으로, GPU의 성능은 점점 더 강력해지고 있지만, 진화 연산 작업에서 그 능력을 발휘하기 어렵습니다.

우리에게는 진정으로 현대적인 솔루션이 필요합니다: 네이티브 GPU 지원, 모듈형 아키텍처, 명확한 인터페이스, 즉시 사용 가능한 편의성, 그리고 커스터마이즈 가능한 확장성. 이것이 바로 EvoX -- 미래를 위한 진화 연산 엔진입니다.

사용자가 빠르게 시작할 수 있도록, EvoX 팀은 "EvoX 초보자 튜토리얼"을 출시했습니다. 이 튜토리얼은 8개의 장으로 구성되어 있으며, 기초부터 고급 실용 응용까지 모든 내용을 다루며, GPU에서 진화 알고리즘을 실행하는 방법을 단계별로 안내합니다.

**전체 튜토리얼 리소스**

중국어 온라인 튜토리얼:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

중국어 PDF 튜토리얼:

QQ 그룹에 가입하여 받으실 수 있습니다: 297969717

다음으로, 단 10분 만에 설치부터 실행까지의 전체 과정을 안내해 드리겠습니다.

**1단계: 환경 설정**

터미널을 열고 깨끗한 Python 환경을 생성합니다:

![代码片段1.png](/images/articles/quickstart-1.png)

선호하는 도구를 사용하여 깨끗한 Python 환경을 생성할 수도 있습니다.

**2단계: PyTorch 및 EvoX 설치**

![代码片段2.png](/images/articles/quickstart-2.png)

GPU가 사용 가능한지 확인합니다:

![代码片段3.png](/images/articles/quickstart-3.png)

**3단계: 첫 번째 진화 알고리즘 실행**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

이것은 무엇을 하는 것일까요? 표준 인터페이스를 통해 알고리즘(PSO), 문제(Ackley), 모니터(EvalMonitor)를 구성합니다. EvoX가 모든 병렬 처리, 가속, 모니터링을 처리합니다!

**4단계: 수렴 곡선 그리기**

한 줄이면 충분합니다:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

저 하강하는 곡선이 보이시나요? 그것은 **진화 알고리즘이 목표에 접근하는 궤적**이며, **미지의 세계를 탐험하는 경로**입니다.

**5단계: 확장 시도**

"Ackley만 실행하는 것"으로 만족하지 못한다면, 다음을 시도할 수 있습니다:

· PSO를 GA, DE, CMA-ES, NSGA-II, RVEA 등으로 교체
 · Ackley를 Rastrigin, Griewank, CEC2022로 교체
 · n_objs >= 2로 설정하여 다목적 문제로 전환
 · MyProblem과 MyAlgorithm으로 자체 로직 구현
 · PyTorch 모델이나 강화학습 환경(Gym, Brax, MuJoCo Playground)에 연결

하이퍼파라미터 튜닝, 아키텍처 탐색, 신경진화, 제어 전략 최적화 등 무엇이든 EvoX가 쉽게 처리합니다.

**왜 EvoX를 선택해야 할까요?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**감사의 말**

이 튜토리얼은 **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng**, **Xinyao Li**가 작성했습니다. **Beichen Huang**이 튜토리얼의 정리, 편집 및 온라인 공개를 담당했습니다.

EvoX 커뮤니티의 모든 구성원에게 진심으로 감사드립니다. 우리의 공동 노력이 EvoX가 계속 진화할 수 있게 해주었습니다.

**오픈소스 코드 / 커뮤니티 리소스**

논문:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

상위 프로젝트 (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 그룹: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

QQ 그룹 | Evolving Machine Intelligence

EvoMO는 EvoX 프레임워크를 기반으로 구축되었습니다. EvoX에 대해 더 알고 싶으시다면, WeChat 공식 계정에 게시된 EvoX 1.0에 관한 공식 기사를 확인해 주십시오.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
