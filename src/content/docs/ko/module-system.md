---
title: "EvoX에서 모듈 작업하기"
order: 4
section: "developer"
---

# EvoX에서 모듈 작업하기

**모듈**은 프로그래밍에서 특정 작업 또는 관련 작업 집합을 수행하도록 설계된 독립적인 코드 단위를 의미하는 기본 개념입니다.

이 노트북에서는 EvoX의 기본 모듈인 `ModuleBase`를 소개합니다.

## 모듈 소개

[튜토리얼](#/tutorial/index)에서 EvoX의 기본 실행 프로세스를 언급했습니다:

<center><b>알고리즘과 문제 초기화 -- 모니터 설정 -- 워크플로우 초기화 -- 워크플로우 실행</b></center>

이 프로세스에는 EvoX의 네 가지 기본 클래스가 필요합니다:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


이들을 위한 통합 모듈을 제공할 필요가 있습니다. EvoX에서 네 가지 클래스는 모두 기본 모듈인 `ModuleBase`에서 상속됩니다.

![Module base](/_static/modulebase.png)

## ModuleBase 클래스

`ModuleBase` 클래스는 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)에서 상속됩니다.

이 클래스에는 많은 메서드가 있으며, 중요한 메서드는 다음과 같습니다:

| 메서드            | 시그니처                                                    | 용도                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | 모듈을 초기화합니다.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | `state_dict`의 파라미터와 버퍼를 이 모듈과 그 하위 모듈에 복사합니다. [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)를 오버라이드합니다. |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | 이 모듈에서 `self.[name]`을 통해 접근하고 인플레이스로 수정할 수 있는 가변 값을 정의합니다. |

## 모듈의 역할

EvoX에서 `ModuleBase`는 다음을 도울 수 있습니다:

- **가변 값 포함**

	이 모듈은 가변 값을 포함할 수 있는 객체 지향 모듈입니다.

- **함수형 프로그래밍 지원**

	`self.state_dict()` 및 `self.load_state_dict(...)`를 통해 함수형 프로그래밍 모델이 지원됩니다.

- **초기화 표준화**:

	기본적으로, 이 모듈에 추가되고 나중에 멤버 메서드에서 접근할 사전 정의된 하위 모듈은 "비정적 멤버"로 취급해야 하며, 다른 멤버는 "정적 멤버"로 취급해야 합니다.

	비정적 멤버의 모듈 초기화는 `__init__`이 아닌 오버라이드된 `setup` 메서드(또는 다른 멤버 메서드)에서 작성하는 것이 좋습니다.

## 모듈 사용법

구체적으로, EvoX에서 `ModuleBase`를 사용하기 위한 몇 가지 규칙이 있습니다:

### 정적 메서드

JIT될 정적 메서드는 다음과 같이 정의해야 합니다:

```Python
# 모듈에서 정의된 정적 메서드의 예

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 비정적 메서드

`if`와 같은 Python 동적 제어 흐름이 있는 메서드를 `vmap`과 함께 사용하려면,
[`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond)를 사용하여 제어 흐름을 명시적으로 정의하세요.
