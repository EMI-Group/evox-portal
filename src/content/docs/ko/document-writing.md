---
title: "문서 작성 가이드"
order: 7
section: "developer"
---

# 문서 작성 가이드

이 가이드는 코드베이스와 보충 파일 전반에 걸쳐 문서를 작성하고 유지 관리하기 위한 모범 사례를 설명합니다.

---

## 코드 내 문서 (독스트링)

독스트링은 코드의 목적, 사용법 및 동작을 이해하는 데 필수적입니다. 다음 규칙을 준수하세요:

### 일반 규칙

- 독스트링을 사용하여 **모든 공개 클래스, 메서드 및 함수**를 문서화하세요.
- **Sphinx 스타일** 독스트링을 사용하세요.
- 독스트링에 파라미터 유형을 포함하지 **마세요**. 유형 힌트를 사용하여 함수 시그니처에서 선언해야 합니다.

### 형식 및 지시어

다양한 요소를 설명하기 위해 다음 지시어를 사용하세요:

- `:param <name>:` -- 파라미터를 설명합니다.
- `:return:` -- 반환 값을 설명합니다.
- `:raises <exception>:` -- 함수가 발생시킬 수 있는 예외를 설명합니다.

#### 예제

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

모든 프로젝트 수준 문서는 `docs/` 디렉토리에 있습니다. 이 문서들은 가이드, 예제 및 참조를 제공하여 사용자와 개발자를 모두 지원합니다.

### 형식

- 문서에는 **Markdown (`.md`)** 또는 **Jupyter Notebooks (`.ipynb`)**를 사용하세요.
- 서술적 콘텐츠와 정적 문서에는 Markdown이 선호됩니다.
- 실행 가능한 대화형 콘텐츠(예: 튜토리얼 또는 데모)에는 Jupyter Notebooks를 사용하세요.

### Jupyter Notebook 가이드라인

- 모든 노트북이 **완전히 실행 가능**한지 확인하세요.
- 커밋하기 전에 항상 **모든 셀을 실행**하고 **출력을 저장**하세요.
- CI/CD 환경은 **GPU 실행을 지원하지 않으므로** 노트북은 로컬에서 미리 실행해야 합니다.

### Markdown 및 Notebook 지시어

풍부한 서식을 위해 다음 패턴을 사용하세요:

- `[name](#ref)` -- 내부 교차 참조, 예: `[ModuleBase](#evox.core.module.ModuleBase)` 또는 `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` -- 이미지 삽입, 예: `![Module base](/_static/modulebase.png)`

---

## 번역

문서는 다국어 콘텐츠를 지원합니다. 번역을 업데이트하거나 생성하려면 아래 단계를 따르세요.

### 번역 업데이트 (예: `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
