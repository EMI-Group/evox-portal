---
title: "Genesis, MESA의 Fortran 모듈 13개를 Rust로 재구축"
pubDate: 2026-11-03
summary: "Genesis의 MESA 사례는 과학 소프트웨어 재개발을 보여주며, 테스트 1,052개 통과와 모델 token 비용 10.64달러를 보고합니다."
---

과학 소프트웨어를 재개발할 때는 기존의 수치적 동작을 보존해야 합니다. 2026년 9월 7일자 MESA 기록은 원래 구현을 기준으로 **Fortran 모듈 13개를 Rust crates로 다시 작성한** 사례입니다.

기록은 **Fortran 139,414줄에서 Rust 89,946줄**로의 전환, **테스트 1,052개 통과**, 모델 token 비용 **미화 10.64달러**를 보고합니다. 저장소는 원래 Fortran 출력과 비교하는 골든 테스트를 설명하며, 통과한 테스트 외에 무시된 테스트 18개를 명시합니다.

Evidence의 **중앙값 기준 1.55–6.87배** 속도 향상은 특정 벤치마크 결과이며 MESA 전체의 일괄적인 향상이 아닙니다. 별도로 README의 8월 5일 표에서는 종단 간 대리 부하인 단일 구역 연소가 **1.25배** 빨라졌습니다. 시점과 부하가 다른 결과는 구분해야 합니다.

이식 범위는 선택한 수치·물리 모듈이며 전체 MESA가 아닙니다. 항성 및 쌍성 진화 엔진은 범위 밖입니다. 기존 코드의 동작 검증으로 재개발을 이끄는 사례이며, 결과는 프로젝트 측 보고로 독립 재현되지 않았습니다. token 비용에는 하드웨어 비용이 포함되지 않습니다.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
