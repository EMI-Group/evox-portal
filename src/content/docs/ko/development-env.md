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
pip install -e ".[test]" # 테스트 종속성과 함께 편집 가능 모드로 패키지 설치
```

## Nix

다음 명령을 실행하여 Nix 환경을 활성화하세요:
```bash
nix develop .
```
이렇게 하면 필요한 모든 종속성과 Python 환경이 포함된 `.venv` 디렉토리가 있는 셸이 생성됩니다.

## 스타일 가이드

EvoX의 스타일 가이드는 다음과 같습니다:
1. [ruff](https://docs.astral.sh/ruff/)를 사용하여 코드를 린트하세요.
2. 후행 공백이 없는지 확인하세요.

## Pre-commit

스타일 가이드를 적용하기 위해 [pre-commit](https://pre-commit.com/)을 사용하는 것을 권장합니다.
pre-commit을 설치한 후 다음 명령을 실행하여 로컬 저장소에 훅을 설치하세요:
```bash
pre-commit install
```

## 단위 테스트 실행

1. Python 환경에 필요한 패키지(예: `torch`)를 설치하여 테스트 환경을 준비하세요.
2. unittest를 실행하세요:
```shell
# 모든 테스트 실행
python -m unittest
# [path]의 테스트 실행, 예: python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# 특정 테스트 메서드 또는 모듈 실행, 예: python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
