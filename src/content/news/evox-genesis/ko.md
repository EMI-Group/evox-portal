---
title: "EvoX Genesis: 장기 자율 소프트웨어 진화를 위한 재귀적 AI 시스템, 25만 줄 C 컴파일러를 처음부터 구축"
pubDate: 2026-08-17
summary: "홍콩이공대학교 데이터과학 및 인공지능학과의 EvoX 팀이 장기 자율 소프트웨어 진화를 위한 재귀적 AI 시스템인 EvoX Genesis를 공개했습니다. 지속적으로 존재하는 agent에 의존해 장기 개발을 유지하는 대신, 소프트웨어 세계 자체가 계속 진화하도록 합니다. 빈 저장소에서 출발하여 시스템은 123.4시간 만에 248,989줄짜리 C 컴파일러를 구축했으며, 총 모델 token 비용은 단 44.38달러였습니다."
---

# EvoX Genesis: 장기 자율 소프트웨어 진화를 위한 재귀적 AI 시스템, 25만 줄 C 컴파일러를 처음부터 구축

![image1.png](./evox-genesis-1.png)

홍콩이공대학교 데이터과학 및 인공지능학과의 EvoX 팀이 장기 자율 소프트웨어 진화를 위한 재귀적 AI 시스템인 **EvoX Genesis**를 공개했습니다.

EvoX Genesis는 장기 개발을 유지하기 위해 지속적으로 존재하는 agent에 의존하지 않습니다. 대신, 소프트웨어 세계 자체가 계속 진화하도록 합니다.

빈 저장소에서 출발하여 시스템은 1,019개의 agent 에피소드를 거쳐 123.4시간 만에 **248,989줄의 C 컴파일러**를 구축했으며, 모델 token 비용은 단 **44.38달러**였습니다.

<center>

## 롱호라이즌 코딩: 경계는 계속 움직인다

</center>

코딩 agent의 작업 시간은 한 번의 짧은 작업에서 수십 시간으로 확장되었습니다.

OpenAI는 Codex를 빈 저장소에서 약 25시간 연속으로 실행하여 약 3만 줄의 코드를 생성했습니다.

Anthropic은 16개의 Claude agent를 사용해 약 2,000개 세션, 약 2주, 약 2만 달러의 API 비용으로 약 10만 줄의 C 컴파일러를 처음부터 구축했습니다.

시간은 점점 길어지고, agent는 점점 많아지며, 소프트웨어는 점점 복잡해지고 있습니다.

하지만 연구의 중심은 여전히 agent입니다:

더 강력한 모델, 더 긴 컨텍스트, 더 지속적인 메모리, 더 많은 agent.

**EvoX 팀은 질문의 방향을 바꿨습니다:**

**왜 agent는 계속 존재해야 하는가?**

정말로 지속되어야 하는 것은, agent가 살고 있는 소프트웨어 세계가 아닐까?

<center>

## 123.4시간, 25만 줄

</center>

우리는 EvoX Genesis가 구현이 비어 있는 저장소에서 시작하게 했습니다.

목표는 하나뿐이었습니다: C 컴파일러 구축.

123.4시간, 1,019개의 agent 에피소드, **248,989줄의 코드**, 그리고 모델 token 비용은 단 **44.38달러**였습니다.

최종 컴파일러는 c-testsuite 220/220, LLVM 테스트 케이스 32/36, Csmith 랜덤 프로그램 테스트 93/93을 통과했습니다.

거기에는 보완되기를 기다리는 기존 컴파일러가 없었습니다. **완전히 처음부터 시작했습니다.**

![image2.png](./evox-genesis-2.png)

<center>

_그림 1: C 컴파일러 실험 결과 / 코드 규모, 실행 시간, agent 에피소드, 비용 및 테스트 결과_

</center>

<center>

_(DeepSeek V4 Flash 모델 사용)_

</center>

<center>

## agent를 지속시키지 말고, 소프트웨어 세계를 지속시켜라

</center>

복잡한 소프트웨어의 수명은 단일 agent 세션보다 본질적으로 깁니다.

EvoX Genesis는 소프트웨어를 재귀적으로 전개되는 소프트웨어 세계로 조직합니다:

상위 agent가 목표를 분해하고, 새로운 agent가 각자의 국소적 위치에서 작업을 완수합니다;

결과가 검증되면 소프트웨어의 버전 역사에 들어가, 다음 개발 라운드의 현실이 됩니다.

그리고 agent는 사라져도 되고,

새로운 agent는 이미 형성된 소프트웨어 세계에서 이어받아 나아갑니다.

지속되는 것은 어떤 대화도, 끝없이 길어지는 스크래치패드도, 항상 온라인 상태인 '마스터 agent'도 아닙니다.

지속되는 것은 코드, 구조, 제약, 검증 결과, 그리고 이미 일어난 역사입니다.

**지속되는 것은 agent가 아니라 소프트웨어 세계입니다.**

**Agent does not persist. Its validated consequences do.**

이것이 EvoX Genesis가 장기 자율 소프트웨어 진화를 지속시키는 방식입니다. 사용자에게 이는 매우 단순한 한 가지를 의미합니다:

**agent를 구축할 필요가 없습니다 — 소프트웨어가 무엇이 되기를 원하는지만 기술하면 됩니다.**

agent, 역할, 워크플로를 미리 설계할 필요도, 완전한 작업 트리를 수동으로 분해할 필요도 없습니다.

사용자는 소프트웨어 개발 목표를 짧은 글로 기술하기만 하면 되고,

작업을 어떻게 분해할지, agent를 어떻게 생성할지, 재귀를 어떻게 전개할지, 결과를 어떻게 검증할지는 모두 EvoX Genesis가 스스로 처리합니다.

![image3.png](./evox-genesis-3.png)

<center>

_그림 2: Persistent Recursive World 개념도 / agent는 태어나고, 행동하고, 사라진다; 소프트웨어 세계는 계속 전개된다_

</center>

<center>

## 모델은 바꿀 수 있고, 소프트웨어 세계는 계속된다

</center>

이러한 연속성은 같은 모델을 끝까지 사용할 것도 요구하지 않습니다.

다른 실험에서는 GLM 5.2가 구축을 시작한 소프트웨어 세계를 DeepSeek V4 Flash에 넘겨 개발을 계속하게 했습니다.

최종적으로 유지된 LLVM SingleSource 테스트의 1,820/1,820을 통과했습니다.

모델은 교체될 수 있고, agent도 교체될 수 있습니다 — 소프트웨어 세계는 계속됩니다.

![image4.png](./evox-genesis-4.png)

<center>

_그림 3: GLM 5.2 → DeepSeek V4 Flash 교차 모델 연속 실험_

</center>

<center>

## 처음부터, 혹은 역사를 이어받아

</center>

제로부터 구축하는 것은 소프트웨어 라이프사이클의 한쪽 끝일 뿐이고,

다른 쪽 끝은 수년간 존재해 온, 구조와 역사가 풍부한 소프트웨어 세계입니다.

우리는 EvoX Genesis를 MESA — 오랫동안 개발되어 온 항성 진화 과학 계산 시스템 — 에 적용했습니다.

실험은 13개의 Fortran 모듈, 총 **139,414줄**을 대상으로 했으며,

EvoX Genesis는 이를 대응하는 Rust crates로 리팩터링했습니다. 모델 token 비용은 약 **10.6달러**였습니다.

소프트웨어 세계는 무에서 창조될 수도 있고, 역사를 이어받아 계속 변할 수도 있습니다.

![image5.png](./evox-genesis-5.png)

<center>

_그림 4: MESA Fortran → Rust, 13개 모듈, 139,414줄 코드, 10.6달러_

</center>

<center>

## 비용 우위도 시간이 지나면 복리로 쌓인다

</center>

장기 소프트웨어 개발이 비용이 선형적으로 계속 증가한다는 뜻은 아닙니다.

EvoX Genesis에서는 검증된 코드, 구조, 개발 역사가 계속 축적되어 다음 작업의 기반이 됩니다. 후속 agent는 전체 프로젝트를 처음부터 다시 이해할 필요가 없고, 기존 정보의 상당 부분은 그대로 캐시하여 재사용할 수 있으며, 캐시 적중률은 최대 97.4%에 달합니다.

시스템이 계속 실행될수록 재사용 가능한 개발 상태는 풍부해지고, 중복 계산은 줄어들며, 개발의 단위 비용은 오히려 시간이 지날수록 점차 내려갑니다.

이것은 시간이 지날수록 쌓이는 엔지니어링 복리입니다.

<center>

## EvoX Genesis가 오픈소스로 공개되었습니다

</center>

프로젝트는 오픈소스로 공개되었으며, Windows, macOS, Linux용 설치 패키지를 제공합니다.

🌐 공식 웹사이트:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **다운로드**:

**https://github.com/EMI-Group/genesis/releases**

**▤ 논문:**

**https://arxiv.org/abs/2608.10450**

🌐 QQ 그룹: 297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

<center>

**agent는 떠나도, 소프트웨어 세계는 계속 진화합니다**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>QQ 그룹｜</strong>Evolutionary Machine Intelligence</center>

참고:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
