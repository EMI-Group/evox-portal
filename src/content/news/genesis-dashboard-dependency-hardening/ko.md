---
title: "Genesis, 대시보드 의존성 보강"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main에서 Phoenix, LiveView, Bandit, jsv를 업데이트했습니다. 소스 배포에는 애플리케이션 재빌드가 필요합니다."
---

Genesis는 2026년 11월 23일 `main`의 의존성 네 가지를 업데이트했습니다. 작업 공간에 접근하는 공통 웹 기반을 유지보수한 것입니다. 소스에서 Genesis를 빌드하는 팀에는 실행 중인 서비스를 구성한 의존성 조합이 중요합니다. [의존성 업데이트][lock]

![교체 부품으로 보강한 공용 출입문 잠금장치](./cover.webp)

*개념 삽화: 공용 출입구를 보호하는 부품의 유지보수.*

## 인터페이스 아래의 변화

Genesis 의존성 선언은 Phoenix 업데이트를 presence 추적기와 브로드캐스트 전달의 충돌 수정에 연결합니다. LiveView 최소 버전 변경은 URL을 생략한 연결 요청에서 세션 초기화 훅을 건너뛰는 문제의 수정과 연결됩니다. Bandit의 HTTP/2 검증 및 보강도 설명합니다. 이는 Genesis 유지보수자가 기록한 이유이며, 특정 배포가 영향을 받았는지는 해당 커밋만으로 확정할 수 없습니다. [요구사항][pins]

잠금 파일은 Phoenix를 1.8.16에서 1.8.17로, LiveView를 1.2.13에서 1.2.15로, Bandit을 1.14.1에서 1.15.0으로, jsv를 0.28.0에서 0.28.1로 올립니다. LiveView의 선언상 최소 버전은 1.2.14이지만 고정된 빌드는 1.2.15를 사용합니다. 함께 적용된 Nix 변경은 의존성 해시를 다시 계산합니다. [고정 버전][lock] · [Nix 변경][nix]

## 실제로 배포한 빌드 확인

예를 들어 자체 호스팅 팀이 소스만 갱신하고 이전 바이너리를 계속 실행할 수 있습니다. 이 커밋들을 포함하는 리비전으로 프로젝트의 일반 설치 절차에 따라 다시 빌드하고 배포하십시오. 빌드의 `mix.lock`과 필요한 경우 대응하는 Nix 해시를 확인하고, 배포 후 대시보드 접근과 실시간 재연결을 점검하십시오. 소스 디렉터리만 갱신해서는 실행 중인 서비스가 교체되지 않습니다. [설치 안내][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

2026년 11월 25일 유지보수는 `db_connection`도 2.10.3으로 올립니다. 소스는 위조된 스트림 구조가 로그 옵션에 도달하는 보안 문제를 이유로 설명합니다. Markdown 네이티브 의존성과 Nix 해시도 갱신했습니다. 일치하는 잠금 파일과 Nix 정의로 다시 빌드하세요. [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
