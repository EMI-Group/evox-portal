---
title: "Non-NVIDIA GPU 사용하기"
order: 16
section: "misc"
---

# Non-NVIDIA GPU 사용하기

이 가이드는 EvoX 환경에서 PyTorch와 함께 AMD GPU 및 Apple Silicon GPU를 사용하는 방법을 설명합니다.

NVIDIA GPU는 신뢰할 수 있는 선택이며 일반적으로 강력한 성능을 제공하지만, 최신 모델들은 딥러닝 워크로드와 대규모 언어 모델(LLM)에 최적화되어 있습니다. 저정밀도 데이터 타입 지원과 같은 많은 고급 기능들은 현재 EvoX에서 충분히 활용되지 않고 있습니다. 경우에 따라 Non-NVIDIA GPU가 진화 연산 작업에서 더 나은 성능과 비용 효율성을 제공할 수 있습니다.

## AMD GPU 지원

PyTorch에서의 AMD GPU 지원은 ROCm을 통해 제공됩니다. AMD 장치는 (NVIDIA GPU와 마찬가지로) `cuda` 장치로 인식됩니다. AMD GPU를 사용하려면:

1. ROCm 호환 버전의 PyTorch를 설치합니다.
2. 표준 장치 설정을 사용합니다 (예: `device = torch.device("cuda")`).

ROCm 빌드를 사용하는 것 외에 추가적인 변경은 필요하지 않습니다.

## Apple Silicon GPU 지원

Apple Silicon Mac을 소유하고 있다면, 내장 GPU를 활용하여 EvoX 워크로드를 가속화할 수 있습니다.
Apple Silicon GPU는 Metal Performance Shaders (MPS) 백엔드를 통해 지원되며, PyTorch에서 `mps` 장치를 사용하여 접근할 수 있습니다.

Apple Silicon GPU를 사용하려면:

1. MPS 호환 버전의 PyTorch가 설치되어 있는지 확인합니다.
2. 텐서와 모델을 `mps` 장치로 이동합니다 (예: `device = torch.device("mps")`).

> **참고:**
> `mps` 장치는 컴파일(예: `#evox.compile`)을 지원하지 **않습니다**.