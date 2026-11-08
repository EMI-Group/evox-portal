---
title: "EvoX v1.0.1 릴리스 노트"
pubDate: 2025-01-20
summary: "Windows 설치 스크립트, DE 계열의 기준 벡터 선택, 큰 개체군에서의 SHADE 오류를 수정했습니다."
---

![알고리즘 동작 점검 및 수정](./bounded-random-selection.webp)

**EvoX v1.0.1**은 다음 세 가지 수정 사항을 포함한 유지보수 릴리스입니다.

- Windows 설치 스크립트 `win-install.bat` 업데이트 ([#204](https://github.com/EMI-Group/evox/pull/204)).
- DE, ODE, JaDE의 기준 벡터 선택이 실제 무작위 선택을 사용하도록 수정 ([#205](https://github.com/EMI-Group/evox/pull/205)).
- `pop_size > 100`일 때 SHADE에서 발생하는 배열 인덱스 범위 초과 오류 수정 ([#206](https://github.com/EMI-Group/evox/pull/206)).

**릴리스**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **전체 변경 기록**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
