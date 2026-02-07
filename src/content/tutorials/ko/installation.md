---
title: "2. 설치 및 환경 설정"
order: 2
---

# 2. 설치 및 환경 설정

EvoX를 사용하기 전에 소프트웨어와 그 종속성을 올바르게 설치해야 합니다. 이 장에서는 Windows와 Linux 모두에 대한 설치 단계와 필요한 종속성을 준비하고 구성하는 방법을 다룹니다. 설치 전에 기본 시스템 요구 사항을 충족하는지 확인하세요: **Python 3.10+**, 충분한 디스크 공간, 그리고 선택적으로 적절한 드라이버가 설치된 지원 GPU.

## 종속성 및 준비 사항

- **Python 환경**: EvoX는 Python 기반으로 구축되었으므로 Python 3.10 이상이 설치되어 있는지 확인하세요. 종속성 충돌을 피하기 위해 가상 환경(`venv` 등)을 사용하는 것이 좋습니다.

- **PyTorch**: EvoX는 텐서 연산과 하드웨어 가속을 위해 PyTorch를 사용합니다. 따라서 **EvoX를 설치하기 전에 PyTorch를 설치해야 합니다**. 하드웨어에 따라 버전을 선택하세요: NVIDIA GPU가 있으면 CUDA 버전을, AMD GPU는 ROCm 버전을, GPU가 없으면 CPU 버전을 설치하세요. 적절한 명령어는 [공식 PyTorch 가이드](https://pytorch.org)를 참조하세요. 예를 들어:

  ```bash
  # NVIDIA GPU용 (CUDA)
  pip install torch torchvision torchaudio

  # AMD GPU용 (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # CPU 전용
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

설치 전에 `pip`를 최신 버전으로 업데이트하고 안정적인 인터넷 연결을 확보하는 것이 좋습니다(패키지가 PyPI에서 다운로드됩니다). 환경이 준비되면 EvoX를 설치할 수 있습니다.

### Windows에서 설치

Windows 사용자는 **자동 스크립트 설치** 또는 **수동 설치**를 선택할 수 있습니다. 공식 원클릭 설치 프로그램은 깨끗한 환경에서 EvoX와 그 종속성을 쉽게 설정할 수 있는 방법을 제공하지만, 수동 설치는 더 많은 제어를 허용합니다.

**옵션 1: 원클릭 설치 스크립트 사용 (win-install.bat)**
EvoX는 Windows 10/11(64비트)용 [빠른 설치 스크립트](/_static/win-install.bat)를 제공합니다. 이 스크립트는 Miniforge3(경량 Conda), Python, PyTorch(CUDA 포함), EvoX, 그리고 VSCode와 Git 같은 유용한 도구를 설치합니다. 사용 방법:

1. EvoX 문서 또는 GitHub에서 `win-install.bat`을 다운로드하세요. [NVIDIA 드라이버](https://www.nvidia.com/en-us/drivers/)가 설치되어 있고 안정적인 인터넷 연결이 있는지 확인하세요.
2. 스크립트를 실행하세요. 관리자 권한이 필요하지 않지만 실행 중 권한을 요청할 수 있습니다. 허용하세요. 스크립트가 모든 것을 자동으로 설치하고 구성합니다.
3. 완료를 기다리세요. 성공하면 메시지가 표시되고 VSCode가 열릴 수 있습니다. EvoX와 그 종속성이 설치됩니다.

> **참고**: 네트워크 문제로 스크립트가 실패하면 닫고 다시 실행하세요. 실패 시 재개를 지원합니다.

**옵션 2: 수동 설치**
EvoX를 수동으로 설치하려면:

1. **GPU 드라이버 설치**: [공식 웹사이트](https://www.nvidia.cn/Download/index.aspx)에서 최신 NVIDIA 드라이버를 설치하세요. 전용 GPU가 없으면 이 단계를 건너뛰세요.

2. **Python 설치**: [Windows용 Python 3.10+](https://www.python.org/downloads/windows/)를 다운로드하고 설치 중 "Add Python to PATH"를 활성화하세요.

3. **PyTorch 설치**: CMD 또는 PowerShell을 열고 하드웨어에 따라 PyTorch를 설치하세요:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(선택 사항) Triton 컴파일러 설치**: Windows의 PyTorch에는 Triton 지원이 없습니다. `torch.compile`(PyTorch 2.0에서 사용 가능)을 사용하려면 서드파티 [triton-windows](https://github.com/woct0rdho/triton-windows)를 설치하세요. 선택 사항이지만 성능 최적화에 유용합니다.

5. **EvoX 설치**:

   ```bash
   pip install "evox[default]"

   # 선택적 추가 기능:
   pip install "evox[vis]"           # 시각화 지원
   pip install "evox[neuroevolution]" # 신경진화 지원
   ```


  `> **참고:**
> 일부 패키지는 추가 시스템 종속성이 필요할 수 있습니다. 이 경우 설치 프로그램이 다음과 같은 메시지를 표시합니다:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  이러한 메시지가 나타나면 제공된 지침에 따라 필요한 종속성을 설치한 후 진행하세요.
  ````


### Linux에서 설치

Linux(예: Ubuntu)에서 EvoX를 설치하는 것은 간단하며 대부분 `pip`를 통해 처리됩니다.

1. **시스템 종속성 설치**: 기본 개발 도구와 Python 3.10+가 설치되어 있는지 확인하세요. 패키지 관리자(apt, yum) 또는 Anaconda를 사용할 수 있습니다.

2. **GPU 드라이버 설치** (GPU 사용 시): 적절한 패키지 관리자(예: `apt`)를 사용하여 NVIDIA 드라이버를 설치하세요. `nvidia-smi`로 설치를 확인하세요. CPU를 사용하는 경우 건너뛰세요.

> **참고:**
> WSL에서는 Linux 서브시스템 내부에 NVIDIA 드라이버를 설치하지 **마세요**. Windows 측에서 설치하세요.

> **팁:**
> 드라이버만 설치하면 되며 CUDA나 기타 종속성은 설치할 필요가 없을 가능성이 높습니다.
> 이러한 라이브러리는 이미 pip를 통한 PyTorch 설치에 포함되어 있습니다.

> **팁:**
> 필요한 드라이버 버전은 하드웨어에 따라 다릅니다. 최신 NVIDIA GPU를 사용하는 경우 최신 드라이버 버전을 사용하는 것이 가장 좋은 선택인 경우가 많습니다.
> 더 나은 호환성과 최신 드라이버에 대한 접근을 보장하려면 일반적으로 더 새로운 Linux 배포판을 사용하는 것이 좋습니다(예: 22.04 대신 Ubuntu 25.04).

1. **PyTorch 설치**: Windows와 마찬가지로 하드웨어에 따라 설치하세요. [PyTorch 공식 가이드](https://pytorch.org)를 참조하세요.

2. **EvoX 설치**:

   ```bash
   pip install evox
   ```

   또는 추가 기능과 함께:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   이렇게 하면 시각화 모듈과 신경진화 종속성(Brax 등)이 설치됩니다. `vis` 또는 `neuroevolution`과 같은 개별 추가 기능을 선택할 수도 있습니다.

#### 컨테이너 설치 (Docker, Podman)

AMD GPU 사용자나 환경 격리를 원하는 사용자에게는 Docker가 권장됩니다. 예를 들어, ROCm이 포함된 공식 PyTorch Docker 이미지를 사용하는 경우:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

컨테이너 내부에서 평소처럼 `pip`를 사용하여 EvoX를 설치하세요.

## EvoX 설치 확인

EvoX가 올바르게 설치되었는지 확인하려면:

- **기본 확인**: 터미널 또는 Python 셸에서 실행하세요:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  이렇게 하면 PyTorch 및 시스템 구성 정보가 출력됩니다. EvoX가 오류 없이 임포트되면 설치가 성공한 것입니다. 버전도 확인할 수 있습니다:

  ```python
  import evox
  print(evox.__version__)
  ```

- **선택적 설정**: 다음과 같은 성능 관련 설정을 조정할 수 있습니다:

  - `OMP_NUM_THREADS`와 같은 환경 변수를 설정하여 CPU 스레드 수 제어
  - `--shm-size`로 Docker 공유 메모리 증가
  - IDE(Jupyter, PyCharm 등)가 올바른 Python 환경을 사용하는지 확인

설정이 완료되면 EvoX로 최적화를 시작할 준비가 된 것입니다.
