---
title: "Genesis, 모델 교체 후에도 컴파일러 개발 지속"
pubDate: 2026-11-03
summary: "Genesis의 개발 지속 기록은 GLM 5.2에서 DeepSeek V4 Flash로 전환한 후 평가 대상으로 유지한 LLVM SingleSource 1,820개를 모두 통과했다고 보고합니다."
---

기반 모델이 바뀌어도 소프트웨어 개발을 이어갈 수 있을까요? 2026년 9월 7일자 Compiler Continuation 기록은 이전 Agent의 대화 맥락을 넘겨받지 않고, 이미 채택된 컴파일러 저장소에서 개발을 이어간 사례입니다.

기록에 따르면 **GLM 5.2에서 DeepSeek V4 Flash로 전환**하면서 작업의 재귀 깊이가 **4에서 8**로 늘었습니다. 이후 평가 대상으로 유지한 **LLVM SingleSource 1,820/1,820개**를 통과했습니다. 이는 지정된 평가 집합의 결과이며 LLVM 테스트 모음 전체를 통과했다는 뜻은 아닙니다.

채택된 코드와 프로젝트 이력이 다음 작업의 기반을 제공한다는 Genesis의 개발 연속성을 보여줍니다. 컴파일러 최초 구축과 후속 개발 기록은 같은 저장소를 공유하므로 독립된 두 프로젝트로 계산해서는 안 됩니다.

이 기사는 Evidence 기록을 돌아봅니다. 결과는 프로젝트 측 보고이며 독립적으로 재현되지 않았습니다. 후속 개발 비용과 추가 코드량은 공개되지 않았습니다. 연결된 저장소 기본 브랜치의 README는 다른 평가 시점을 설명하므로 해당 테스트 수를 이번 결과와 합쳐서는 안 됩니다.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
