---
title: "EvoX Genesis, Terminal-Bench WASM Render 챌린지를 36달러로 완주 및 제출"
pubDate: 2026-09-10
summary: "EvoX 팀은 Genesis를 사용해 Terminal-Bench Challenges의 WASM Render 챌린지를 완료하고 제출했습니다. 이번 실행에서 기록된 모델 비용은 36달러로, Terminal-Bench가 제시한 챌린지당 1,000달러 이상의 예상 비용을 크게 밑돕니다. 게시 시점 기준, Genesis는 Terminal-Bench Challenge 결과를 완료·제출했다고 공개적으로 보고한 최초의 자율 시스템일 가능성이 있습니다."
---

![EvoX Genesis가 Terminal-Bench WASM Render 챌린지를 완료하고 제출](./evox-genesis-terminal-bench-hero.png)

EvoX 팀은 Genesis를 사용해 Terminal-Bench Challenges의 WASM Render 챌린지를 완료하고 제출했으며, 이번 실행에서 기록된 모델 비용은 **36달러**입니다.

게시 시점 기준, **Genesis는 Terminal-Bench Challenge 결과를 완료·제출했다고 공개적으로 보고한 최초의 자율 시스템일 가능성이 있습니다**.

## WASM Render: 완전한 WebGL 소프트웨어 스택을 처음부터 구현하기

WASM Render는 Node.js 프로젝트에 WebGL 1.0과 2.0 API를 제공하는 순수 JavaScript/WASM 소프트웨어 렌더러를 구현하는 과제입니다. 대상 환경은 브라우저, GPU, 네이티브 C++ 바인딩, 외부 라이브러리에 의존할 수 없습니다.

챌린지 정의에 따라 솔루션은 GLSL 컴파일러, 삼각형 래스터라이저, 그리고 WebGL API 전반을 포괄해야 합니다. Terminal-Bench가 이 과제에 정한 검증 범위는 2,071개의 Khronos CTS 테스트와 three.js 및 Babylon.js의 시각 회귀 테스트입니다. 이는 챌린지의 수락 목표를 설명하는 것으로, Genesis 제출물이 이미 Terminal-Bench의 공식 평가를 통과했다는 의미는 아닙니다.

많은 코딩 에이전트 벤치마크는 단일 버그 수정이나 국소적 기능을 평가 단위로 삼습니다. WASM Render는 다릅니다. 작업은 서로 의존적인 수많은 모듈에 걸쳐 있으며, 구현·통합·검증이 계속되는 과정 전체에서 코드베이스 전체의 일관성을 유지해야 합니다.

이런 유형의 과제는 장기 개발의 핵심 문제를 드러냅니다. 국소적 수정이 전체 아키텍처와 일치하는지, 초기 결정이 이후 작업에 올바르게 상속되는지, 검증 결과가 다음 단계 개발의 신뢰할 수 있는 근거가 되는지가 문제입니다. Terminal-Bench Challenges는 평가 대상을 완전한 소프트웨어 프로젝트로 확장해 바로 이 능력을 관찰하고자 합니다.

![Terminal-Bench Challenges와 단기 코딩 과제 비교](./evox-genesis-terminal-bench-comparison.jpg)

## Genesis는 장기 개발을 어떻게 유지하는가

Genesis는 개발 상태 전체를 유지하기 위해 하나의 영속적인 에이전트나 끝없이 커지는 단일 컨텍스트에 의존하지 않습니다. 소프트웨어 프로젝트 자체가 영속하는 '세계'를 이룹니다. 수락된 소프트웨어 버전이 현재 사실을 기록하고, 저장소 경로가 에이전트의 위치와 책임 범위를 정합니다.

수명이 제한된 에이전트들은 저장소 구조를 중심으로 재귀적으로 전개되어, 제한된 범위 안에서 후보 변경을 구현·검사·검증합니다. 에이전트의 산출물은 먼저 제안이며, 수락된 코드와 검증 증거만이 프로젝트 역사에 들어와 이후 에이전트에게 상속됩니다.

WASM Render 같은 시스템 프로젝트에서는 이를 통해 각 에이전트가 명확하고 제한된 국소 문제를 다루는 동시에, 컴파일러, 렌더링 파이프라인, 상태 관리, 호환성 작업이 동일한 코드·검증 역사를 따라 지속적으로 진화할 수 있습니다.

Genesis는 단 36달러로 WASM Render 챌린지를 완료했으며, 이는 Terminal-Bench가 제시한 챌린지당 1,000달러 이상의 예상 비용을 크게 밑돕니다.

내부 비공식 테스트는 Genesis가 약 10만 줄 규모의 코드베이스에서도 효과적으로 작동함을 보여줍니다. 100만 줄 이상 규모의 코드베이스에 대해서는 경험이 상대적으로 적지만, 지금까지의 시도는 순조롭게 진행되고 있습니다.

🌐 프로젝트 공식 웹사이트:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 QQ 그룹: 297969717

![QQ 그룹 QR 코드](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>QQ 그룹｜</strong>Evolutionary Machine Intelligence</center>
