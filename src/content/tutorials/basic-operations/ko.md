---
title: "3. 기본 작업"
order: 3
---

# 3. 기본 작업

이 장에서는 첫 번째 EvoX 최적화 작업을 실행하는 과정을 안내합니다. 여기에는 **EvoX 시작** 및 **최적화 프로세스 초기화** 방법, **EvoX 프로젝트 구성** 방법(알고리즘 및 문제 선택과 조립), 그리고 최적화 프로세스를 제어하는 데 자주 사용되는 **기본 명령어**(또는 메서드)가 포함됩니다. 간단한 예제를 통해 EvoX의 기본적인 사용법을 배우게 될 것입니다.

## 시작 및 초기화

설치를 확인한 후, EvoX를 사용하여 최적화 스크립트 작성을 시작할 수 있습니다. 터미널, Jupyter Notebook, IDE 등 모든 Python 환경에서 EvoX를 가져올(import) 수 있습니다.

먼저 EvoX와 관련 모듈을 가져오고, 간단한 최적화 작업을 초기화해 보겠습니다. 예를 들어, 입자 군집 최적화(Particle Swarm Optimization, PSO) 알고리즘을 사용하여 고전적인 Ackley 함수를 최적화할 것입니다. Ackley 함수는 \((0,0,\dots,0)\)에 알려진 전역 최적해(global optimum)가 있는 일반적인 벤치마크 함수로, 시연에 적합합니다.
다음은 최적화를 시작하고 실행하는 방법을 보여주는 최소한의 EvoX 예제 코드입니다:

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

위의 코드는 다음 단계들을 포함합니다:
- 먼저 PSO 알고리즘의 매개변수를 설정합니다: 개체군 크기(population size)는 50, 검색 공간은 [-32, 32] 범위의 2차원입니다.
- 그다음 Ackley 문제를 정의합니다(Ackley 함수는 기본적으로 2차원으로 정의됩니다).
- 알고리즘과 문제를 **조립(assemble)**하는 표준 워크플로우 `StdWorkflow`를 생성하고, 최적화 과정 데이터를 기록하기 위해 모니터 `EvalMonitor`를 전달합니다.
- 다음으로 `workflow.init_step()`을 사용하여 초기화 과정을 완료합니다. 이는 개체군, 랜덤 시드 및 기타 내부 상태를 자동으로 초기화합니다.
- 그 후, `workflow.step()`을 사용하여 100번의 반복(iteration)을 연속적으로 실행하는 루프를 돌립니다. `step()`이 호출될 때마다 알고리즘은 새로운 해를 생성하고 적합도(fitness)를 평가하여 최적해에 지속적으로 접근합니다.
- 마지막으로 모니터가 제공하는 `get_min_fitness()` 메서드를 사용하여 반복 과정 중 얻은 최고의 적합도 값을 가져와 출력합니다.

이 스크립트를 실행하면 다음과 같은 최적화 반복 출력을 볼 수 있습니다:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

루프 내에서 중간 결과를 명시적으로 출력하지 않았으므로 중간 결과는 표시되지 않습니다. 하지만 최종 적합도 값을 통해 알고리즘이 수렴했는지 판단할 수 있습니다. 예를 들어, Ackley 함수의 최적값은 0이며, 출력이 0에 가깝다면 PSO가 전역 최적해에 가까운 해를 찾았음을 의미합니다. 또한 `print(monitor.history)`를 호출하여 모니터에 기록된 이력 데이터를 확인하거나, `monitor.plot()`을 사용하여 수렴 곡선을 그릴 수 있습니다(Plotly와 같은 시각화 지원 필요).

> **참고:**
> `StdWorkflow`는 EvoX에서 제공하는 **표준 최적화 프로세스** 캡슐화입니다. 이는 전통적인 진화 알고리즘의 '초기화-반복 업데이트' 로직을 내부적으로 구현하고, 알고리즘과 문제 간의 상호 작용을 캡슐화합니다. 대부분의 간단한 애플리케이션에서는 `StdWorkflow`를 직접 사용하는 것으로 충분합니다. `EvalMonitor`는 최적화 과정 중 성능 지표를 수집하고 표시하기 위해 `get_best_fitness()` 및 `plot()`과 같은 메서드를 구현한 모니터입니다. 초보자는 이를 나중에 분석하기 위해 각 반복의 최고 결과를 기록하는 기록장 정도로 이해하면 됩니다.

위의 예제에서 우리는 알고리즘 선택, 문제 정의, 워크플로우 조립을 포함한 EvoX 프로젝트의 기본 구성을 생성했습니다. 일반적으로 EvoX 프로젝트를 구성하는 단계는 다음과 같습니다:

1.  **최적화 문제 선택/정의**: 해결하려는 최적화 문제가 무엇인지 명확히 합니다. 예를 들어 수학 함수를 최적화하는 경우, EvoX는 `evox.problems` 모듈 아래에 직접 사용할 수 있는 많은 **내장 문제**(예: Sphere, Rastrigin, Ackley와 같은 고전 함수)를 제공합니다. 문제가 내장 기능으로 해결되지 않는 경우, 직접 정의할 수 있습니다(이후 장에서 다룸). 문제를 구성할 때는 보통 **결정 변수의 차원**과 **값의 범위**를 알아야 합니다.

2.  **최적화 알고리즘 선택/구성**: 문제 유형에 따라 적절한 진화 알고리즘을 선택합니다. EvoX는 `evox.algorithms` 아래에 단일 목적 알고리즘(PSO, GA, CMA-ES 등)과 다목적 알고리즘(NSGA-II, RVEA 등)을 포함한 풍부한 알고리즘 세트를 제공합니다. 알고리즘을 선택한 후에는 일반적으로 개체군 크기(`pop_size`) 및 알고리즘별 매개변수(예: GA의 교차 확률 및 돌연변이 확률)를 설정해야 합니다. 대부분의 알고리즘은 개체군을 초기화하기 위해 **변수 범위**(하한 `lb` 및 상한 `ub`)와 문제 차원을 필요로 합니다. 다목적 알고리즘을 사용하는 경우 목적 함수의 수(`n_objs`)도 지정해야 합니다. EvoX의 알고리즘은 일반적인 하이퍼파라미터에 대해 기본값을 제공하는 경우가 많지만, 초보자는 더 나은 성능을 위해 작업에 따라 이러한 매개변수를 조정하는 것을 고려해야 합니다.

3.  **워크플로우 조립**: 알고리즘과 문제 인스턴스가 준비되면, 이를 전체 최적화 프로세스 제어를 나타내는 워크플로우로 '조립'해야 합니다. EvoX에서는 일반적으로 `StdWorkflow`를 사용하여 알고리즘과 문제를 결합합니다. 최적화 진행 상황을 모니터링하려면 워크플로우에 모니터(예: `EvalMonitor`)를 추가할 수 있습니다. 모니터는 필수 사항은 아니지만, 디버깅 및 분석 중에 매우 유용할 수 있습니다. 워크플로우 조립은 보통 `workflow = StdWorkflow(algo, prob, monitor)`와 같이 한 줄의 코드로 이루어집니다.

4.  **초기화**: 워크플로우의 초기화 메서드를 호출하여 최적화를 시작합니다. 최신 버전의 EvoX는 한 번의 호출로 초기화 과정을 완료하는 편리한 `StdWorkflow.init_step()` 메서드를 제공합니다.

5.  **반복 실행**: 루프를 사용하여 `workflow.step()`을 반복적으로 호출함으로써 진화 과정을 진행합니다. 각 호출은 알고리즘 내부의 '새로운 해 생성 -> 평가 -> 선택'과 같은 단계를 포함하여 한 번의 반복을 수행합니다. 반복 중에 모니터를 사용하여 몇 세대마다 현재 최고의 적합도를 출력하는 등 실시간 결과를 관찰할 수 있습니다. 종료 기준은 필요에 따라 설정할 수 있습니다. 일반적인 기준으로는 고정된 세대 수(예: 100세대 실행) 또는 모니터링된 지표가 수렴할 때 중지(예: 여러 세대 동안 유의미한 개선이 없음)하는 것 등이 있습니다.

6.  **결과 획득**: 반복이 끝나면 알고리즘에서 최종 결과(예: 최적해 및 그 목적 함수 값)를 추출해야 합니다. EvoX에서는 일반적으로 모니터를 통해 이를 얻습니다. 예를 들어, `EvalMonitor.get_best_fitness()`는 최고의 적합도 값을 반환합니다. 최적해 벡터를 얻으려면 문제 객체가 평가 중에 최고의 후보를 저장하게 하거나 모니터의 인터페이스를 사용하는 방법이 있습니다. EvoX의 표준 구현에서 `EvalMonitor`는 각 세대의 최고 개체와 적합도를 기록하며, 속성을 통해 접근할 수 있습니다. `monitor.history`에 이력이 저장된다고 가정하면, 마지막 세대에서 최고의 개체를 가져올 수 있습니다. 물론 `EvalMonitor`를 건너뛰고 루프 후에 알고리즘 객체에 직접 쿼리할 수도 있습니다. 이는 알고리즘 구현에 따라 다릅니다. 사용자 정의 알고리즘이 `get_best()`를 구현하거나 상태에 최고 개체를 저장하는 경우, 이를 직접 추출할 수 있습니다. 하지만 EvoX는 순수 함수와 모듈성을 강조하므로, 결과는 보통 모니터링 모듈을 통해 접근합니다.

이 단계들을 따르면 최적화 작업 코드를 명확하게 구조화할 수 있습니다. 초보자에게는 **알고리즘-문제-워크플로우**의 3요소가 어떻게 함께 작동하는지 이해하는 것이 중요합니다. 알고리즘은 해를 생성하고 개선하며, 문제는 그 품질을 평가하고, 워크플로우는 이들을 반복 루프로 연결합니다.

다음으로, 최적화 프로세스에 대한 이해를 돕기 위해 EvoX에서 사용할 수 있는 몇 가지 기본 명령어와 함수 호출을 소개하겠습니다.

## 기본 명령어 개요

EvoX를 사용할 때 익숙해져야 할 '명령어' 역할을 하는 **자주 사용되는 메서드와 함수**들이 있습니다:

### 워크플로우 관련 메서드

- **`StdWorkflow.init_step()`**: 초기화. 이는 최적화 프로세스를 시작하기 위한 빠른 시작 명령어로, 주로 스크립트 시작 부분에서 사용됩니다. 알고리즘과 문제 모두에 대한 초기화 로직을 호출하고, 초기 개체군을 생성하며, 적합도를 평가합니다. 이 과정이 끝나면 워크플로우는 초기 상태를 갖추고 반복할 준비가 됩니다.

- **`StdWorkflow.step()`**: 최적화를 한 단계 진행합니다. 각 호출은 알고리즘이 현재 개체군 상태를 기반으로 새로운 후보 해를 생성하고, 이를 평가한 뒤 다음 세대를 선택하게 합니다. 사용자는 일반적으로 루프 내에서 이를 여러 번 호출합니다. `step()` 함수는 보통 아무것도 반환하지 않지만(내부 상태가 워크플로우 내에서 업데이트됨), 이전 버전에서는 새로운 상태를 반환했을 수 있습니다. 초보자는 반환 값에 신경 쓰지 않고 단순히 호출하면 됩니다.

### 모니터 관련 메서드

`EvalMonitor`를 예로 들면, 일반적인 메서드는 다음과 같습니다:

- `EvalMonitor.get_best_fitness()`: 기록된 가장 낮은 적합도(최소화 문제의 경우) 또는 가장 높은 적합도(최대화 문제의 경우; 모니터가 보통 이를 구별함)를 반환합니다. 현재 최고의 결과를 파악하는 데 유용합니다.
- `EvalMonitor.get_history()` 또는 `monitor.history`: 각 세대의 최고 값과 같은 전체 이력을 가져옵니다. 수렴 추세를 분석하는 데 유용합니다.
- `EvalMonitor.plot()`: 수렴 또는 성능 곡선을 그립니다. 그래픽 환경이나 Notebook이 필요합니다. 모니터는 보통 Plotly를 사용하여 그래프를 렌더링하므로 알고리즘 성능을 시각적으로 평가하는 데 도움이 됩니다.
  내부적으로 모니터는 각 세대의 평가 횟수와 결과를 기록합니다. 일반적으로 개입할 필요 없이 필요할 때 데이터를 추출하기만 하면 됩니다.

### 알고리즘 관련 메서드

- `Algorithm.__init__()` 메서드: 알고리즘의 초기화 메서드입니다. 변수는 보통 `evox.core.Mutable()`로, 하이퍼파라미터는 `evox.core.Parameter()`로 래핑됩니다.

- `Algorithm.step()` 메서드: 특정 시나리오나 사용자 정의 알고리즘/문제를 사용할 때 알고리즘의 `step()` 메서드를 직접 호출할 수 있으며, 이는 일반적으로 알고리즘의 전체 반복 로직을 캡슐화합니다.

- `Algorithm.init_step()` 메서드: `init_step()` 메서드는 알고리즘의 첫 번째 반복을 포함합니다. 재정의(override)되지 않으면 단순히 `step()` 메서드를 호출합니다. 일반적인 경우 첫 번째 반복은 다른 반복과 다르지 않으므로 많은 알고리즘이 사용자 정의 `init_step()`을 필요로 하지 않을 수 있습니다. 하지만 하이퍼파라미터 튜닝과 관련된 알고리즘의 경우, 여기서 하이퍼파라미터나 관련 변수를 업데이트해야 할 수도 있습니다.

### 장치 및 병렬 제어

- `.to(device)` 메서드: 프로그램에서 계산 장치를 전환해야 하는 경우, PyTorch의 `.to(device)` 메서드를 사용하여 텐서(`torch.Tensor`)를 GPU/CPU로 이동시킵니다(`torch.randn`과 같은 일부 PyTorch 메서드도 장치 지정이 필요함). 일반적으로 `torch.set_default_device()`를 사용하여 장치를 `cuda:0`으로 설정하면(시스템이 지원하고 EvoX 및 종속성이 올바르게 설치되었다고 가정 - `torch.cuda.is_available()`로 확인), 대부분의 EvoX 고성능 병렬 계산이 자동으로 GPU에서 실행됩니다. 사용자 정의 알고리즘, 문제 또는 모니터를 작성할 때 새로운 텐서를 생성하거나 장치에 민감한 PyTorch 메서드를 사용하는 경우, 계산이 여러 장치에 분산되어 성능이 저하되는 것을 방지하기 위해 `device`를 `cuda:0`으로 명시적으로 지정하거나 `torch.get_default_device()`를 사용하는 것이 좋습니다.

초보자의 경우 위의 메서드만으로도 일반적인 최적화 작업을 처리하기에 충분합니다. 요약하자면: **문제/알고리즘 초기화 – 모니터 설정 – 워크플로우 조립 – 실행 및 결과 회수**가 가장 일반적인 EvoX 워크플로우입니다. 이것들을 마스터하면 EvoX를 사용하여 기본적인 최적화 작업을 수행할 수 있습니다.

다음 장으로 넘어가기 전에 예제를 수정해 보세요. PSO를 다른 알고리즘으로 바꾸거나, Ackley 함수를 다른 테스트 함수로 교체하거나, 모니터를 사용하여 더 많은 정보를 추출해 보는 것입니다. 이는 EvoX 프로젝트 구성의 유연성을 이해하는 데 도움이 될 것입니다.