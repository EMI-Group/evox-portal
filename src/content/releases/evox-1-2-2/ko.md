---
title: "EvoX v1.2.2 릴리스 노트"
pubDate: 2025-06-03
summary: "DE 알고리즘 수정 및 문서 개선을 포함한 버그 수정에 중점을 둔 마이너 릴리스입니다."
---

이번 릴리스는 오직 버그 수정에만 집중한 마이너 릴리스입니다:

- 코드 청결성을 개선하기 위해 사용되지 않는 import를 제거했습니다.
- `init_step` 내부에서 `step`이 호출되던 특정 Differential Evolution (DE) 알고리즘의 의도치 않은 동작을 수정했습니다.
- 문서의 여러 부분을 수정했습니다.

**전체 변경 내역**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)