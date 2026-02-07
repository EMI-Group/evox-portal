---
title: "EvoX 설치 가이드"
order: 2
section: "install"
---

# EvoX 설치 가이드

## EvoX 설치

EvoX는 PyPI에서 사용할 수 있으며 다음을 통해 설치할 수 있습니다:

```bash
# 먼저 pytorch를 설치하세요
# 예:
pip install torch

# 그런 다음 EvoX를 설치하세요
pip install "evox[default]"
```

설치 중 추가 옵션을 지정할 수도 있습니다. 현재 사용 가능한 추가 기능은 `vis`, `neuroevolution`, `test`, `docs`, `default`입니다. 예를 들어, 모든 기능이 포함된 EvoX를 설치하려면 다음 명령을 실행하세요:

```bash
pip install "evox[vis,neuroevolution]"
```

## 가속기 지원이 포함된 PyTorch 설치

`evox`는 하드웨어 가속을 제공하기 위해 `torch`에 의존합니다.
이러한 Python 패키지의 전체 아키텍처는 다음과 같습니다:

```{mermaid}
stateDiagram-v2
    torch : torch
    nv_gpu : NVIDIA GPU
    amd_gpu : AMD GPU
    cpu : CPU

    direction LR

    evox --> torch
    torch --> nv_gpu
    torch --> amd_gpu
    torch --> cpu
```

요약하면, `evox`가 CPU 지원 또는 Nvidia GPU 지원(CUDA) 또는 AMD GPU 지원(ROCm)을 가지는지는 설치된 PyTorch 버전에 따라 다릅니다. 자세한 설치 도움말은 PyTorch 공식 웹사이트를 참조하세요: [`torch`](https://pytorch.org/)


## Windows에서의 Nvidia GPU 지원

EvoX는 PyTorch를 통해 GPU 가속을 지원합니다.
Windows에서 GPU 가속이 포함된 PyTorch를 사용하는 두 가지 방법이 있습니다:

1. WSL 2(Windows Subsystem for Linux)를 사용하고 Linux 측에 PyTorch를 설치합니다.
2. Windows에 직접 PyTorch를 설치합니다.

옵션 2의 경우, Nvidia GPU가 있는 새로 설치된 Windows 10/11 64비트에서 빠른 배포를 위한 [원클릭 스크립트](/_static/win-install.bat)를 제공합니다. 이 스크립트는 WSL 2를 사용하지 않으며 Windows에 네이티브 Pytorch 버전을 설치합니다. VSCode, Git 및 MiniForge3와 같은 관련 애플리케이션을 자동으로 설치합니다.

* 먼저 [Nvidia 드라이버](https://www.nvidia.com/Download/index.aspx?lang=en-us)가 올바르게 설치되어 있는지 확인하세요. 그렇지 않으면 스크립트가 CPU 모드로 대체됩니다.
* 스크립트를 실행할 때 안정적인 네트워크(`github.com` 등에 접근 가능)를 확보하세요.
* 네트워크 장애로 스크립트가 실패하면 닫고 다시 열어 설치를 계속하세요.

### Windows에서 수동 설치

Windows에서 PyTorch를 수동으로 직접 설치하려면 아래 단계를 따르세요:
1. 위에서 언급한 대로 Nvidia 드라이버를 설치하세요.
2. [python.org](https://www.python.org/downloads/)에서 Python 3.10 이상을 설치하세요.
3. PyTorch를 설치하세요.
4. (선택 사항) Windows에서 `torch.compile` 지원을 위해 [`triton-windows`](https://github.com/woct0rdho/triton-windows)를 설치하세요.
5. EvoX를 설치하세요.

### Windows WSL 2

[최신 NVIDIA Windows GPU 드라이버](https://www.nvidia.com/Download/index.aspx?lang=en-us)를 다운로드하고 설치하세요. 그러면 WSL 2가 Linux 환경에서 Nvidia GPU를 지원합니다.

> **경고:**
> WSL 2 내에서 NVIDIA GPU Linux 드라이버를 설치하지 **마세요**. Windows 측에서 드라이버를 설치하세요.

```{seealso}
NVIDIA에는 자세한 [CUDA on WSL 사용자 가이드](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)가 있습니다.
```

## AMD GPU (ROCm) 지원

[`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch)의 Docker 컨테이너를 사용하는 것을 권장합니다.

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## 설치 확인

Python 터미널을 열고 다음을 실행하세요:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
