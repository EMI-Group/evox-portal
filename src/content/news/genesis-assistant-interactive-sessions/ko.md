---
title: "Genesis Assistant: 멈춘 대화에서 작업 이어가기"
pubDate: 2026-11-12
summary: "Genesis main은 Assistant 대화를 대화형 세션으로 유지하며, 검토 대화 상자에 정확한 코드와 대상 노드를 표시합니다."
---

개발자가 Genesis Assistant에 실패한 작업을 살펴보라고 한 뒤 변경 사항을 검토하러 이동했다가 추가 질문을 할 수 있습니다. 그러려면 이전 대화를 찾고 맥락을 이어갈 수 있어야 합니다. 2026년 11월 10~12일 Genesis `main`에 병합된 변경은 Assistant 대화를 세션이 유지되는 동안 계속 사용할 수 있도록 하고 대화 목록을 대시보드 사이드바로 옮겼습니다. [Assistant 가이드][guide]

![개발자가 표시된 대화로 돌아와 제안된 작업 하나를 검토하는 모습](./genesis-assistant-interactive-sessions.webp)

*Assistant 대화를 이어가며 제안된 동작을 검토하는 장면을 그린 편집 삽화입니다.*

## 입력을 기다리는 대화로 돌아가기

**Active Tasks** 아래 **Conversations**를 엽니다. 선택한 노드의 활성 세션과 로컬에 캐시된 대화가 표시되며, 입력 대기 중, 실행 중, 종료됨을 구분합니다. 대화를 선택하면 `/assistant?session=<agent_id>`가 열립니다. 기존 `/help` 링크는 쿼리 문자열을 보존하며 `/assistant`로 이동합니다. [경로 변경][route]

한 차례 대화를 마치면 세션은 실행 슬롯을 반환하고 맥락과 작업 트리를 유지한 채 입력을 기다릴 수 있습니다. 후속 메시지는 같은 에이전트 세션과 프롬프트 캐시 식별자를 사용합니다. **New chat**은 별도 대화를 시작하며 기존 대화는 목록에 남습니다. 종료된 대화도 기록으로 표시될 수 있습니다. [세션 구현][session]

## 변경을 결정하기 전에 작업 살펴보기

테스트 작업이 실패했다고 가정해 봅시다. 보고 있는 노드에서 해당 작업의 상태, 오류, 결과를 읽어 달라고 Assistant에 요청합니다. 검토 페이지에서 변경 사항을 실패 정보와 비교한 다음 **Conversations**로 돌아와 더 구체적으로 질문합니다. 로컬 인스턴스에서 Genesis 소스 다운로드를 요청하면 Assistant가 해당 체크아웃을 읽을 수 있도록 내려받습니다.

재시도가 필요하면 이전 작업을 맥락으로 새 작업을 시작하도록 제안해 달라고 요청합니다. 조회는 읽기 단계이며 작업 시작은 쓰기 호출을 사용합니다. 선택한 노드에서 실행할 구체적인 호출을 승인할지 결정해야 합니다. [작업 조회 및 실행 단계][guide]

## 읽던 위치를 유지하며 쓰기 요청 검토하기

대화 내용과 입력란 사이의 고정된 상태 표시줄은 대기 중인 요청을 알려 줍니다. **Review**를 열면 한 번에 하나씩 볼 수 있습니다. 정확한 코드와 실행 대상을 확인한 후 **Allow once** 또는 **Deny**를 선택합니다. `sudo` 요청은 Genesis 서버의 실행 계정으로 네이티브 Elixir를 실행하므로 눈에 띄는 경고를 표시합니다.

대화 상자는 런타임이 표시한 대상 노드와 요청에 첨부된 경고를 보여 줍니다. 여러 요청을 순서대로 검토할 수 있고, 아직 대기 중이면 복구한 요청도 다시 표시됩니다. 표시줄 내용이 바뀌어도 대화 내용과 입력란의 위치는 유지됩니다. [승인 절차 변경][approval]

## 작업으로 돌아가 결과 확인하기

쓰기 요청을 승인한 뒤 생성된 작업의 상태를 읽어 완료 여부를 판단합니다. 응답이 중단되거나 쓰기가 시간 초과되면 다시 요청하기 전에 현재 상태를 확인합니다. 변경 사항이 포함된 빌드에서 읽기 전용 조회를 한 다음 다른 대시보드 페이지로 이동하고 **Conversations**를 통해 돌아와 후속 질문을 해 보세요. 이 흐름의 기반이 되는 작업 도구는 [이전 Assistant 소개][related]에서 확인할 수 있습니다. [현재 Assistant 가이드][guide]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /ko/news/genesis-development-2026-11-07
