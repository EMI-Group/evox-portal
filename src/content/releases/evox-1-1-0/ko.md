---
title: "EvoX 1.1 출시: 이제 torch.compile (TorchDynamo) 지원"
pubDate: 2025-03-01
summary: "EvoX 1.1은 완전한 torch.compile (TorchDynamo) 통합을 도입하여, 호환성과 성능 향상을 위해 TorchScript를 대체합니다."
---

**EvoX 1.1**의 출시를 알리게 되어 기쁩니다. 이번 버전에서는 백엔드 컴파일러로 **torch.compile (TorchDynamo)의 완전한 통합**을 도입했습니다! 이번 업데이트는 기존의 TorchScript 방식을 대체하여, EvoX를 **더욱 사용자 친화적이고 광범위한 Python 생태계와 높은 호환성**을 갖도록 만듭니다.

**torch.compile**을 활용함으로써, EvoX는 이제 런타임에 계산 그래프를 동적으로 캡처하여 수동 트레이싱(tracing)의 필요성을 없애고 성능을 자동으로 최적화합니다.

**새로운 기능은 무엇인가요?**

**torch.compile: 더 똑똑하고 유연한 컴파일**

EvoX 1.1에서는 **torch.compile**을 새로운 컴파일 백엔드로 전면 채택했습니다. 기존의 트레이싱 기반 방식과 달리, **내부적으로 TorchDynamo를 사용하는** torch.compile은 Python 실행을 가로채고, 계산 그래프를 동적으로 추출하여 실시간으로 최적화합니다.

이것이 의미하는 바는 다음과 같습니다:

- **더 이상 수동 트레이싱 불필요** -- **torch.compile(workflow.step)**만 호출하면 나머지는 EvoX가 처리합니다.

- **매끄러운 Python 호환성** -- 네이티브 Python 함수 및 NumPy, SciPy와 같은 외부 라이브러리와 함께 작동합니다.

- **더 나은 성능** -- 최적화된 계산 그래프는 **더 빠른 실행 속도와 더 나은 하드웨어 활용**을 제공합니다.

- **미래 지향적 설계** -- PyTorch의 로드맵에 맞춰 장기적인 호환성과 성능 향상을 보장합니다.

**왜 TorchScript에서 torch.compile로 전환했나요?**

이전 버전에서 EvoX는 **트레이싱 기반 방식**에 의존했습니다:

- **1.0.0 이전**에는 계산 그래프 추출을 위해 **JAX tracing**을 사용했습니다.

- **v1.0.0**에서는 PyTorch 통합을 강화하기 위해 **TorchScript**로 전환했습니다.

그러나 이러한 방식에는 몇 가지 단점이 있었습니다:

- **사용의 복잡성** -- 사용자가 수동으로 그래프를 추적(trace)하고 복잡한 디버깅을 처리해야 했습니다.

- **제한된 호환성** -- 동적 워크플로우나 비 PyTorch 함수를 처리하는 데 어려움이 있었습니다.

- **제한된 유연성** -- 루프, 조건문 및 기타 Python 구조가 항상 올바르게 캡처되지는 않았습니다.

torch.compile과 **TorchDynamo** 덕분에 **이러한 문제들이 사라졌습니다**. EvoX는 이제 동적으로 최적화를 수행하며, **사용자의 추가 노력 없이** 더 광범위한 워크플로우를 지원합니다.

**EvoX 1.1이 여러분의 작업을 어떻게 간편하게 만드나요?**

- **트레이싱의 번거로움 제거** -- 모든 작업이 백그라운드에서 이루어지므로 코드가 더 깔끔하고 유지 관리가 쉬워집니다.

- **기존 Python 코드와 호환** -- 호환성을 위해 워크플로우를 수정할 필요가 없습니다.

- **더 빠른 실행, 더 나은 확장성** -- GPU 및 TPU에 대한 PyTorch의 최신 최적화 기능을 활용할 수 있습니다.

- **미래 준비** -- PyTorch의 장기적인 발전 방향과 일치하여 지속적인 성능 향상을 보장합니다.

**지금 EvoX 1.1로 업그레이드하세요!**

EvoX 1.1이 공식 출시되었습니다! 오늘 업그레이드하여 **더 똑똑하고, 더 빠르고, 더 직관적인** 계산 워크플로우를 경험해 보세요.

**EvoX 1.1 받기**: [GitHub](https://github.com/EMI-Group/EvoX)

질문이나 피드백이 있으신가요? GitHub에 이슈를 등록하거나 커뮤니티 토론에 참여해 주세요. 함께 **계산 지능(Computational Intelligence)**의 한계를 넓혀봅시다!

**소스 코드 / 커뮤니티 / 문서**

논문: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

문서: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ 그룹: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)