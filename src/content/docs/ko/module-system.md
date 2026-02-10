---
title: "EvoX에서 Module 다루기"
order: 4
section: "developer"
---

# EvoX에서 Module 다루기

**모듈(Module)**은 특정 작업이나 일련의 관련 작업을 수행하도록 설계된 독립적인 코드 단위를 의미하는 프로그래밍의 기본 개념입니다.

이 노트북에서는 EvoX의 기본 모듈인 `ModuleBase`를 소개합니다.

## Module 소개

[튜토리얼](#/tutorial/index)에서 EvoX의 기본 실행 과정을 언급했습니다:

<center><b>알고리즘 및 문제 초기화 -- 모니터 설정 -- 워크플로우 초기화 -- 워크플로우 실행</b></center>

이 과정에는 EvoX의 네 가지 기본 클래스가 필요합니다:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


이들을 위한 통일된 모듈을 제공하는 것이 필요합니다. EvoX에서 이 네 가지 클래스는 모두 기본 모듈인 `ModuleBase`를 상속받습니다.

![Module base](/_static/modulebase.png)

## ModuleBase 클래스

`ModuleBase` 클래스는 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)을 상속받습니다.

이 클래스에는 많은 메서드가 있으며, 그중 중요한 메서드는 다음과 같습니다:

| 메서드 | 서명 (Signature) | 사용법 |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__` | `(self, ...)` | 모듈을 초기화합니다. |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | `state_dict`의 파라미터와 버퍼를 이 모듈과 하위 모듈로 복사합니다. 이는 [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)를 덮어씁니다(overwrite). |
| `add_mutable` | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | `self.[name]`을 통해 접근하고 제자리(in-place)에서 수정할 수 있는 가변(mutable) 값을 이 모듈에 정의합니다. |

## Module의 역할

EvoX에서 `ModuleBase`는 다음을 돕습니다:

- **가변 값 포함 (Contain mutable values)**

	이 모듈은 가변 값을 포함할 수 있는 객체 지향 모듈입니다.

- **함수형 프로그래밍 지원 (Support functional programming)**

	함수형 프로그래밍 모델은 `self.state_dict()`와 `self.load_state_dict(...)`를 통해 지원됩니다.

- **초기화 표준화 (Standardize the initialization)**:

	기본적으로, 이 모듈에 추가(ADDED)되어 나중에 멤버 메서드에서 접근하게 될 미리 정의된 서브모듈(들)은 "비정적(non-static) 멤버"로 취급해야 하며, 그 외의 멤버는 "정적(static) 멤버"로 취급해야 합니다.

	비정적 멤버에 대한 모듈 초기화는 `__init__`보다는 `setup`의 오버라이드된 메서드(또는 다른 멤버 메서드)에 작성하는 것을 권장합니다.

## Module 사용법

구체적으로, EvoX에서 `ModuleBase`를 사용할 때 몇 가지 규칙이 있습니다:

### 정적 메서드 (Static methods)

JIT 컴파일될 정적 메서드는 다음과 같이 정의해야 합니다:

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 비정적 메서드 (Non-static Methods)

`if`와 같은 Python 동적 제어 흐름이 포함된 메서드를 `vmap`과 함께 사용해야 하는 경우,
제어 흐름을 명시적으로 정의하기 위해 [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond)를 사용하십시오.