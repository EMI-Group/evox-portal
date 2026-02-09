---
title: "문서 작성 가이드"
order: 7
section: "developer"
---

# 문서 작성 가이드

이 가이드는 코드베이스와 보조 파일 전반의 문서를 작성하고 유지 관리하는 모범 사례를 설명합니다.

---

## 코드 내 문서화 (Docstrings)

Docstring은 코드의 목적, 사용법, 동작을 이해하는 데 필수적입니다. 다음 규칙을 준수해 주십시오:

### 일반 규칙

- Docstring을 사용하여 **모든 공개(public) 클래스, 메서드, 함수**를 문서화하십시오.
- **Sphinx 스타일** docstring을 사용하십시오.
- Docstring에 매개변수 타입을 포함하지 **마십시오**. 타입은 타입 힌트(type hints)를 사용하여 함수 서명(signature)에 선언해야 합니다.

### 형식 및 지시어

다양한 요소를 설명하기 위해 다음 지시어를 사용하십시오:

- `:param <name>:` — 매개변수를 설명합니다.
- `:return:` — 반환 값을 설명합니다.
- `:raises <exception>:` — 함수가 발생시킬 수 있는 예외를 설명합니다.

#### 예시

```python
def add(a: int, b: int) -> int:
    """
    Add two integers.

    :param a: The first integer.
    :param b: The second integer.
    :return: The sum of the two integers.
    :raises ValueError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise ValueError("Inputs must be integers.")
    return a + b
```

---

## 외부 문서 (`docs/` 디렉토리)

모든 프로젝트 수준 문서는 `docs/` 디렉토리에 위치합니다. 이 문서들은 가이드, 예제 및 참조를 제공하여 사용자와 개발자 모두를 지원합니다.

### 형식

- 문서화에는 **Markdown (`.md`)** 또는 **Jupyter Notebooks (`.ipynb`)**를 사용하십시오.
- 서술형 콘텐츠 및 정적 문서에는 Markdown을 권장합니다.
- 실행 가능한 대화형 콘텐츠(예: 튜토리얼 또는 데모)에는 Jupyter Notebooks를 사용하십시오.

### Jupyter Notebook 가이드라인

- 모든 노트북이 **완전히 실행 가능한지** 확인하십시오.
- 커밋하기 전에 항상 **모든 셀을 실행**하고 **출력을 저장**하십시오.
- CI/CD 환경은 **GPU 실행을 지원하지 않으므로**, 노트북은 로컬에서 미리 실행되어야 합니다.

### Markdown 및 Notebook 지시어

풍부한 서식을 위해 다음 패턴을 사용하십시오:

- `[name](#ref)` — 내부 상호 참조, 예: `[ModuleBase](#evox.core.module.ModuleBase)` 또는 `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — 이미지 삽입, 예: `![Module base](/_static/modulebase.png)`

---

## 번역

문서는 다국어 콘텐츠를 지원합니다. 번역을 업데이트하거나 생성하려면 다음 단계를 따르십시오.

### 번역 업데이트 (예: `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```