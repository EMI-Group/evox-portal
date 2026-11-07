---
title: "EvoX 시작하기: 첫 진화 워크플로 구성"
pubDate: 2025-04-30
updatedDate: 2026-11-07
summary: "EvoX 1.4.1 실험을 완성하고 문제, 개체군, 평가, 실행이 재사용 가능한 진화 워크플로를 구성하는 방식을 익힙니다."
---

*2026년 11월 7일 업데이트. 과거 결과는 원래 기록 시점을 기준으로 합니다.*

진화 워크플로는 목표를 후보, 평가, 연속적인 개선에 연결합니다. 이 튜토리얼은 작은 실행 가능한 실험으로 기반을 소개합니다. 같은 구성 요소의 경계를 나중에 다른 문제, 알고리즘, 평가 예산으로 확장할 수 있습니다.

PSO로 2차원 Ackley 함수를 최소화하고 실행 장치와 탐색 기록을 확인합니다. **EvoX 1.4.1 및 PyTorch**용 예제로, 실험적인 2.x 컴파일러 API와 다릅니다. 작은 과제는 흐름을 배우기 위한 것이며 GPU 성능 벤치마크가 아닙니다.

## 독립 환경 준비

Python 3.10 이상에서 가상 환경을 만든 뒤 셸에 맞는 명령으로 활성화하세요.

```bash
python -m venv .venv
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## 맞는 패키지 설치

운영체제와 하드웨어에 맞는 명령을 [PyTorch 공식 설치 페이지](https://pytorch.org/get-started/locally/)에서 선택하세요. CUDA 패키지에는 지원 드라이버가 필요하며 EvoX 설치만으로 GPU 사용이 보장되지는 않습니다. 이어서 지정 버전을 설치하세요.

```bash
python -m pip install "evox[vis]==1.4.1"
```

## 완전한 실험 실행

다음을 Python 스크립트로 저장하세요. CUDA가 있으면 GPU, 아니면 CPU를 선택하고 실제 장치를 출력합니다. 알고리즘 상태와 모니터링은 선택한 장치에 둡니다. 고정 시드는 재실험을 돕지만 장치나 소프트웨어 버전에 따라 결과가 다를 수 있습니다.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## 결과 해석과 시각화

PSO는 후보 벡터를 유지하고 Ackley는 평가하며 StdWorkflow는 연결하고 EvalMonitor는 진행을 기록합니다. 적합도는 작을수록 좋고 이론적 최적값은 원점에서 0입니다. 결과는 확률적이므로 고정 점수를 약속하지 않습니다.

탐색 후 같은 프로세스에서 다음을 실행하세요. 시각화 의존성은 설치 명령에 포함됩니다. 이미지는 기존 튜토리얼의 예시로, 이 시드의 보장된 출력이 아닙니다.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## 목적을 정해 실험 확장

차원, 개체군 크기, 시드를 하나씩 바꾸세요. 사용자 문제는 후보마다 목적값을 반환해야 합니다. 다목적 최적화에는 호환 알고리즘, 목적값 형태, 모니터 설정도 필요하므로 매개변수 하나만 바꾸어서는 부족합니다.

측정에서는 컴파일과 워밍업을 정상 실행과 구분하고 CUDA를 동기화하며 같은 평가 예산으로 비교하세요. 작은 과제는 CPU가 더 빠를 수 있습니다. 기준선을 먼저 실행한 뒤 컴파일을 검토하세요.

## 자료와 감사의 말

기존 튜토리얼은 Boqing Xu, Xinmeng Yu, Bowen Zheng, Xinyao Li가 작성하고 Beichen Huang이 편집 및 공개했습니다. 아래에 기존 개요 그림을 유지했습니다.

![EvoX overview](./quickstart-8.png)

이 예제는 [버전별 소스](https://github.com/EMI-Group/evox/tree/v1.4.1)를 기준으로 하며 추가 자료는 [문서](https://evox.readthedocs.io/en/latest/)에서 확인하세요. 최신 자료의 API를 복사하기 전 해당 버전을 확인하세요.
