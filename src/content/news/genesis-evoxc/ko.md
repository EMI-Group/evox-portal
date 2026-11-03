---
title: "EvoX Compiler: Genesis로 구축한 명시적 텐서 그래프 시스템"
pubDate: 2026-11-03
summary: "Genesis의 EvoX Compiler 사례는 NumPy, IREE, XLA, TVM 실행 경로를 제공하는 Python 텐서 그래프 컴파일러와 런타임을 소개합니다."
---

EvoX Compiler(evoxc)는 계산 그래프를 검사 가능한 결과물로 만듭니다. 프런트엔드가 EvoXIR을 구성하고 변환하며, 명시적인 단계로 하위 표현 변환, 컴파일, 로드, 실행을 진행합니다. 필수 의존성은 NumPy뿐이며 최적화와 코드 생성은 외부 컴파일러가 담당합니다.

**2026년 10월 28일**자 Evidence 스냅샷은 **NumPy, IREE, XLA, TVM**의 네 실행 경로를 기록합니다. 저장소는 코드, 테스트, 문서를 Genesis로 작성했다고 밝힙니다. 초기 구축에서 인터페이스와 백엔드의 지속적인 개발로 이어지는 사례입니다.

IREE 설치 구성에서 **6,789개 통과, 46개 건너뜀, 3개 예상된 실패**, 실패 0개를 보고합니다. 이는 과거 집계이며 현재 저장소의 총수가 아닙니다. **버전 관리 대상 텍스트 285,659줄**에는 테스트, 벤치마크 데이터, 문서가 포함되므로 컴파일러 소스만의 규모가 아닙니다. 모델 token 비용은 약 **미화 50달러**로 하드웨어를 제외합니다.

백엔드 검증 범위는 구성에 따라 다릅니다. 기록된 Vulkan 검증은 소프트웨어 장치를 사용했고 TVM의 ROCm 경로는 컴파일만 검증했습니다. 결과는 프로젝트 측 보고로 독립 재현되지 않았습니다. 개발자는 저장소의 명시적 그래프 처리 흐름과 커밋된 벤치마크 보고서부터 살펴볼 수 있습니다.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
