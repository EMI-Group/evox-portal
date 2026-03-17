---
title: "개발 환경"
order: 3
section: "developer"
---

# 개발 환경

## 저장소 클론 및 편집 가능 모드로 설치 (권장)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

다음 명령어를 실행하여 Nix 환경을 활성화하세요:
```bash
nix develop .
```
이 작업은 필요한 모든 의존성을 갖춘 쉘과 Python 환경이 포함된 `.venv` 디렉토리를 생성합니다.

## 스타일 가이드

EvoX에는 다음과 같은 스타일 가이드가 있습니다:
1. 코드를 린트(lint)하기 위해 반드시 [ruff](https://docs.astral.sh/ruff/)를 사용하세요.
2. 후행 공백(trailing whitespaces)이 없는지 확인하세요.

## Pre-commit

스타일 가이드를 준수하기 위해 [pre-commit](https://pre-commit.com/) 사용을 권장합니다.
Pre-commit을 설치한 후, 다음 명령어를 실행하여 로컬 저장소에 훅(hook)을 설치하세요:
```bash
pre-commit install
```

## 단위 테스트 실행

1. Python 환경에 필요한 패키지(예: `torch`)를 설치하여 테스트 환경을 준비합니다.
2. unittest 실행:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```