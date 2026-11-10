---
title: "Genesis의 EvoX Compiler 구축: 컨트랙트, 그래프 테스트 및 디바이스 동기화"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Genesis가 명시적 단계, 변환 체크 및 백엔드 컨트랙트를 중심으로 텐서 그래프 컴파일러를 개발한 방법과 공개 테스트의 구체적인 사례를 살펴봅니다."
---

텐서 그래프 컴파일러를 구축한다는 것은 동일한 계산에 대한 여러 구현체 간의 일관성을 유지하는 것을 의미합니다. 그래프 변환은 텐서 레이아웃을 변경할 수 있고, 어댑터는 연산을 거부할 수 있으며, 디바이스 호출은 계산이 끝나기 전에 반환될 수 있습니다. Genesis의 EvoX Compiler 사례는 이러한 경계들을 개별적으로 검토할 때 유용해집니다.

![회귀 테스트를 통해 확인된 컴파일러 그래프](./compiler-contract-layers.webp)

[10월 28일 Evidence 스냅샷](https://genesis.evox.group/evidence/evoxc/)은 6,789개의 테스트 통과와 약 50달러의 모델 토큰 비용을 기록하고 있습니다. 이러한 수치 뒤에 숨겨진 엔지니어링을 살펴보기 위해, 이 기사에서는 공개적으로 접근 가능한 v0.1.0 소스도 함께 사용합니다. 스냅샷과 릴리스 버전은 테스트 총계가 다르며, 아래의 구현 예시는 해당 버전에 따라 식별됩니다.

## 목표를 테스트 가능한 인터페이스로 전환하기

EvoX Compiler는 텐서 언어, EvoXIR 그래프 및 스테이징 인터페이스를 소유합니다. 외부 컴파일러는 내보내진 표현(representation)을 수신하여 최적화, 스케줄링 및 코드 생성을 처리합니다. [package contracts](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md)는 의존성 방향을 문서화합니다. 값 타입과 IR은 트레이싱 및 연산을 뒷받침하며, 변환(transformation)과 어댑터는 이러한 레이어 위에서 구축됩니다. 별도의 `evoxc_hf` 패키지는 공개 컴파일러 API를 사용하며, 컴파일러는 모델 통합 패키지를 임포트하지 않습니다.

이러한 분리는 로컬 개발 작업에 구체적인 경계를 제공합니다. 예를 들어, 변환은 각 백엔드가 Python의 `vmap`을 이해하도록 요구하는 대신 또 다른 일반 그래프를 생성합니다. 백엔드의 공백은 실행 경로를 조용히 변경하는 대신 명시적인 오류가 되어야 합니다. 패키지 수준의 컨텍스트 문서는 다른 개발 태스크가 준수해야 하는 API와 제약 사항을 기록합니다.

공개 파이프라인은 `trace → lower → compile → load → run`입니다. 각 단계는 별개의 객체를 반환합니다. [specification tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py)는 잘못된 단계의 입력을 확인하고, 그래프 정의에 대한 직접적인 eager execution 호출을 거부하며, 편의 함수들이 문서화된 파이프라인으로 확장되는지 검증합니다. 또한 작성자가 명시적으로 임베딩하지 않는 한 클로저에서 구체적인 텐서를 캡처하는 것을 거부합니다. 실질적인 이점은 겉보기에 편리한 지름길이 두 번째 세맨틱을 몰래 도입할 수 없게 된다는 점입니다.

Evidence 기록에 따르면, 개발은 레이어별로 진행되었으며 다음 레이어로 넘어가기 전에 pytest 체크가 요구되었습니다. 저장소는 해당 방법론에 대해 검사 가능한 컨트랙트와 테스트를 제공하며, 에이전트 결정의 전체 아카이브 시퀀스를 제공하지는 않습니다.

## 두 개의 레퍼런스를 통해 확인되는 모집단 변환

까다로운 기능 중 하나는 `batch_functions`입니다. 이는 입력/출력 시그니처가 일치하는 여러 프로그램을 단일 그래프로 결합합니다. 이 기능의 컨트랙트는 "결합된 그래프가 실행된다"는 것보다 더 강력합니다. 즉, 출력 행 i는 여전히 프로그램 i의 결과와 같아야 합니다.

[v0.1.0 integration tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py)는 작고 읽기 쉬운 예제를 실행합니다. 동일한 그래프 위치에서 세 개의 프로그램이 각각 `x + 1`, `x * 2`, `x - 3`을 수행합니다. `switch_ops=True`인 경우, 병합된 그래프는 행별 선택을 통해 서로 다른 연산을 표현합니다. 테스트는 이 그래프를 IREE의 CPU 경로를 통해 컴파일하고, 그 출력을 병합된 그래프의 NumPy 실행 결과 및 원래 함수들의 NumPy 결과 스택과 `rtol=atol=1e-5` 오차 범위 내에서 비교합니다.

컴파일러가 없는 체크(Compiler-free checks)는 StableHLO 출력을 조사하여 예상된 선택 연산이 있는지 확인합니다. 또 다른 체크는 동일한 프로그램들을 병합하고 그 결과를 `vmap`과 비교하는데, 이 경우 선택 연산이 필요하지 않아야 합니다. 이러한 테스트들은 단순히 성공적인 컴파일을 유일한 수락 조건으로 삼는 대신, 프로그램 보존, 내보내기 및 백엔드 통합을 종합적으로 조사합니다.

## 디바이스 배치는 정확성의 일부입니다

GPU에서 실행되는 실행 파일은 호스트 데이터가 이미 디바이스에 상주하는 것처럼 가장하여 수락해서는 안 됩니다. [tensor and placement specification tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py)는 데이터가 물리적 디바이스를 가지고 있는지, `Tensor.to(device)`를 통해 전송이 명시적으로 이루어지는지, 그리고 유효하지 않은 배치가 `DeviceError`를 발생시키는지 확인합니다.

이는 성능 측정에서도 중요합니다. 모든 호출이 모델 가중치를 다시 전송한다면, 지연 시간 수치는 가중치를 상주시키는 워크로드와는 다른 작업을 측정하게 됩니다. [v0.1.0 model-integration documentation](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md)은 체크포인트 로딩, 순전파 계산 및 실행 파일 스테이징을 분리합니다. 파라미터는 명시적인 그래프 입력으로 유지되어 배치가 가시적으로 드러납니다.

## 반환된 호출이 반드시 완료된 작업을 의미하지는 않습니다

XLA 디바이스 상주 경로는 작업을 큐에 넣고 완료 전에 반환될 수 있습니다. 따라서 `run` 시간만 측정하면 실행 시간을 과소평가하게 됩니다. [synchronization tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py)는 이벤트 라이프사이클을 확인합니다. 실행은 완료 핸들을 축적하고, `synchronize()`는 이를 기다린 후 파괴하며, 두 번째 동기화는 추가적인 플러그인 작업을 수행하지 않습니다.

오류 케이스 또한 구체적입니다. 대기가 실패하더라도 남은 핸들은 여전히 처리되어야 하며 첫 번째 오류가 발생해야 합니다. 완료 이벤트를 제공하지 않는 플러그인은 거짓 완료 주장을 하는 대신 명시적인 오류를 트리거해야 합니다.

이 테스트들은 수치 계산을 수행하지 않는 작은 가짜 PJRT 플러그인을 사용합니다. 이들은 GPU 처리량이나 수치적 정확도가 아니라 동기화 세맨틱과 정리(cleanup)를 검증합니다. 이러한 구분을 통해 테스트의 증거가 주장과 일치하도록 유지합니다.

## 과거 결과와 릴리스 결과를 분리하여 유지하기

| 기록 | 구성 | 보고된 결과 |
| --- | --- | --- |
| 10월 28일 Evidence 스냅샷 | IREE 설치됨 | 6,789 통과; 46 건너뜀; 3 예상된 실패; 0 실패 |
| 10월 28일 Evidence 스냅샷 | 컴파일러 제외 | 6,367 통과; 95 건너뜀; 3 예상된 실패 |
| v0.1.0 릴리스 README | 코어 및 모델 통합 스위트, 모든 나열된 추가 요소 설치됨 | 7,511 통과; 77 건너뜀; 4 예상된 실패; 0 실패 |

출처: [Evidence verification](https://genesis.evox.group/evidence/evoxc/#verification) 및 [versioned release status](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). 이는 프로젝트에서 보고한 실행 결과입니다. 의존성 및 하드웨어 가드는 실행되지 않은 경로를 설명하며, 통과된 CPU 테스트가 모든 가속기에 대한 검증을 의미하지는 않습니다.

Evidence 스냅샷의 추적된 285,659개 텍스트 라인에는 테스트, 문서 및 벤치마크 자료가 포함되어 있습니다. 약 50달러의 비용은 하드웨어를 제외한 모델 토큰 비용이며, 모델, 에피소드 수 및 활성 실행 시간은 보고되지 않았습니다. 저장소의 달력상 기간은 연속적인 자율 실행 시간이 아닙니다.

저장소는 코드, 테스트 및 문서를 생성한 공로를 Genesis에 돌립니다. 구체적인 결과물은 개별적으로 검사 가능한 단계별 컨트랙트, 그래프 보존 테스트 및 디바이스 완료 세맨틱을 갖춘 컴파일러입니다. 이러한 경계를 가로지르는 하나의 기능을 따라가 보려면 [population integration test](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py)부터 시작하십시오. [EvoX Compiler overview](/ko/releases/evoxc-0-1-0)는 사용자용 파이프라인을 설명합니다.
