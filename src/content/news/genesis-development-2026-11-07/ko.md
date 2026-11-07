---
title: "Genesis 개발 소식: Assistant와 공유 원격 서버"
pubDate: 2026-11-07
summary: "main 브랜치에 운영 채팅, 공유 원격 서버 및 간소화된 백그라운드 작업 처리가 추가되었습니다."
---

2026년 11월 4~7일 Genesis `main` 브랜치에 반영된 변경은 일상적인 운영을 개선합니다. **이는 개발 소식이며 새 버전 출시 공지가 아닙니다.** 11월 7일 확인 기준으로 최신 공개 버전은 여전히 v0.14.0입니다.

Genesis Assistant는 대시보드의 운영 채팅으로 확장되어 작업과 시스템 용량을 확인하고 작업 실행이나 설정 변경을 요청할 수 있습니다. read/write/sudo 실행 단계는 조회와 정확한 실행 코드의 승인이 필요한 작업을 구분하며, sudo에는 별도 승인 카드가 있습니다. 적용 범위는 [Assistant 안내서][assistant]를 참고하세요.

원격 개발은 이제 HTTP 대시보드와 하나의 서버 인스턴스를 공유합니다. `genesis remote stop`은 HTTP를 유지하면서 원격 분산 연결을 비활성화합니다. 백그라운드 작업에는 `bash-1` 같은 짧은 식별자가 부여되며, 호출 에이전트가 소유한 작업이 하나뿐이면 `job_output`에서 `job_id`를 생략할 수 있습니다.

개발 빌드를 사용하는 경우 OAuth 자격 증명 파일의 재정의 경로는 전역 `[llm] oauth_file` 설정 대신 개별 모델 프로필(`[[llm.models]]`)에 속합니다. 개발 설정을 변경하기 전에 연결된 변경 사항을 확인하세요. 이 기능들이 v0.14.0에 포함되어 있다고 가정해서는 안 됩니다.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0) · [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

