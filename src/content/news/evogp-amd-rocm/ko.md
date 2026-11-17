---
title: "EvoGP: 트리 기반 프로그램 탐색을 AMD GPU로"
pubDate: 2026-06-18
updatedDate: 2026-11-17
summary: "백엔드별 컴파일 설정과 스레드 전용 인터프리터 스택 수정을 통해 ROCm이 EvoGP의 PyTorch 확장을 AMD 하드웨어에 연결합니다."
---

AMD GPU를 사용하는 연구자도 별도 탐색 엔진을 유지하지 않고 EvoGP의 트리 기반 유전 프로그래밍을 사용할 수 있습니다. 2026년 6월 17일 UTC(베이징 시간 6월 18일)에 병합된 [PR #12][s2]는 ROCm/HIP 경로를 추가합니다. 확장 빌드뿐 아니라 실행되는 각 프로그램의 의미를 보존하는 변경입니다.

![서로 다른 가속기 보드 위의 동일한 프로그램 트리](./rocm-backend.webp)

*개념 삽화: 같은 프로그램 표현이 GPU 백엔드 경계를 넘습니다.*

## CUDA와 ROCm의 공통 소스

6월 통합은 PyTorch의 빌드 시 HIP 변환으로 CUDA 확장 소스를 AMD용으로 컴파일합니다. 백엔드별 옵션을 선택하고 CUDA 전용 헤더를 보호해 HIP 빌드가 깨지지 않게 합니다. ROCm PyTorch로 별도 알고리즘 구현 없이 확장을 만들 수 있습니다.

트리 인터프리터의 동적 장치 스택 할당도 고정 크기 로컬 배열로 바뀝니다. 기여자는 AMD 오류를 동시에 상주한 wavefront 간 할당 별칭 문제로 추적했습니다. 다른 스레드의 임시 상태를 쓰면 적합도와 후속 선택이 잘못되므로 스레드별 스택 분리는 중요합니다.

## 커널 소스 변환만으로 끝나지 않는 빌드

PyTorch의 HIP 변환은 CUDA 소스를 바꾸지만 컴파일 인수는 장치 컴파일러에 그대로 전달됩니다. NVIDIA용 옵션을 `hipcc`에 바로 넘길 수는 없습니다. 변경된 설정은 CUDA 인수 목록을 유지하고 ROCm에서는 `-O3`를 사용하며 CUDA 전용 헤더도 별도로 보호합니다. ROCm PyTorch가 변환 경로를 제공하더라도 EvoGP의 빌드 설정을 맞춰야 합니다.[빌드 변경][s2]

## 백엔드에 맞는 빌드 환경

[소스 설치 지침][s3]은 적합한 GPU 도구, C++ 컴파일러, 호환 PyTorch를 요구합니다. AMD에서는 `hipcc`가 포함된 ROCm과 ROCm PyTorch를 사용하고 `--no-build-isolation`으로 설치된 PyTorch 환경에서 확장을 빌드합니다.

ROCm에서도 예제는 `cuda` 장치 문자열을 유지합니다. 이것이 PyTorch 인터페이스입니다. 특정 AMD 아키텍처는 `PYTORCH_ROCM_ARCH`로 선택합니다. 이는 빌드 설정이며 트리 표현이나 진화 연산자를 다시 작성할 필요는 없습니다.

## 검증한 백엔드에서 같은 탐색 실행

기여자는 MI250X, W7800, RX 9070 XT, PRO V710에서 기호 회귀를 검증했다고 보고하며 PR에 OS와 ROCm 버전을 명시합니다. 1,000개체, 100세대, 고정 시드를 사용한 해당 구성의 보고 결과이지 하드웨어 전반의 성능 보장은 아닙니다.

```bash
python -m evogp.sr_test
```

기호 회귀 실험에서는 먼저 확장 빌드와 소규모 회귀 검사가 유한한 적합도로 완료되는지 확인합니다. 기여자의 검사는 wave32와 wave64 장치를 포함하며 고정 시드 궤적 일치를 보고합니다. 새로운 일반적 가속 주장은 아닙니다. 자체 하드웨어를 비교할 때도 데이터셋, 개체군, 시드를 유지하세요. [EvoGP 소개][related]는 프로그램 표현을 설명하고, 이후의 [개체군 보고 수정][logging]은 별도의 세대 실행 비용을 다룹니다.

[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/5538d75470ee0fa444ee6bbe5ea98b2eed6e99f8/README.md
[related]: /ko/news/evogp
[logging]: /ko/news/evogp-rocm-population-execution
