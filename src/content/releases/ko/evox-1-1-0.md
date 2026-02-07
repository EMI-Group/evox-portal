---
title: "EvoX 1.1 출시: torch.compile (TorchDynamo) 지원"
pubDate: 2025-03-01
summary: "EvoX 1.1은 torch.compile (TorchDynamo) 통합을 도입하여 TorchScript를 대체하고 호환성과 성능을 향상시킵니다."
---

**EvoX 1.1**의 출시를 기쁘게 알려드립니다. 백엔드 컴파일러로 **torch.compile (TorchDynamo)의 완전한 통합**을 도입합니다! 이번 업데이트는 기존의 TorchScript 접근 방식을 대체하여, EvoX를 **더 사용자 친화적이고 더 넓은 Python 생태계와 높은 호환성**을 갖추게 합니다.

**torch.compile**을 활용하여, EvoX는 이제 런타임에 동적으로 계산 그래프를 캡처하며, 수동 트레이싱의 필요성을 제거하면서 자동으로 성능을 최적화합니다.

**새로운 기능**

**torch.compile: 더 스마트하고 유연한 컴파일**

EvoX 1.1에서는 새로운 컴파일 백엔드로 **torch.compile**을 완전히 채택합니다. 이전의 트레이싱 기반 접근 방식과 달리, **내부적으로 TorchDynamo를 사용하는** torch.compile은 Python 실행을 가로채고, 동적으로 계산 그래프를 추출하며, 실시간으로 최적화합니다.

이는 다음을 의미합니다:

l  **더 이상 수동 트레이싱이 필요 없습니다** -- **torch.compile(workflow.step)**을 호출하기만 하면, EvoX가 나머지를 처리합니다.

l  **원활한 Python 호환성** -- 네이티브 Python 함수와 NumPy, SciPy와 같은 외부 라이브러리와 함께 작동합니다.

l  **더 나은 성능** -- 최적화된 계산 그래프로 **더 빠른 실행과 더 나은 하드웨어 활용**을 달성합니다.

l  **미래 지향적 설계** -- PyTorch의 로드맵에 맞추어 장기적인 호환성과 성능 향상을 보장합니다.

**왜 TorchScript에서 torch.compile로 전환했는가?**

이전 버전에서 EvoX는 **트레이싱 기반 방법**에 의존했습니다:

l  **1.0.0 이전**에는 계산 그래프 추출을 위해 **JAX 트레이싱**을 사용했습니다.

l  **v1.0.0**에서는 **TorchScript**로 전환하여 PyTorch 통합을 강화했습니다.

그러나 이러한 방법에는 여러 단점이 있었습니다:

l  **사용이 복잡** -- 사용자가 수동으로 그래프를 트레이싱하고 복잡한 디버깅을 처리해야 했습니다.

l  **제한된 호환성** -- 동적 워크플로와 비 PyTorch 함수에서 어려움을 겪었습니다.

l  **제한된 유연성** -- 루프, 조건문 및 기타 Python 구문이 항상 올바르게 캡처되지 않았습니다.

torch.compile과 **TorchDynamo**를 통해 **이러한 문제가 해결되었습니다**. EvoX는 이제 동적으로 최적화하며, **사용자의 추가 노력 없이** 더 넓은 범위의 워크플로를 지원합니다.

**EvoX 1.1이 여러분의 작업을 더 쉽게 만드는 방법**

l  **더 이상 트레이싱의 번거로움이 없습니다** -- 모든 것이 백그라운드에서 처리되어, 코드가 더 깔끔하고 유지보수가 쉬워집니다.

l  **기존 Python 코드와 함께 작동** -- 호환성을 위해 워크플로를 수정할 필요가 없습니다.

l  **더 빠른 실행, 더 나은 확장성** -- GPU 및 TPU를 위한 PyTorch의 최신 최적화의 혜택을 받습니다.

l  **미래 대비** -- PyTorch의 장기적인 진화에 맞추어 지속적인 성능 향상을 보장합니다.

**지금 EvoX 1.1로 업그레이드하세요!**

EvoX 1.1이 공식 출시되었습니다! 오늘 업그레이드하여 **더 스마트하고, 더 빠르며, 더 직관적인** 계산 워크플로를 경험하세요.

**EvoX 1.1 받기**: [GitHub](https://github.com/EMI-Group/EvoX)

질문이나 피드백이 있으신가요? GitHub에서 이슈를 열거나 커뮤니티 토론에 참여해 주세요. **함께 계산 지능의 한계를 넓혀 나갑시다!**

**소스 코드 / 커뮤니티 / 문서**

논문: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

문서: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ 그룹: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
