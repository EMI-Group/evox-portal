---
title: "EvoX v1.2.2 릴리스 노트"
pubDate: 2025-06-03
summary: "DE 알고리즘 수정 및 문서 개선에 초점을 맞춘 마이너 릴리스."
---

버그 수정에만 초점을 맞춘 마이너 릴리스입니다:

- 코드 정리를 위해 사용되지 않는 import를 제거했습니다.
- 특정 Differential Evolution (DE) 알고리즘에서 `init_step` 내에서 `step`이 호출되는 의도하지 않은 동작을 수정했습니다.
- 문서의 다양한 수정 사항.

**전체 변경 로그**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
