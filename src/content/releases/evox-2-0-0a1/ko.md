---
title: "EvoX v2.0.0a1: EvoX Compiler 기반 전면 재작성"
pubDate: 2026-10-30
summary: "새로운 함수형 API와 명시적 텐서 그래프 컴파일러를 도입한 실험적 알파 버전입니다. 프로덕션에는 안정적인 1.x 계열을 계속 권장합니다."
---

**EvoX v2.0.0a1**은 [EvoX Compiler(`evoxc`)](https://github.com/EMI-Group/evoxc)를 기반으로 완전히 재작성한 첫 알파 버전입니다.

> **실험적 사전 릴리스:** 새 API는 1.x와 호환되지 않으며 그대로 대체하여 업그레이드할 수 없습니다. 프로덕션에는 안정적인 1.x 계열을 계속 권장합니다. 알파는 별도 환경에서 사용해 보세요.

## 명시적 컴파일 파이프라인

EvoX Compiler는 텐서 그래프를 검사하고 변환할 수 있게 하며 추적, 그래프 변환, 하위 표현으로의 변환, 컴파일 및 실행을 분리합니다. `vectorize`/`vmap`, `grad`, `jvp`, `vjp`, `batch_functions`를 조합할 수 있고 NumPy, IREE, TVM, XLA/PJRT 백엔드를 지원합니다. StableHLO는 컴파일 백엔드의 공통 하위 표현 경계를 제공합니다.

EvoX 2.0은 PyTorch나 JAX에 의존하지 않습니다. EvoX Compiler의 필수 런타임 의존성은 NumPy뿐이며 컴파일 백엔드는 선택 사항입니다.

## 새로운 함수형 API

- 알고리즘은 `init(config, key)`와 `step(config, state, evaluate)`를 사용합니다.
- 문제는 `evaluate(config, state, candidates)`를 사용합니다.
- 설정은 불변이고 텐서 상태는 명시적이며 재현 가능한 PRNG 키로 난수를 관리합니다.
- `StdWorkflow`는 진화 단계를 추적하고 선택한 백엔드로 컴파일한 뒤 최적화 루프를 실행합니다.

## 첫 알파에 포함된 기능

- **32개 알고리즘 클래스**와 **15개 진화 연산자**.
- 기본 수치 벤치마크, DTLZ, CEC2022 및 가상 신경 진화.
- GD, IGD, 하이퍼볼륨 지표, Plotly 시각화 및 `.exv` 추적.
- 호스트 측 하이퍼파라미터 최적화와 `evox_ext`를 통한 확장 검색.

업스트림 릴리스는 **NumPy 백엔드에서 552개 테스트가 통과**했다고 보고합니다. 컴파일 백엔드나 GPU에 동일한 테스트 범위가 확보되었음을 뜻하지는 않습니다.

## 설치

**Python 3.11+**가 필요합니다. 별도 환경에서 한 가지 설치 방법을 선택하세요.

```bash
pip install --pre "evox==2.0.0a1"
```

선택적 컴파일러 지원을 추가하려면:

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## 현재 제한 사항

분산 워크플로, Brax/MuJoCo, PyTorch 신경망 통합 및 Triton 커널은 아직 이식되지 않았습니다. 컴파일 백엔드와 GPU 실행은 실험 단계이며 일부 연산자와 제어 흐름은 모든 백엔드에서 지원되지 않습니다. 모니터링, 시각화, 지표 및 HPO는 현재 컴파일된 그래프 밖에서 실행됩니다. 사전 릴리스 기간에 API가 변경될 수 있습니다.

버그 보고, 벤치마크 및 API 의견은 [GitHub Issues](https://github.com/EMI-Group/evox/issues)에 남겨주세요.

**릴리스**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
