---
title: "Genesis, API 키 없는 선택형 검색 경로 추가"
pubDate: 2026-11-22
summary: "Keenable 어댑터가 공개 웹 검색을 명시적으로 활성화하면서 키 기반 접근과 기존 기본 공급자를 유지합니다."
---

웹 검색에 별도 자격 증명이 필요하면 Agent 조사 작업은 첫 질의 전에 멈출 수 있습니다. 2026년 11월 19일 `main`에 병합된 Genesis PR #174는 API 키 없이 공개 엔드포인트를 사용할 수 있는 **Keenable**을 선택형 공급자로 추가합니다. 기존 설치의 기본 동작은 유지됩니다. [병합된 검색 어댑터][pr]

![열린 도서관 입구가 출처를 표시한 문서들로 이어지는 모습](./cover.webp)

*개념 삽화: 웹 조사를 위한 선택형 공개 경로.*

## 공개 경로를 명시적으로 활성화하기

`[tools.search]`에서 `enabled = true`와 `provider = "keenable"`을 설정합니다. 키가 없으면 어댑터가 질의와 결과 한도를 공개 엔드포인트에 보내고 `X-Keenable-Title: Genesis`를 포함하며 `X-API-Key`는 생략합니다. 자격 증명 저장소에 `KEENABLE_API_KEY`를 추가하면 키 기반 접근을 선택합니다. [요청 구성][adapter]

구현은 필요한 두 관문을 함께 바꿉니다. 선택한 키 불필요 공급자가 Agent 검색 도구를 활성화할 수 있고, 실행 시에도 키 부재만으로 거부되지 않습니다. 자격 증명이 필요한 다른 공급자의 검사는 유지됩니다.

## 제한과 함께 결과 읽기

문서 참고 자료를 모으는 작업에서는 검색 전 설정 단계 하나를 줄일 수 있습니다. 어댑터는 제목, URL, `snippet`을 기존 결과 형식으로 변환하고 `max_results`를 적용합니다. Keenable에 대응 항목이 없는 `search_depth`는 무시합니다. [응답 매핑][adapter]

공개 경로에는 IP별 요청 제한이 있습니다. PR에는 요청 구성, 파싱, 도구 활성화 및 모의 실행 테스트가 기록되어 있지만 실제 Keenable API 호출은 보고되지 않았습니다. 활성화한 뒤 실제 실행 호스트에서 작은 질의를 보내고 출처 링크와 서비스 오류를 살핀 다음 더 큰 조사에 활용하십시오. [기록된 검증][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
