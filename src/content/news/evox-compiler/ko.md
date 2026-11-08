---
title: "EvoX Compiler v0.1.0: 실행 전에 프로그램을 살펴보기"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "명시적 그래프, 조합 가능한 변환, 분리된 실행 단계로 후보 프로그램의 구조를 확인하고 일괄 평가할 수 있습니다."
---

탐색 후보가 프로그램 자체라면 최종 출력만 디버깅해서는 실험의 많은 부분을 볼 수 없습니다. EvoX Compiler는 프로그램 자체를 검사 가능한 대상으로 만듭니다. 연구자는 그래프를 보관하고 변환하며 명확히 분리된 단계를 통해 실행 백엔드를 선택할 수 있습니다.

![컴파일러 검사를 위해 드러낸 프로그램 구조](./evoxc-visible-stages.webp)

*개념 일러스트: 정의와 실행 사이의 프로그램 구조를 드러냅니다.*

**EvoX Compiler(evoxc) v0.1.0**은 2026년 10월 29일 공개되었습니다. Python 텐서 그래프 프런트엔드와 런타임으로 Python 3.11 이상이 필요하며 Apache-2.0 라이선스를 사용합니다. [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## 정의에서 검사 가능한 실행 객체로

흐름은 `trace → lower → compile → load → run`입니다. 정의와 입력 명세로 EvoXIR 그래프를 만들고, 백엔드 표현으로 변환하고, 산출물을 컴파일한 뒤 장치에 연결하여 데이터로 실행합니다. 각 단계의 객체를 검사할 수 있습니다.

잘못된 그래프, 지원하지 않는 변환, 장치 불일치를 구분할 수 있고 그래프와 지원 산출물을 저장할 수도 있습니다. 최적화·스케줄링·코드 생성은 외부 컴파일러가 맡으며 evoxc는 프런트엔드와 단계별 계약을 제공합니다.

## 프로그램 집단을 하나의 그래프에 담기

`vmap`, `grad`, `jvp`, `vjp`는 실행 전에 조합할 수 있는 그래프를 만듭니다. [`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population)는 입력·출력 명세가 맞는 후보 함수를 개체군 그래프로 합칩니다.

유전 프로그래밍, 구조 탐색, 알고리즘 합성에서는 후보가 매개변수 벡터가 아닌 서로 다른 프로그램일 수 있습니다. 통합은 반복 컴파일과 호출을 줄일 수 있지만 효과는 구조와 백엔드에 달려 있으며 모든 개체군의 가속을 보장하지 않습니다.

## 필요한 연산에 맞는 백엔드 선택하기

NumPy만 필수 의존성이며 기준 CPU 인터프리터를 제공합니다. 선택적 어댑터는 IREE, 사용자 PJRT 플러그인을 통한 XLA, StableHLO 프런트엔드를 통한 TVM을 연결합니다. 연산자와 하드웨어 지원 범위는 같지 않습니다.

해당 README의 Vulkan 검증은 소프트웨어 장치인 Mesa lavapipe를 사용했고 TVM ROCm은 컴파일만 검증했습니다. GPU 입력과 장치 배치는 명시적입니다. CPU 그래프를 옮기기 전에 어댑터의 지원 연산자를 확인해야 합니다.

## CPU에서 시작한 뒤 그래프 옮기기

버전을 고정해 설치하고 README의 CPU 예제로 그래프를 살핀 뒤 컴파일 백엔드를 선택하세요.

```bash
pip install evoxc==0.1.0
```

별도의 HuggingFace 통합은 `evoxc-hf`로 설치하며 독립적인 배포 및 업그레이드 주기를 갖습니다.

## 환경과 함께 검증 결과 읽기

문서에 명시된 추가 의존성을 설치한 환경에서 릴리스 README는 핵심·통합 테스트 **7,511개 통과, 77개 건너뜀, 4개 예상된 실패**와 예상 밖 실패 0개를 보고합니다. 건너뛴 항목에는 하드웨어·의존성 조건 검사가 포함됩니다. 저장소는 코드, 테스트와 문서를 Genesis가 생성했다고 밝힙니다.

API와 지원표는 [버전 README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), 산출물은 [릴리스 기록](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0), 이후 개발은 [GitHub](https://github.com/EMI-Group/evoxc)를 참고하세요.

컴파일러의 에이전트 개발 과정은 [Genesis와 EvoX Compiler](/ko/news/genesis-evoxc)에서 확인할 수 있습니다. 직접 실험할 때는 기준 그래프 하나를 보관하고 각 변환을 살펴본 다음 백엔드별 동작을 비교하세요.
