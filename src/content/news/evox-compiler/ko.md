---
title: "EvoX Compiler v0.1.0: 명시적 텐서 그래프와 여러 백엔드"
pubDate: 2026-10-29
summary: "EvoX Compiler 첫 릴리스는 검사 가능한 계산 그래프, 조합 가능한 변환, NumPy·IREE·XLA·TVM 실행 경로를 Python에 제공합니다."
---

**EvoX Compiler(evoxc) v0.1.0이 2026년 10월 29일 출시되었습니다.** 프로그램 자체를 검사, 변환, 저장, 실행하려는 개발자를 위한 Python 텐서 그래프 컴파일러와 런타임입니다. Apache-2.0 라이선스로 제공되며 Python 3.11 이상이 필요합니다.

## 검사할 수 있는 프로그램

evoxc는 `trace → lower → compile → load → run`의 각 단계를 공개합니다. 프런트엔드는 EvoXIR로 계산을 표현하고 StableHLO를 외부 컴파일러에 전달합니다. 최적화와 코드 생성은 외부 컴파일러가 담당하며 중간 그래프와 결과물을 검사하고 저장할 수 있습니다.

그래프 변환에는 `vmap`, `grad`, `jvp`, `vjp`가 포함됩니다. 신경망 아키텍처 탐색, 유전 프로그래밍, 알고리즘 합성에서 `batch_functions`는 입출력 규격이 같은 후보 프로그램을 하나의 그래프로 합칩니다. 명시적 컴파일 캐시는 정적 프로그램을 반복 생성하는 작업을 지원합니다.

## 네 가지 실행 경로

NumPy만 필수 의존성이며 기본 CPU 인터프리터를 제공합니다. 선택적 어댑터는 IREE, 사용자가 제공하는 PJRT 플러그인을 통한 XLA, TVM에 연결합니다. 백엔드와 장치를 명시적으로 선택하며 연산자 및 하드웨어 지원 범위는 어댑터에 따라 다릅니다. 릴리스 문서의 Vulkan 검증은 Mesa lavapipe를 사용했고 TVM의 ROCm 지원은 컴파일 단계만 검증했습니다.

릴리스 README는 IREE, TVM, torch 설치 구성에서 코어 및 `evoxc_hf` 테스트 결과를 **7,511개 통과, 77개 건너뜀, 4개 예상된 실패, 실패 0개**로 보고합니다. 해당 구성에 대한 프로젝트 측 결과입니다. 저장소는 코드, 테스트, 문서를 EvoX Genesis로 작성했다고 밝힙니다.

## 시작하기

아래 명령으로 이 릴리스를 설치할 수 있습니다. 선택적 컴파일러 어댑터 설정은 해당 버전 README를 참고하세요. HuggingFace 통합은 `evoxc-hf`로 별도 배포됩니다.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
