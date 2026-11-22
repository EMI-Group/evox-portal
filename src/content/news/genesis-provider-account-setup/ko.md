---
title: "Genesis, 계정 설정·모델 선택·ChatGPT 로그인을 연결"
pubDate: 2026-11-22
summary: "새 공급자 마법사가 자격 증명, 모델 목록, 추론 옵션과 일정을 묶고 Genesis가 관리하는 ChatGPT 구독 연결을 추가합니다."
---

사용 가능한 모델 연결에는 이름 이상의 것이 필요합니다. 인증, 엔드포인트, 지원 추론 옵션, 공유 계정 제한이 서로 맞아야 합니다. 2026년 11월 19~20일 Genesis `main`에 병합된 변경은 Welcome과 Settings를 공급자 계정 중심으로 재구성합니다. PR #175의 **Sign in with ChatGPT**는 ChatGPT 구독 프로필이 사용하던 Codex 자격 증명 가져오기 경로를 대체합니다. [통합 변경][pr]

![계정 열쇠와 선택한 모델의 구성품이 정돈된 도구함에 들어 있는 모습](./cover.webp)

*개념 삽화: 인증과 모델 선택은 같은 구성 계정에 속합니다.*

## 계정을 먼저 구성하고 모델을 추가하기

Welcome은 단계별 공급자 마법사를 사용하고, Settings는 지속적인 계정 관리를 담당합니다. 자동 생성되는 계정 이름과 ID는 선택 모델이 아닌 공급자에서 나옵니다. 한 계정에 여러 모델과 추론 수준을 넣어 자격 증명, 동시 실행 한도, 일정을 공유할 수 있습니다. 이러한 속성이 다르면 별도 계정이 적절합니다. [프로필 규약][profiles]

예를 들어 OpenAI 호환 엔드포인트를 쓰는 팀은 기본 URL과 자격 증명을 한 번 설정하고, 실제 제공 모델을 추가한 뒤 작업별 모델과 추론 수준을 선택할 수 있습니다. 통합 변경은 사용자 정의 엔드포인트의 API 키 입력을 사용할 수 있게 하고, 해당 모델 계정을 OpenAI Chat Completions로 연결합니다. 선택 가능한 모든 모델에는 목록 항목이 필요하며 기본 모델 이름만 입력해서는 등록되지 않습니다. 자격 증명 칸이 채워졌는지가 아니라 선택 모델을 테스트하십시오. [통합과 브라우저 검증][pr]

마법사는 모델이 알리는 추론 선택지와 기본값을 구분합니다. 선택한 기본값은 저장되는 모델 항목과 연결 테스트 요청에 반영됩니다. 표준 단계는 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`입니다. 기존 `max`는 `xhigh`로 읽고 다음 저장 때 표준 표기로 기록합니다. 공급자 고유 표기는 요청 경계에서 변환합니다. 실제 지원은 모델에 달렸으며, 단계가 표시된다고 모든 엔드포인트가 전부 지원한다는 뜻은 아닙니다. [추론 규칙][profiles]

## Genesis를 통해 ChatGPT 승인하기

Welcome 또는 **Settings → LLM → Provider accounts**에서 **ChatGPT Subscription**을 선택합니다. 버전 고정 가이드는 `genesis chatgpt login`, `genesis chatgpt status`, `genesis chatgpt models`를 로그인과 확인 명령으로 제시합니다. 소스 체크아웃에서는 `mix genesis.chatgpt login`을 사용합니다. 표시된 URL을 브라우저에서 열고 Genesis에 권한을 부여합니다. [구독 가이드][oauth]

로그인 후 **Check connection**에서 등록 계정과 해당 계정의 사용 가능한 모델을 선택합니다. Settings에서는 계정을 저장한 뒤 **Connection Test**를 실행하며, Welcome에서는 설정 완료 전에 모델을 테스트합니다. 호환성을 위해 `provider = "openai_codex"`를 유지하고 `auth_mode = "oauth"`를 사용하며, `siwc_account`로 Genesis 등록 계정을 지정합니다.

기존 구독 프로필은 Genesis를 통해 다시 승인해야 합니다. 이 연결은 과거 Codex에서 가져온 자격 증명을 사용하지 않습니다. 이전 모델이 새로 발견한 목록에 없으면 사용 가능한 모델을 선택하십시오. OpenAI API 키 계정은 별도 선택지로 유지됩니다. 여러 등록 계정에는 `genesis chatgpt login --account work`처럼 별칭을 지정하고 프로필에서 해당 별칭을 선택합니다. [이전과 별칭][oauth]

## 실행 호스트에 연결 유지하기

선택한 계정의 자격 증명은 실행 노드에서 해석하고 갱신합니다. 로그인 CLI와 실행 중인 서버 사이의 갱신은 직렬화됩니다. 브라우저에서 보이는 등록 정보를 다른 원격 호스트의 연결로 혼동하지 않게 하는 구조입니다. [계정 저장소][store]

자체 호스팅 가이드는 SSH로 루프백 로그인 포트를 전달하고 Genesis 서비스와 같은 계정 및 구성 디렉터리에서 로그인하는 방법을 설명합니다. 보호된 자격 증명 전송과 HTTP CONNECT 프록시가 필요한 호스트용 `GENESIS_SIWC_HTTPS_PROXY`도 문서화되어 있습니다. 추론 테스트 전에 해당 호스트의 절차를 완료해야 합니다. 노트북에서 로그인한 것만으로 별도 서버가 구성되지는 않습니다.

PR의 ChatGPT 갱신·스트리밍 검증은 픽스처를 사용했으며, 실제 ChatGPT 계정의 신규 브라우저 승인은 해당 검토에서 아직 검증되지 않았습니다. 자신의 설정은 대상 호스트에서 실제 모델 응답을 받아 확인하십시오. [검증 범위][pr]

## 계정 일정을 명확히 설정하기

같은 계정 모델에 피크·비피크 동시 실행 한도, 시간대, 일정 정책이 들어갑니다. 새 프리셋은 지원 공급자의 일정을 미리 채울 수 있지만, 슬롯 수는 편집 가능한 Genesis 기본값이며 공급자 용량이나 비용 절감을 보장하지 않습니다. 한 계정의 모든 모델이 슬롯을 공유하므로 모델을 추가해도 별도 할당량 풀이 생기지 않습니다. [프리셋 구현][presets]

`off_peak_holidays = "CN"`은 대체 근무일을 포함한 내장 중국 달력을 계정 일정에 추가합니다. 정적 데이터는 2025~2027년을 포함하며 자동 갱신되지 않습니다. 시간대, 주말 규칙, 프리셋의 가정을 확인하십시오. 피크 동시 실행 한도가 0이면 새 요청은 대기하고, 용량을 줄여도 이미 실행 중인 작업은 중단하지 않습니다. [일정 의미][profiles]

변경을 포함한 빌드로 이동한 뒤에는 각 계정의 모델 목록, 기본 추론 설정, 실행 호스트를 확인합니다. ChatGPT 프로필은 다시 승인하고 연결 테스트를 실행하십시오. 일정이 있는 계정은 저장된 규칙과 다음 전환 시점을 확인합니다. 미래 작업이 실제 사용할 식별 정보와 제한을 검증하는 단계입니다.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
