---
title: "Genesis 및 MESA: Fortran에서 Rust로의 재작성을 통한 수치적 차이 추적"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "보간 정밀도, 해석적 Jacobian 및 일치된 벤치마크 입력을 통해 13개의 MESA 모듈이 Rust에서 어떻게 재구축되고 검증되었는지 보여줍니다."
---

과학 소프트웨어의 재작성은 타당한 답을 도출하면서도 그 답을 만들어내는 수치적 경로를 바꿀 수 있습니다. Genesis의 MESA 사례는 해당 문제에 대한 구체적인 검증 항목을 제공합니다. 즉, 원본 Fortran 출력, 설명된 부동 소수점 차이, 솔버 단계 카운터, 그리고 일치하는 워크로드를 비교하는 벤치마크입니다.

![돋보기로 비교한 Fortran과 Rust 출력 결과](./mesa-numerical-continuity.webp)

*개념도: 기존 수치 동작에 대해 검증된 새로운 구현체.*

[Evidence 기록](https://genesis.evox.group/evidence/mesa/)에 따르면 13개의 재개발된 모듈, 139,414라인의 Fortran 코드, 89,946라인의 Rust 코드가 보고되었습니다. 아래의 엔지니어링 세부 사항은 [리포지토리 리비전 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023)에서 가져온 것이며, 문서화된 벤치마크 날짜는 2026년 8월 5일입니다. 해당 벤치마크 결과는 고유한 워크로드 및 타이밍 정의를 유지합니다.

## 13개의 고립된 번역이 아닌 의존성 체인의 재구축

워크스페이스는 상수, 유틸리티, 수학에서 시작하여 행렬, 보간, 수치 솔버를 거쳐 화학, 반응률, 중성자 손실, 반응 네트워크, 상태 방정식(EOS) 및 불투명도(opacity)에 이르는 체인을 따릅니다. 각 원본 모듈은 그에 대응하는 Rust 크레이트를 가집니다. [워크스페이스 매니페스트](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml)는 이러한 패키지 관계를 명시적으로 드러냅니다.

이는 반응 네트워크 작업이 수치 루틴 및 물리 데이터와 함께 사용 가능해야 함을 의미합니다. 공개 API와 디렉토리별 컨텍스트 문서는 통합 계약을 제공합니다. [리포지토리 개요](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity)에는 Rust 구조체, 메서드 및 `Result` 값이 설명되어 있으며, 교차 검증에 유용한 경우 문서 내에 원본 Fortran 이름을 유지했습니다.

구현체는 FFI를 통해 LAPACK이나 BLAS를 호출하는 대신 Rust 솔버를 포함합니다. 범위는 선택된 수치 및 물리 스택으로 제한됩니다. 전체 항성 및 쌍성 진화 엔진, 전체 EOS 블렌드 및 기타 나열된 구성 요소는 포팅 범위 밖입니다.

## 골든 출력 불일치를 단순히 허용 오차로 해결하지 않은 이유

[2차원 보간 골든 테스트](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs)는 원본 31x35 그리드와 평가 지점을 재구성합니다. 이 테스트는 정확히 일치하는 값과 문서화된 허용 오차가 필요한 값을 구분합니다.

테스트 조사 과정에서 흥미로운 불일치가 기록되었습니다. 일부 원본 Fortran Hermite 보간 임시 변수들이 암시적으로 `REAL(4)`였습니다. 즉, 고정밀 계산 내부에서 단정밀도가 사용된 것입니다. Rust 포트에서는 `f64`를 사용합니다. 소스 주석에 따르면, 명시적으로 배정밀도를 사용한 Fortran 전사본은 Rust 결과와 일치한 반면, 원본의 혼합 정밀도 경로는 이전의 골든 출력을 재현했습니다.

해당 보간 값에 대해 기록된 최대 상대 차이는 약 3.05e-8이었으며, 상대 허용 오차는 1e-7로 설정되었습니다. 다른 수치들은 정확한 비교를 유지하거나 훨씬 더 엄격한 허용 오차를 유지합니다. 이는 유용한 엔지니어링적 구분입니다. 모든 결과가 하나의 전역 임계값 아래에서 표류하게 두는 대신, 테스트가 수치적 차이의 기원을 보존하기 때문입니다. 단정밀도 `_sg` 테스트 블록은 포트 외부에 남아 있습니다.

## 반응 네트워크에는 값의 경로뿐만 아니라 미분 경로도 필요했습니다

[반응 네트워크 개발 노트](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md)는 stiff 솔버에서 사용되는 미분값인 해석적 approx21 Jacobian에 대한 작업을 설명합니다 기록된 전/후 측정값은 체크섬이 Fortran에 더 가까워지고 통합 카운터가 정확히 일치함을 보여줍니다.

문서화된 벤치마크 워크로드의 경우, 두 구현 모두 **199단계(198단계 수락, 1단계 거부)**에 도달했으며, **8,889회의 함수 평가와 199회의 Jacobian 평가**를 수행했습니다. 이러한 카운터는 단순히 다른 솔버 경로를 택하여 겉보기에만 더 빨라 보이는 실행을 감지하는 데 도움이 됩니다.

약 3.1e-9의 잔류 체크섬 차이가 남았습니다. [벤치마크 헬퍼](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py)는 이를 Fortran의 값 경로가 4배 정밀도(quad precision)를 사용하는 반면 Rust는 f64를 사용하기 때문으로 분석했습니다. 따라서 하네스는 문서화된 1e-8 상대 체크섬 허용 오차를 사용하며, 1e-9를 요구할 경우 의도적으로 이 워크로드에 플래그를 표시합니다. 일치하는 단계 카운터는 비교를 뒷받침하며, 값 경로의 차이는 명시적으로 유지됩니다.

## 통합 테스트를 통한 모듈 연결성 확인

별도의 [단일 영역(one-zone) 통합 테스트](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs)는 공개 `BurnEosInfo` 인터페이스를 통해 이상 기체 공급자와 EOS 테이블 공급자를 사용하여 버너를 실행합니다. 이 테스트는 두 계산이 다를 것을 예상하며, 보존 법칙과 유한한 출력을 확인하고, EOS 호출 횟수가 함수 및 Jacobian 평가 횟수의 합과 같은지 검증합니다.

이는 특정 물리적 경계를 가진 연결 테스트입니다. 연소 온도가 사용 가능한 테이블의 최대치를 초과하므로, EOS 조회는 최상단 행으로 고정(clamp)됩니다. 이는 공급자가 계산에 영향을 미친다는 것을 입증하며, 전체 고온 항성 EOS의 검증은 아닙니다. 이 테스트의 단계 카운트 또한 위의 벤치마크가 아닌 이 별도의 테스트에 속합니다.

## 속도 향상을 보고하기 전에 동일한 작업을 비교하십시오

[워크로드 사양](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md)은 두 언어 모두에 대해 입력, 크기, 솔버 매개변수 및 체크섬 정의를 고정합니다. 예를 들어, 보간 벤치마크는 동일한 그리드에서 200만 개의 결정론적 지점을 평가하며, 설정 과정은 측정되는 루프 외부에 있습니다.

[벤치마크 오케스트레이터](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py)는 드라이버 내부 타이밍과 체크섬을 읽고 비교하여 보고서를 작성합니다. README의 8월 5일자 표는 CPU 0-3에 고정된 15회 실행의 중앙값을 사용하며, gfortran `-O3 -march=native`와 Rust 릴리스 프로필을 비교합니다.

| 선택된 워크로드 | Fortran | Rust | 보고된 속도 향상 |
| --- | --- | --- | --- |
| 200만 회의 bicubic 평가 | 0.162522 s | 0.090700 s | 1.79× |
| 1만 회의 Newton 솔버 실행 | 0.057918 s | 0.009029 s | 6.41× |
| 단일 영역 approx21 연소 프록시 | 0.303473 s | 0.243294 s | 1.25× |

출처: [버전 관리된 벤치마크 표](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). Evidence 페이지는 별도로 1.55–6.87×의 중앙값 범위를 보고합니다. 이러한 기록이 하나의 보편적인 속도 향상을 확정하는 것은 아니며, 단일 영역 프록시가 전체 항성 시뮬레이션을 측정하는 것도 아닙니다.

## 테스트 및 벤치마크 진입점 확인

리포지토리는 **1,052개 통과, 0개 실패, 18개 무시**를 보고합니다. README에서는 무시된 항목을 벤치마크 및 실행 시간이 긴 전체 연소 테스트로 식별합니다. 준비된 Rust 및 Fortran 환경에서 문서화된 진입점은 다음과 같습니다.

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

이것들은 소스에 문서화된 명령이며, 이 기사를 위해 수행된 새로운 재현 작업이 아닙니다. Evidence 기록의 US$10.64는 모델 토큰 비용만을 포함하며, 모델, 에피소드 수 및 실제 소요 시간은 보고되지 않았습니다.

유용한 첫 번째 점검을 위해, 보간 골든 테스트를 원본 출력 비교와 함께 읽은 다음, 벤치마크의 입력 계약을 따르십시오. 그 경로는 구체적인 수치 동작과 측정된 작업을 통해 재작성 결과를 평가할 수 있게 해줍니다.
