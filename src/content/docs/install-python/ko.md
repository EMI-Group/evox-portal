---
title: "Python 설치 가이드"
order: 1
section: "install"
---

# Python 설치 가이드

이 가이드는 Python 프로그래밍 언어를 처음 접하고 시스템에 설치하려는 분들을 위한 것입니다.
EvoX를 실행하는 데 필요한 Python 환경을 설정하는 데 도움이 될 것입니다.

> **Tip:**
> EvoX는 Python으로 작성되었으므로 시스템에 Python이 설치되어 있어야 합니다.
> EvoX는 Python 3.10 이상을 지원하며, **최신 버전**의 Python을 사용하는 것을 권장합니다.

## Python 인터프리터 설치

### Windows 버전

[Download Python](https://www.python.org/downloads/)으로 이동하여 최신 버전의 Python을 다운로드하세요.

> **Note:**
> 설치 과정에서 "Add Python to PATH" 체크박스를 반드시 선택하세요.

### Linux 버전

Linux 배포판마다 Python 설치 방법이 다릅니다.
배포판의 패키지 관리자에 따라 다릅니다.
몇 가지 예시는 다음과 같습니다:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### `uv`를 통한 설치

`uv`는 Windows, Linux, MacOS에서 작동하는 매우 빠른 Python 패키지 및 프로젝트 관리자입니다.
Python 인터프리터 설치 및 Python 환경 관리에 `uv`를 사용하는 것을 권장합니다.
자세한 설치 가이드는 [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)에서 확인할 수 있습니다.


### Windows
`irm`을 사용하여 스크립트를 다운로드하고 `iex`로 실행하세요:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

[execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)를 변경하면 인터넷에서 스크립트를 실행할 수 있습니다.

URL에 버전을 포함하여 특정 버전을 요청할 수 있습니다:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux 및 MacOS
`curl`을 사용하여 스크립트를 다운로드하고 `sh`로 실행하세요:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

시스템에 `curl`이 없다면 `wget`을 사용할 수 있습니다:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

URL에 버전을 포함하여 특정 버전을 요청할 수 있습니다:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Python 환경 관리

### Pip 및 Venv

`pip`는 Python의 패키지 관리자입니다. `venv`는 Python에서 가상 환경을 생성하기 위한 내장 도구입니다.
가상 환경은 특정 버전의 Python 설치와 몇 가지 추가 패키지를 포함하는 독립적인 디렉터리입니다.
이는 서로 다른 프로젝트의 의존성을 개별적으로 관리하는 데 유용합니다.

가상 환경을 생성하려면 터미널에서 다음 명령어를 실행하세요:

```console
$ python -m venv <env_path> # usually <env_path> is a `.venv` directory in your project
```
이 명령은 Python 인터프리터와 표준 라이브러리의 복사본이 포함된 `<env_path>`라는 새 디렉터리를 생성합니다.
가상 환경을 활성화하려면 다음 명령어를 실행하세요:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
이 명령을 실행하면 쉘 프롬프트가 변경되어 현재 가상 환경 내부에서 작업 중임을 나타냅니다.
가상 환경을 비활성화하려면 다음 명령어를 실행하세요:

```console
$ deactivate
```
이 명령을 실행하면 설치된 모든 라이브러리가 포함된 시스템의 기본 Python 인터프리터로 돌아갑니다.

가상 환경이 활성화된 상태에서 `pip`를 사용하여 가상 환경에 패키지를 설치할 수 있습니다.
예를 들어, 최신 버전의 `numpy`를 설치하려면 다음 명령어를 실행하세요:

```console
$ pip install numpy
```
이 명령은 `numpy`를 가상 환경에 설치하며, 시스템 전체의 Python 설치에는 영향을 미치지 않습니다.
특정 버전의 `numpy`를 설치하려면 다음 명령어를 실행하세요:

```console
$ pip install numpy==1.23.4
```
이 명령은 `numpy`의 `1.23.4` 버전을 가상 환경에 설치합니다.
가상 환경에 설치된 모든 패키지를 나열하려면 다음 명령어를 실행하세요:

```console
$ pip list
```
이 명령은 가상 환경에 설치된 모든 패키지 목록과 버전을 보여줍니다.
패키지를 제거하려면 다음 명령어를 실행하세요:

```console
$ pip uninstall numpy
```
이 명령은 가상 환경에서 `numpy`를 제거합니다.
패키지를 업그레이드하려면 다음 명령어를 실행하세요:

```console
$ pip install --upgrade numpy
```
이 명령은 가상 환경 내의 `numpy`를 최신 버전으로 업그레이드합니다.

### uv

`uv`는 Python 버전뿐만 아니라 Python 환경도 관리할 수 있습니다.
새로운 Python 환경을 생성하려면 다음 명령어를 실행하세요:

```console
$ uv venv --python <python_version> # e.g. 3.10, 3.11, ...
```
이 명령은 Python 인터프리터와 표준 라이브러리의 복사본이 포함된 `.venv`라는 새 디렉터리를 생성합니다.
가상 환경을 활성화하려면 다음 명령어를 실행하세요:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

가상 환경을 활성화한 후, `uv pip`를 사용하여 가상 환경에 패키지를 설치할 수 있습니다.
예를 들어, 최신 버전의 `numpy`를 설치하려면 다음 명령어를 실행하세요:

```console
$ uv pip install numpy
```