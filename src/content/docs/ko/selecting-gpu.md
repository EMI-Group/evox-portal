---
title: "GPU / CPU 선택"
order: 15
section: "misc"
---

# GPU / CPU 선택

특정 GPU에서 프로그램을 실행하려면 `CUDA_VISIBLE_DEVICES` 환경 변수를 사용할 수 있습니다. 예를 들어, 두 번째 GPU에서 프로그램을 실행하려면 다음을 사용할 수 있습니다:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

여러 GPU에서 프로그램을 실행하려면 다음을 사용할 수 있습니다:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

GPU 사용을 비활성화하려면(CPU 사용) 다음을 사용할 수 있습니다:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
