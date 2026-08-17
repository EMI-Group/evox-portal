---
title: "EvoX Genesis: 25만 줄 C 컴파일러를 처음부터 구축한 재귀적 진화형 AI 시스템"
pubDate: 2026-08-17
summary: "홍콩이공대학교 데이터과학 및 인공지능학과의 EvoX 팀이 재귀적 진화형 AI 시스템인 EvoX Genesis를 공개했습니다. 지속적으로 존재하는 agent에 의존해 장기 개발을 유지하는 대신, 소프트웨어 세계 자체가 계속 진화하도록 합니다. 빈 저장소에서 출발하여 시스템은 123.4시간 만에 248,989줄짜리 C 컴파일러를 구축했으며, 총 모델 token 비용은 단 44.38달러였습니다."
---

# EvoX Genesis: 25만 줄 C 컴파일러를 처음부터 구축한 재귀적 진화형 AI 시스템

![image1.png](./evox-genesis-1.png)

홍콩이공대학교 데이터과학 및 인공지능학과의 EvoX 팀이 재귀적 진화형 AI 시스템인 **EvoX Genesis**를 공개했습니다.

EvoX Genesis는 더 이상 지속적으로 존재하는 agent에 의존해 장기 개발을 유지하지 않습니다. 대신, 소프트웨어 세계 자체가 계속 진화하도록 합니다.

빈 저장소에서 출발한 이 시스템은 123.4시간 동안 1,019개의 agent episode에 걸쳐 **248,989줄짜리 C 컴파일러**를 구축했으며, 모델 token 비용은 단 **44.38달러**였습니다.

<center>

## 장기 코딩: 경계는 계속 확장되고 있습니다

</center>

코딩 agent의 작업 시간은 한 번의 짧은 작업에서 수십 시간 단위로 늘어났습니다.

OpenAI는 Codex를 빈 저장소에서 약 25시간 연속으로 실행하여 약 3만 줄의 코드를 만들어냈습니다.

Anthropic은 16개의 Claude agent를 사용해, 약 2,000개의 세션과 약 2주, 그리고 2만 달러에 가까운 API 비용으로 약 10만 줄의 C 컴파일러를 처음부터 구축했습니다.

시간은 점점 길어지고, agent는 점점 많아지고, 소프트웨어는 점점 복잡해지고 있습니다.

하지만 연구의 중심은 여전히 agent입니다:

더 강력한 모델, 더 긴 컨텍스트, 더 지속적인 메모리, 더 많은 agent.

**EvoX 팀은 이 질문의 방향을 달리했습니다:**

**왜 agent가 계속 존재해야 할까요?**

정작 지속되어야 하는 것이, agent가 살아 있는 소프트웨어 세계라면 어떨까요?

<center>

## 123.4시간, 25만 줄

</center>

우리는 EvoX Genesis가 구현이 완전히 비어 있는 저장소에서 시작하게 했습니다.

목표는 단 하나였습니다: C 컴파일러를 만드는 것.

123.4시간, 1,019개의 agent episode, **248,989줄의 코드**, 그리고 단 **44.38달러**의 모델 token 비용.

최종 컴파일러는 220/220 c-testsuite 테스트, 32/36 LLVM 테스트 케이스, 93/93 Csmith 랜덤 프로그램 테스트를 통과했습니다.

그곳에는 완성을 기다리던 기존 컴파일러가 없었습니다 — **모든 것을 처음부터 시작했습니다.**

![image2.png](./evox-genesis-2.png)

<center>

_그림 1: C 컴파일러 실험 결과 / 코드 규모, 실행 시간, agent episode 수, 비용, 테스트 결과_

</center>

<center>

_(DeepSeek V4 Flash 모델 사용)_

</center>

<center>

## agent를 계속 살려두지 말고, 소프트웨어 세계를 살려두세요

</center>

복잡한 소프트웨어의 수명은 본질적으로 단일 agent 세션보다 깁니다.

EvoX Genesis는 소프트웨어를 재귀적으로 전개되는 하나의 소프트웨어 세계로 구성합니다:

상위 agent가 목표를 분해하면, 새로운 agent가 각자의 위치에서 작업을 완수합니다;

결과는 검증된 뒤 소프트웨어의 버전 역사에 들어가고, 다음 개발 라운드의 현실이 됩니다.

그러고 나면 agent는 사라져도 됩니다,

새로운 agent가 이미 자리 잡은 소프트웨어 세계에서 이어받아 계속합니다.

지속되는 것은 어떤 대화(conversation)도, 점점 길어지기만 하는 scratchpad도, 늘 온라인 상태인 "총괄 agent"도 아닙니다.

지속되는 것은 코드, 구조, 제약 조건, 검증 결과, 그리고 이미 일어난 역사입니다.

**지속되는 것은 agent가 아니라 소프트웨어 세계입니다.**

**Agent는 지속되지 않습니다. 검증된 결과물이 지속됩니다.**

이것이 EvoX Genesis의 재귀적 자율 진화입니다. 사용자에게 이는 매우 단순한 한 가지를 의미합니다:

**agent를 구축하는 것이 아니라, 소프트웨어가 되기를 바라는 모습을 설명하면 됩니다.**

agent, 역할, 워크플로를 미리 설계할 필요도, 완전한 작업 트리를 수동으로 분해할 필요도 없습니다.

사용자는 짧은 글로 소프트웨어 개발 목표를 설명하기만 하면 됩니다;

작업을 어떻게 분해하고, agent를 어떻게 생성하고, 재귀를 어떻게 전개하며, 결과를 어떻게 검증할지 — 이 모든 것은 EvoX Genesis가 스스로 수행합니다.

![image3.png](./evox-genesis-3.png)

<center>

_그림 2: Persistent Recursive World 개념도 / agent는 태어나고, 행동하고, 사라집니다; 소프트웨어 세계는 계속 전개됩니다_

</center>

<center>

## 모델은 바뀌어도, 소프트웨어 세계는 계속됩니다

</center>

이러한 연속성은 처음부터 끝까지 같은 모델을 사용할 것을 요구하지 않습니다.

또 다른 실험에서는 GLM 5.2가 처음 구축한 소프트웨어 세계를 DeepSeek V4 Flash에 넘겨 개발을 이어가게 했습니다.

최종적으로, 유지된 LLVM SingleSource 테스트에서 1,820/1,820을 통과했습니다.

모델은 교체될 수 있고, agent도 교체될 수 있습니다 — 소프트웨어 세계는 계속됩니다.

![image4.png](./evox-genesis-4.png)

<center>

_그림 3: 모델 간 이어가기 실험, GLM 5.2 → DeepSeek V4 Flash_

</center>

<center>

## 처음부터 시작하거나, 역사를 이어받거나

</center>

완전히 처음부터 구축하는 것은 소프트웨어 생명주기의 한쪽 끝일 뿐입니다;

반대쪽 끝은 수년 동안 존재해 온, 구조와 역사가 풍부한 소프트웨어 세계입니다.

우리는 EvoX Genesis를 MESA — 항성 진화 연구를 위해 오랜 기간 개발된 과학 계산 시스템 — 에 적용했습니다.

실험은 13개의 Fortran 모듈, 총 **139,414줄**을 다뤘습니다;

EvoX Genesis는 이를 대응하는 Rust crates로 리팩터링했으며, 모델 token 비용은 약 **10.6달러**였습니다.

소프트웨어 세계는 무에서 출발해 만들어질 수도 있고, 역사를 이어받아 계속 변화할 수도 있습니다.

![image5.png](./evox-genesis-5.png)

<center>

_그림 4: MESA Fortran → Rust, 13개 모듈, 139,414줄의 코드, 10.6달러_

</center>

<center>

## 비용 이점은 시간이 지날수록 복리로 쌓입니다

</center>

장기 소프트웨어 개발이 비용이 계속 선형적으로 늘어난다는 것을 의미하지는 않습니다.

EvoX Genesis에서는 검증된 코드, 구조, 개발 역사가 계속 축적되어 다음 작업의 기반이 됩니다. 이후의 agent는 전체 프로젝트를 매번 처음부터 다시 이해할 필요가 없으며, 기존 정보의 상당 부분은 그대로 캐시하여 재사용할 수 있어 캐시 적중률이 최대 97.4%에 달합니다.

시스템이 계속 실행될수록 재사용 가능한 개발 상태는 풍부해지고, 중복 계산은 줄어들며, 개발의 단위 비용은 오히려 시간이 지날수록 낮아집니다.

이것이 시간이 지나며 축적되는 엔지니어링 복리입니다.

<center>

## EvoX Genesis가 오픈소스로 공개되었습니다

</center>

프로젝트는 오픈소스로 공개되었으며, Windows, macOS, Linux용 설치 패키지를 제공합니다.

🌐 웹사이트:

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

**Agent는 떠나지만, 소프트웨어 세계는 계속 진화합니다**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>QQ 그룹｜</strong>Evolutionary Machine Intelligence</center>

참고 자료:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
