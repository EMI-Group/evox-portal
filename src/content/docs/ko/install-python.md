---
title: "Python 설치 가이드"
order: 1
section: "install"
---

# Python 설치 가이드

이 가이드는 Python 프로그래밍 언어를 처음 접하고 시스템에 설치하려는 분들을 위한 것입니다.
EvoX를 실행하는 데 필요한 Python 환경을 설정하는 데 도움이 됩니다.

> **팁:**
> EvoX는 Python으로 작성되었으므로 시스템에 Python이 설치되어 있어야 합니다.
> EvoX는 Python 3.10 이상을 지원하며, **최신 버전**의 Python을 사용하는 것을 권장합니다.

## Python 인터프리터 설치

### Windows 버전

[Download Python](https://www.python.org/downloads/)으로 이동하여 최신 버전의 Python을 다운로드하세요.

> **참고:**
> 설치 과정에서 "Add Python to PATH" 체크박스를 선택해야 합니다.

### Linux 버전

Linux 배포판마다 Python을 설치하는 방법이 다릅니다.
배포판의 패키지 관리자에 따라 다릅니다.
몇 가지 예시:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### `uv`를 통한 설치

`uv`는 매우 빠른 Python 패키지 및 프로젝트 관리자로, Windows, Linux 및 MacOS에서 작동합니다.
Python 인터프리터 설치와 Python 환경 관리에 `uv`를 사용하는 것을 권장합니다.
자세한 설치 가이드는 [uv 설치 가이드](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)에서 찾을 수 있습니다.


### Windows
`irm`을 사용하여 스크립트를 다운로드하고 `iex`로 실행하세요:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```
[실행 정책](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)을 변경하면 인터넷에서 스크립트를 실행할 수 있습니다.

URL에 포함하여 특정 버전을 요청하세요:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux 및 MacOS
`curl`을 사용하여 스크립트를 다운로드하고 `sh`로 실행하세요:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

시스템에 `curl`이 없는 경우 `wget`을 사용할 수 있습니다:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

URL에 포함하여 특정 버전을 요청하세요:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Python 환경 관리

### Pip과 Venv

`pip`는 Python의 패키지 관리자입니다. `venv`는 Python에서 가상 환경을 만들기 위한 내장 도구입니다.
가상 환경은 특정 버전의 Python 설치와 여러 추가 패키지를 포함하는 독립적인 디렉토리입니다.
이는 서로 다른 프로젝트의 종속성을 별도로 관리하는 데 유용합니다.

가상 환경을 만들려면 터미널에서 다음 명령을 실행하세요:

```console
$ python -m venv <env_path> # 일반적으로 <env_path>는 프로젝트의 `.venv` 디렉토리입니다
```
이렇게 하면 Python 인터프리터와 표준 라이브러리의 복사본을 포함하는 `<env_path>`라는 새 디렉토리가 생성됩니다.
가상 환경을 활성화하려면 다음 명령을 실행하세요:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
이렇게 하면 셸 프롬프트가 변경되어 가상 환경 내에서 작업하고 있음을 나타냅니다.
가상 환경을 비활성화하려면 다음 명령을 실행하세요:

```console
$ deactivate
```
이렇게 하면 설치된 모든 라이브러리가 있는 시스템의 기본 Python 인터프리터로 돌아갑니다.
가상 환경이 활성화된 상태에서 `pip`를 사용하여 가상 환경에 패키지를 설치할 수 있습니다.
예를 들어, `numpy`의 최신 버전을 설치하려면 다음 명령을 실행하세요:

```console
$ pip install numpy
```
이렇게 하면 가상 환경에 `numpy`가 설치되며, 시스템 전체 Python 설치에는 영향을 미치지 않습니다.
`numpy`의 특정 버전을 설치하려면 다음 명령을 실행하세요:

```console
$ pip install numpy==1.23.4
```
이렇게 하면 가상 환경에 `numpy` 버전 `1.23.4`가 설치됩니다.
가상 환경에 설치된 모든 패키지를 나열하려면 다음 명령을 실행하세요:

```console
$ pip list
```
이렇게 하면 가상 환경에 설치된 모든 패키지와 버전 목록이 표시됩니다.
패키지를 제거하려면 다음 명령을 실행하세요:

```console
$ pip uninstall numpy
```
이렇게 하면 가상 환경에서 `numpy`가 제거됩니다.
패키지를 업그레이드하려면 다음 명령을 실행하세요:

```console
$ pip install --upgrade numpy
```
이렇게 하면 가상 환경에서 `numpy`가 최신 버전으로 업그레이드됩니다.

### uv

`uv`는 Python 버전뿐만 아니라 Python 환경도 관리할 수 있습니다.
새 Python 환경을 만들려면 다음 명령을 실행하세요:

```console
$ uv venv --python <python_version> # 예: 3.10, 3.11, ...
```
이렇게 하면 Python 인터프리터와 표준 라이브러리의 복사본을 포함하는 `.venv`라는 새 디렉토리가 생성됩니다.
가상 환경을 활성화하려면 다음 명령을 실행하세요:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

가상 환경을 활성화한 후 `uv pip`를 사용하여 가상 환경에 패키지를 설치할 수 있습니다.
예를 들어, `numpy`의 최신 버전을 설치하려면 다음 명령을 실행하세요:

```console
$ uv pip install numpy
```
