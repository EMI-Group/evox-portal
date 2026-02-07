---
title: "다중 GPU 및 분산 워크플로우"
order: 8
section: "experimental"
---

# 다중 GPU 및 분산 워크플로우

EvoX는 분산 워크플로우에 대한 실험적 지원을 제공하여 일반적인 진화 알고리즘을 여러 GPU 또는 여러 머신에서 실행할 수 있습니다. 이는 특히 시간이 많이 소요되는 문제에 대해 최적화 프로세스를 크게 가속화할 수 있습니다.

## 사용 방법

분산 워크플로우를 사용하려면 몇 가지를 설정해야 합니다:
1. 난수 생성기의 시드를 수동으로 고정해야 합니다.
```python
torch.manual_seed(seed)
# 선택 사항: numpy의 시드 설정
np.random.seed(seed)
# 선택 사항: 결정적 알고리즘 사용
torch.use_deterministic_algorithms(True)
```
> **중요:**
> 모든 난수 생성기의 시드를 torch 또는 numpy 작업 **이전에** 설정해야 합니다. 이렇게 하면 작업이 수행되기 전에 난수 생성기가 알려진 상태에 있게 됩니다.
2. `torch.distributed` 또는 `torchrun` 명령을 사용하여 스크립트를 실행하세요. 예를 들어:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **팁:**
> `torchrun`은 분산 torch 프로그램을 실행하는 권장 방법입니다. 자세한 내용은 [PyTorch 문서](https://pytorch.org/docs/stable/elastic/run.html)를 참조하세요.
