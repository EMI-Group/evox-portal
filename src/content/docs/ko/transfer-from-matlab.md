---
title: "MATLAB에서 PyTorch 및 EvoX로의 전환"
order: 18
section: "misc"
---

# MATLAB에서 PyTorch 및 EvoX로의 전환

이 문서는 MATLAB 사용자가 진화 연산(evolutionary computation)을 위해 PyTorch와 EvoX로 전환하는 것을 돕기 위해 작성되었습니다. 구문(syntax), 데이터 구조, 워크플로우 측면에서 MATLAB과 PyTorch의 핵심적인 차이점을 강조할 것입니다. 그 후 MATLAB과 PyTorch 양쪽에서 입자 군집 최적화(Particle Swarm Optimization, PSO) 예제를 사용하여 이러한 차이점을 설명하겠습니다.

## 구문 차이 (Syntax Differences)

### 배열 생성 및 인덱싱 (Array Creation and Indexing)

#### MATLAB

- 1부터 시작하는 인덱싱(1-based indexing)을 사용합니다.
- 벡터와 행렬은 대괄호와 세미콜론을 사용하여 선언합니다(예: `[1 2 3; 4 5 6]`). `rand()`를 사용한 무작위 초기화는 $[0, 1)$ 구간의 값을 반환합니다.
- 슬라이싱은 `(start:end)` 구문을 사용하며 1부터 시작하는 인덱싱을 따릅니다.

#### PyTorch

- 0부터 시작하는 인덱싱(0-based indexing)을 사용합니다.
- 배열(텐서)은 일반적으로 `torch.rand()`, `torch.zeros()`와 같은 생성자나 `torch.tensor()`를 사용하여 Python 리스트를 변환하여 생성합니다.
- 슬라이싱은 0부터 시작하는 인덱스를 사용하여 `[start:end]`로 수행합니다.

### 행렬 연산 (Matrix Computation)

#### MATLAB

- `*`를 사용하여 선형 대수 행렬 곱셈을 수행합니다.
- 같은 크기의 행렬의 대응하는 요소를 곱하려면 `.*`를 사용합니다.
- `/`는 행렬 우측 나눗셈(matrix right division)을 나타냅니다.
- `.^`는 요소별 거듭제곱(element-wise power)을 나타냅니다.
- 길이가 1인 텐서의 선행 및 후행 차원은 **무시**됩니다.
- 요소별 연산에 대해 브로드캐스팅 가능한 차원을 자동으로 찾고 **암시적** 차원 확장을 수행합니다.

#### PyTorch

- `@` 또는 `torch.matmul()`을 사용하여 선형 대수 행렬 곱셈을 수행합니다.
- 같은 형태(shape)이거나 브로드캐스팅 가능한 형태의 텐서에 대해 대응하는 요소를 곱할 때 `*`를 직접 사용합니다.
- `/`는 요소별 나눗셈을 나타냅니다.
- `**`는 요소별 거듭제곱을 나타냅니다.
- 길이가 1인 텐서의 차원은 **보존**되며 **브로드캐스트 차원**으로 취급됩니다.
- 대부분의 암시적 차원 확장을 **방지**하며, 일반적으로 브로드캐스트 차원이 필요합니다.

### 함수 및 정의 (Functions and Definitions)

#### MATLAB

- 함수는 `function` 키워드로 정의됩니다.
- 파일 하나에 여러 함수를 포함할 수 있지만, 일반적으로 주 함수는 파일 이름과 동일합니다.
- 익명 함수(예: `@(x) sum(x.^2)`)는 짧은 인라인 계산에 사용됩니다.

#### PyTorch

- 함수는 `def` 키워드를 사용하여 정의되며, 일반적으로 단일 `.py` 파일이나 모듈 내에 있습니다.
- 클래스는 객체 지향 방식으로 데이터와 메서드를 캡슐화하는 데 사용됩니다.
- 람다(Lambda)는 짧은 익명 함수(`lambda x: x.sum()`) 역할을 하지만, 여러 줄의 람다는 허용되지 않습니다.

### 제어 흐름 (Control Flow)

#### MATLAB

- 1부터 시작하는 인덱싱으로 `for i = 1:N` ... `end` 루프를 사용합니다.
- `if`, `elseif`, `else`와 같은 조건문을 사용합니다.

#### PyTorch

- 0부터 시작하는 인덱싱으로 `for i in range(N):`을 사용합니다.
- 루프와 조건문의 범위 지정에 들여쓰기가 중요합니다(`end` 키워드 없음).

### 출력 및 주석 (Printing and Comments)

#### MATLAB

- 서식 있는 출력을 위해 `fprintf()` 함수를 사용합니다.
- 한 줄 주석에는 `%`를 사용합니다.

#### PyTorch

- 서식 있는 출력을 위해 f-string과 함께 `print`를 사용합니다.
- 한 줄 주석에는 `#`을 사용합니다.

### 여러 줄 코딩 (Multi-line Coding)

#### MATLAB

- 줄 끝에 `...`를 사용하여 다음 줄이 같은 줄로 처리되도록 나타냅니다.
#### Python

- 줄 끝에 `\`를 사용하여 다음 줄이 같은 줄로 처리되도록 나타냅니다.
- 괄호 안에 여러 줄이 있는 경우, 특정 기호가 필요하지 않습니다.

## EvoX를 사용하여 진화 연산 알고리즘을 작성하는 방법?

### MATLAB

PSO 알고리즘에 대한 MATLAB 코드 예제는 다음과 같습니다:
```matlab
function [] = example_pso()
    pso = init_pso(100, [-10, -10], [10, 10], 0.6, 2.5, 0.8);
    test_fn = @(x) (sum(x .* x, 2));
    for i = 1:20
        pso = step_pso(pso, test_fn);
        fprintf("Iteration = %d, global best = %f\n", i, pso.global_best_fitness);
    end
end


function [self] = init_pso(pop_size, lb, ub, w, phi_p, phi_g)
    self = struct();
    self.pop_size = pop_size;
    self.dim = length(lb);
    self.w = w;
    self.phi_p = phi_p;
    self.phi_g = phi_g;
    % setup
    range = ub - lb;
    population = rand(self.pop_size, self.dim);
    population = range .* population + lb;
    velocity = rand(self.pop_size, self.dim);
    velocity = 2 .* range .* velocity - range;
    self.lb = lb;
    self.ub = ub;
    % mutable
    self.population = population;
    self.velocity = velocity;
    self.local_best_location = population;
    self.local_best_fitness = Inf(self.pop_size, 1);
    self.global_best_location = population(1, :);
    self.global_best_fitness = Inf;
end


function [self] = step_pso(self, evaluate)
    % Evaluate
    fitness = evaluate(self.population);
    % Update the local best
    compare = find(self.local_best_fitness > fitness);
    self.local_best_location(compare, :) = self.population(compare, :);
    self.local_best_fitness(compare) = fitness(compare);
    % Update the global best
    values = [self.global_best_location; self.population];
    keys = [self.global_best_fitness; fitness];
    [min_val, min_index] = min(keys);
    self.global_best_location = values(min_index, :);
    self.global_best_fitness = min_val;
    % Update velocity and position
    rg = rand(self.pop_size, self.dim);
    rp = rand(self.pop_size, self.dim);
    velocity = self.w .* self.velocity ...
        + self.phi_p .* rp .* (self.local_best_location - self.population) ...
        + self.phi_g .* rg .* (self.global_best_location - self.population);
    population = self.population + velocity;
    self.population = min(max(population, self.lb), self.ub);
    self.velocity = min(max(velocity, self.lb), self.ub);
end
```
MATLAB에서는 `init_pso()` 함수가 알고리즘을 초기화하고, 별도의 `step_pso()` 함수가 반복 단계를 수행하며, 메인 함수 `example_pso()`가 루프를 조정합니다.

### EvoX
EvoX에서는 다음과 같은 방식으로 PSO 알고리즘을 구성할 수 있습니다:

먼저, EvoX와 PyTorch에서 필요한 모듈과 함수를 가져오는(import) 것이 좋습니다.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

그런 다음 "구문 차이" 섹션에 따라 MATLAB 코드를 그에 상응하는 Python 코드로 변환할 수 있습니다.
```python
def main():
    pso = PSO(pop_size=10, lb=torch.tensor([-10.0, -10.0]), ub=torch.tensor([10.0, 10.0]))
    wf = StdWorkflow()
    wf.setup(algorithm=pso, problem=Sphere())
    for i in range(1, 21):
        wf.step()
        print(f"Iteration = {i}, global best = {wf.algorithm.global_best_fitness}")

@jit_class
class PSO(Algorithm):
    def __init__(self, pop_size, lb, ub, w=0.6, phi_p=2.5, phi_g=0.8):
        super().__init__()
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = w
        self.phi_p = phi_p
        self.phi_g = phi_g
        # setup
        lb = lb.unsqueeze(0)
        ub = ub.unsqueeze(0)
        range = ub - lb
        population = torch.rand(self.pop_size, self.dim)
        population = range * population + lb
        velocity = torch.rand(self.pop_size, self.dim)
        velocity = 2 * range * velocity - range
        self.lb = lb
        self.ub = ub
        # mutable
        self.population = population
        self.velocity = velocity
        self.local_best_location = population
        self.local_best_fitness = torch.full((self.pop_size,), fill_value=torch.inf)
        self.global_best_location = population[0, :]
        self.global_best_fitness = torch.tensor(torch.inf)

    def step(self):
        # Evaluate
        fitness = self.evaluate(self.population)
        # Update the local best
        compare = self.local_best_fitness > fitness
        self.local_best_location = torch.where(compare.unsqueeze(1), self.population, self.local_best_location)
        self.local_best_fitness = torch.where(compare, fitness, self.local_best_fitness)
        # Update the global best
        values = torch.cat([self.global_best_location.unsqueeze(0), self.population], dim=0)
        keys = torch.cat([self.global_best_fitness.unsqueeze(0), fitness], dim=0)
        min_index = torch.argmin(keys)
        self.global_best_location = values[min_index]
        self.global_best_fitness = keys[min_index]
        # Update velocity and position
        rg = torch.rand(self.pop_size, self.dim)
        rp = torch.rand(self.pop_size, self.dim)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)


# Run the main function
if __name__ == "__main__":
    main()
```

> **참고:**
> MATLAB에서는 행렬과 벡터를 특정 차원을 따라 연결하기 위해 `;`와 `,`가 포함된 `[]`를 사용하지만, EvoX에서는 `torch.cat`을 호출할 때 연결 차원을 나타내는 `dim` 인수를 사용해야 한다는 점에 유의해야 합니다.
> 또한 PyTorch에서는 연결할 텐서들의 차원 수가 같아야 합니다. 따라서 첫 번째 차원 앞에 길이가 1인 새로운 차원을 추가하기 위해 `XXX.unsqueeze(0)`이 추가로 적용됩니다.

EvoX에서 PSO 로직은 `Algorithm`을 상속하는 클래스 내에 캡슐화됩니다. 이러한 객체 지향 설계는 상태 관리와 반복을 단순화하며 다음과 같은 이점을 제공합니다:
- 상속된 `evaluate()` 메서드
    매 반복마다 목적 함수를 수동으로 전달하는 대신, `self.evaluate(self.population)`을 호출하여 적합도(fitness) 값을 간단히 계산할 수 있습니다.
- 내장 워크플로우 통합
    PSO 클래스를 `StdWorkflow` 워크플로우에 등록하면, 워크플로우가 사용자를 대신하여 `step()`을 반복적으로 호출합니다.

`Algorithm`을 확장함으로써, `__init__()`는 표준 Python 클래스 생성자에서 모든 주요 PSO 구성 요소(개체군, 속도, 로컬/글로벌 베스트 등)를 설정합니다.