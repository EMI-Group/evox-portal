---
title: "EvoX 1.1 출시: 이제 torch.compile (TorchDynamo) 지원"
pubDate: 2025-03-01
summary: "EvoX 1.1은 TorchScript를 torch.compile로 교체하고 TorchDynamo로 Python 실행 중 계산 그래프를 캡처합니다."
---

## 컴파일 백엔드 업데이트

EvoX 1.1은 TorchScript를 `torch.compile`로 교체하고 TorchDynamo로 Python 실행 중 계산 그래프를 캡처합니다.

## 워크플로 컴파일

워크플로 단계를 컴파일하여 지원되는 텐서 연산을 PyTorch 컴파일러에서 함께 최적화할 수 있습니다.

## 호환성

그래프 캡처는 사용한 연산과 제어 흐름에 따라 달라집니다. 지원되지 않는 코드는 그래프 중단을 일으킬 수 있으며 모든 Python 라이브러리 호출이 컴파일되는 것은 아닙니다.

## 관련 자료

- [GitHub](https://github.com/EMI-Group/evox)
- [문서](https://evox.readthedocs.io/en/latest/)
