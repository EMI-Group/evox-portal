---
title: "EvoX Genesis: 검사 가능한 단계와 회귀 게이트를 통한 C 컴파일러 구축"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "C 컴파일러 사례는 빈 구현체에서 시작하여 컴파일러 단계, 진단 및 외부 테스트 하네스를 거치는 과정을 따르며, 결과는 문서화된 범위 내에서 유지됩니다."
---

빈 구현체에서 시작하는 것은 명확한 목표입니다. 하지만 올바르게 동작하는 실행 파일을 생성하는 것은 훨씬 더 까다로운 수락 조건입니다. Genesis의 C 컴파일러 사례는 구축된 인터페이스와 이를 둘러싼 검증 계층을 통해 살펴볼 수 있습니다.

![성장하는 소프트웨어 프로젝트로 조립되는 소스 모듈](./software-world-continuity.webp)

[C Compiler Evidence 기록](https://genesis.evox.group/evidence/c-compiler/)에 따르면, DeepSeek V4 Flash를 사용하여 **248,989 라인의 Rust**, **1,019개의 아카이브된 agent episodes**, **123.4시간** 및 **모델 토큰 비용 US$44.38**이 소요되었습니다. 또한 220/220개의 c-testsuite 케이스, 32/36개의 평가된 LLVM 케이스, 2,904/2,904개의 Rust 테스트 결과가 나열되어 있습니다. 이는 프로젝트에서 보고된 결과이며, 이 기사를 위해 새로 재현된 것이 아닙니다.

## 먼저 하나의 프로그램을 모든 단계에 통과시키기

공개 컴파일러인 jcc는 일련의 엔지니어링 마일스톤을 문서화합니다. 워크스페이스 구축, 엔드 투 엔드(end-to-end) 컴파일 골격 제작, 언어 커버리지 확장, 최적화 추가, 그리고 외부 스위트 및 애플리케이션 빌드 실행 순입니다. [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md)은 이러한 게이트들을 정의하며, 이는 Genesis의 모든 에피소드에 대한 타임스탬프 기록이라기보다 리포지토리의 개발 기록으로 읽어야 합니다.

[architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)는 전처리, 어휘 및 구문 분석, 의미론적 검사, CIR lowering, 최적화, 기계어 생성, 오브젝트 어셈블리 및 링킹을 연결합니다. 각 단계는 별도의 crate가 담당합니다.

이러한 구조는 유용한 중간 산출물을 생성합니다. `-E`는 전처리 후 중단하고, `-emit-jcc-ir`은 CIR을 노출하며, `-S`는 어셈블리를 출력하고, `-c`는 오브젝트 파일을 생성합니다. 컴파일된 프로그램이 실패할 경우, 이러한 경계는 전체 파이프라인을 변경하기 전에 조사 범위를 좁혀줍니다.

## 중간 표현을 통한 C 의미론 보존

CIR은 LLVM IR과는 별개인 컴파일러의 타입이 지정된 SSA 표현식입니다. 최적화는 CIR을 CIR로 변환하며, 문서화된 디버그 빌드 워크플로우는 패스(pass) 실행 후 검증기(verifier)를 실행합니다. [testing guide](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md)는 lowering, 잘못된 표현식, rewrite, 인스트럭션 인코딩 및 명령줄 동작에 대한 검사를 설명합니다.

표현식 검증은 하나의 계층일 뿐, 올바른 컴파일을 증명하는 것은 아닙니다. 구조적으로 유효한 변환이라도 프로그램의 결과를 바꿀 수 있습니다. 이것이 테스트 전략에서 C 프로그램을 컴파일 및 실행하고 그 출력을 비교하는 이유입니다.

코퍼스에는 의도적인 컴파일 실패 사례도 포함되어 있습니다. 테스트는 진단 심각도, 메시지 및 소스 범위를 확인합니다. 이는 성공적인 실행 동작과 더불어 유효하지 않은 입력에 대한 거부 동작을 보존합니다. 컴파일러의 [C11 compliance document](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md)는 지원되는 구문과 확장 정책을 기록합니다.

## 외부 스위트를 통한 전체 경로 테스트

[c-testsuite harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py)는 외부 언어 테스트 게이트를 제공합니다. [LLVM runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py)는 테스트 대상 컴파일러로 CMake를 구동하고, 프로그램을 빌드하며, 실행 결과를 참조 출력과 비교합니다. 기본 수치 비교에는 1e-4의 허용 오차를 사용하며, 비수치 토큰과 종료 상태는 정확히 일치해야 합니다.

[Csmith harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py)는 참조 컴파일러와의 생성 프로그램 차분 테스트(differential testing)를 추가합니다. 검사된 README 스냅샷에서 100개의 시드 실행 결과는 **93개 통과, 0개 실패, 7개 건너뜀**으로 보고되었으며, 건너뜀은 두 컴파일러 모두에서 발생한 타임아웃 때문으로 명시되었습니다. 건너뛴 시드를 제외하고 이를 "93/93"이라고 부르는 것은 워크로드의 일부를 숨기는 결과가 됩니다.

이러한 검사들은 서로 다른 클래스의 오류를 감지합니다. 언어 스위트는 지정된 구문을 조사하고, 무작위 프로그램은 조합을 탐색하며, 링크된 애플리케이션 빌드는 드라이버, 오브젝트 파일 및 런타임 인터페이스를 함께 실행합니다.

## 성공 지표를 테스트된 작업에 국한시키기

[버전 관리된 README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation)는 lz4가 빌드되고 8개의 필수 테스트를 통과했음을 보고합니다. 또한 SQLite가 깔끔하게 파싱 및 lowering 되었으며, 추가적인 전체 파일 검증 작업이 기록되어 있다고 설명합니다. SQLite를 파싱하는 것은 유용한 통합 마일스톤이지만, 이는 SQLite의 전체 런타임 테스트 스위트를 통과하는 것과는 다릅니다.

동일한 소스에는 부분적인 `long double` 산술, 보류된 플랫폼 및 문서화된 확장 정책 게이트가 나열되어 있습니다. 따라서 32/36 LLVM 결과는 평가된 하위 집합과 제외 사항을 유지해야 합니다. README와 Evidence 페이지는 워크스페이스 테스트 횟수도 다르게 나타나는데, 이 기사에서는 스냅샷을 결합하는 대신 Evidence의 합계를 해당 기록에 귀속시킵니다.

## 개발 작업 간에 지속되는 요소

Genesis의 [문서화된 개발 모델](https://genesis.evox.group/getting-started/)은 소프트웨어 프로젝트를 중심으로 재귀적인 작업 분해를 사용합니다. 이 사례에서 지속 가능한 엔지니어링 산출물은 구체적입니다. 소스 모듈, 표현식 규약, 중간 출력물, 진단 및 회귀 하네스가 그것입니다. 이후의 작업은 이전 작업의 대화 내용에만 의존하는 대신 이러한 산출물을 바탕으로 진행될 수 있습니다.

[model-continuation 사례](/news/genesis-compiler-continuation)는 이후의 인수인계와 별도로 범위가 지정된 1,820개 케이스의 결과를 조사합니다. [MESA rewrite](/news/genesis-mesa)는 원래의 수치적 동작을 참조로 사용하며, [EvoX Compiler](/news/genesis-evoxc)는 텐서 그래프와 디바이스 규약을 확인합니다. 이것들은 동일한 컴파일러 실험의 추가 실행이 아니라 별개의 검증 문제입니다.

US$44.38은 모델 토큰 비용이며 하드웨어 비용은 제외됩니다. 공개 기록은 보고된 범위 내에서 실질적인 컴파일러 구축 사례를 뒷받침하지만, 무제한적인 C 호환성을 확립하는 것은 아닙니다. 결과를 검사하려면 [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)를 따라 외부 하네스 중 하나를 확인한 다음, 해당 게이트를 정의하는 정확한 프로그램과 출력을 조사하십시오.
