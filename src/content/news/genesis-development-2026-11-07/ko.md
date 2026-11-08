---
title: "Genesis Assistant: 실행 중인 작업을 이해하고 관리하기"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "하나의 대화에서 작업과 시스템 용량을 확인하고 조치를 취합니다. Genesis main 브랜치는 원격 서비스, 백그라운드 작업, 모델 자격 증명 관리도 간소화합니다."
---

오래 실행되는 소프트웨어 작업은 시작한 뒤에도 질문을 남깁니다. 어떤 작업이 아직 진행 중인지, 왜 실패했는지, 다음에는 무엇을 해야 하는지 알아야 합니다. 2026년 11월 4~7일 Genesis `main` 브랜치에 반영된 변경은 이러한 질문을 대시보드의 Assistant 대화로 연결하고 기반 서비스도 개선합니다.

![실행 중이거나 일시 중지된 작업을 검토하는 개발자](./genesis-assistant-task-flows.webp)

*하나의 대화와 여러 작업 흐름: 이번 업데이트의 핵심을 표현한 편집 일러스트.*

## 조작 항목보다 작업에서 출발하기

Genesis Assistant는 Genesis 소스와 문서를 읽고 작업 및 스케줄러의 실시간 용량을 확인할 수 있습니다. 개발자는 실패한 작업의 상태, 오류, 결과를 살펴보게 한 뒤 이전 작업 재개와 같은 다음 행동을 요청할 수 있습니다. 설명과 조작은 현재 보고 있는 노드를 대상으로 이어집니다.

[Assistant 안내서][assistant]에는 실행 중인 작업 조회, 가용 모델 슬롯 확인, 병합 중 스케줄링 일시 중지와 같은 구체적인 시작점이 있습니다. 일시 중지는 스케줄링에 적용되며 이미 실행 중인 작업은 계속됩니다. 임시 런타임 설정과 저장된 설정은 구분되므로 현재 세션의 조정이 조용히 영구 기본값으로 바뀌지 않습니다.

조회는 `read`, 변경은 정확한 실행 코드의 승인을 받는 `write` 단계를 사용하며, `sudo`에는 별도 승인 카드가 있습니다. 질문이 실행으로 이어지는 시점에 실제로 수행할 내용을 확인할 수 있습니다.

## 하나의 서버, 두 가지 연결 방식

원격 개발과 HTTP 대시보드는 이제 하나의 서버 인스턴스를 공유합니다. 기존 원격 명령은 분산 연결 전용 인스턴스를 별도로 시작했습니다. [공유 서버 변경][remote] 이후 `genesis remote stop`은 원격 분산 연결을 끄고 HTTP 대시보드는 유지합니다. 원격 개발 연결을 종료하기 위해 공유 HTTP 서비스를 중지할 필요가 없습니다.

## 작업을 추적하기 쉬워지는 세부 개선

[백그라운드 작업][jobs]에는 이제 `bash-1` 같은 짧은 식별자가 부여됩니다. 호출 에이전트가 소유한 작업이 하나뿐이면 `job_output`은 `job_id` 없이 대상을 찾습니다. 여러 개라면 식별자, 상태, 레이블을 반환해 올바른 작업을 선택하도록 돕습니다.

[OAuth 자격 증명 파일의 재정의 경로][oauth]는 전역 `[llm] oauth_file` 대신 `[[llm.models]]`의 개별 모델 프로필에 속합니다. 사용자 지정 자격 증명 경로를 사용하는 개발자는 해당 모델과 함께 경로를 관리할 수 있습니다.

이러한 변화는 진행 중인 작업과 만나는 지점을 명확하게 합니다. 확인할 작업, 승인할 동작, 이해하기 쉬운 서비스 상태가 그것입니다. 전체 시스템은 [Genesis 소개][intro]에서, 구체적인 조작은 [Assistant 안내서][assistant]에서 확인하세요.

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /ko/news/evox-genesis

