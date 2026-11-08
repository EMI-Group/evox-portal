---
title: "Genesis Server: 소프트웨어 개발을 위한 지속 실행 환경"
pubDate: 2026-11-02
summary: "0.13.11의 헤드리스 배포판부터 0.14.0의 로그아웃 후 실행 지원까지, Genesis는 대시보드와 에이전트를 독립적으로 배포할 기반을 마련합니다."
updatedDate: 2026-11-08
---

2026년 11월 2일 출시된 Genesis 0.14.0은 서버 시작 시 systemd lingering 상태를 확인하고 활성화 옵션을 제공합니다. 이는 10월 30일 0.13.11에서 도입한 헤드리스 배포판을 잇는 개선입니다. 개발 실행 환경의 수명 주기를 데스크톱 세션과 별도로 관리할 수 있게 합니다.

![닫힌 터미널 옆에서 작업을 계속하는 서버](./persistent-server-session.webp)

## 운영 제어를 갖춘 서버 배포판

헤드리스 배포판은 대시보드와 에이전트 실행 환경을 포함하며 Linux x64/arm64와 macOS arm64를 지원합니다. CLI는 서비스 실행, 시작, 중지, 상태, 로그, 상태 점검과 버전 확인을 제공합니다. 설치 스크립트는 체크섬을 검증하고 패키지를 설치·업그레이드하며 실행 파일을 연결합니다. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 실행 주변의 수명 주기 관리

systemd를 사용하는 Linux에서 사용자 서비스가 로그아웃 후에도 유지되려면 lingering이 필요할 수 있습니다. 0.14.0은 이 조건을 확인하며 `GENESIS_LINGER` 또는 `--no-linger`로 설정할 수 있습니다. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

이전 버전은 원격 시작도 개선했습니다. POSIX shell 래퍼로 명령을 실행하고 공백이 포함된 경로를 처리하며 연결 오류를 읽기 쉬운 이유로 표시합니다. 서버 모드 수정과 정확한 가동 시간 보고로 운영 상태를 진단하기 쉬워졌습니다. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 서버를 계속 실행하기 전에

장기 작업을 서버로 옮기기 전에 상태, 로그와 `/health` 응답을 확인합니다. systemd 호스트에서는 lingering 설정을 확인하고 로그아웃 후에도 서비스가 사용 가능한지 점검합니다. 이는 실행 기준선을 세우는 과정이며, 이후 [개발 이력](/ko/news/genesis-development-history)에서 생성된 코드를 추적할 수 있습니다.
