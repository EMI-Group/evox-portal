---
title: "EvoX Compiler 开放自定义编译流程"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main 分支新增自定义调用、内联 StableHLO 和编辑后模块的编译入口，并通过后端能力声明明确不受支持的路径。"
---

实验性操作可能超出张量库的能力，而周围的程序并不需要整体改变。EvoX Compiler 在 2026 年 11 月 23–24 日的默认分支更新中，加入了插入编译器专用操作、编译编辑后的中间代码和选择自定义后端的入口。关键是先确定扩展在哪一层执行：编译器内部、运行时内核，还是整个后端。[实现与指南][guide]

![可拆卸光学模块接入导轨，红色光路连续穿过各阶段](./cover.webp)

*概念插画：替换一个阶段，同时保持周围流程清晰可见。*

## 先选择自定义操作的边界

`custom_call` 生成一个具名 StableHLO 调用，携带显式结果声明和可选后端配置；外部编译器判断目标是否存在、能否完成降级。`inline_stablehlo` 则嵌入原始代码片段：操作数使用 `%in0` 等顺序编号，结果必须赋值给 `%out0` 等对应编号，结果规格仍需明确声明。名称、配置和代码片段是参与图特化的静态值。[操作契约][ops]

这些入口不会替你向 IREE 或 PJRT 注册任意内核。需要在运行时执行的 Python 或 Triton 内核，仍应使用已有的 `external_call` 注册路径；用普通 EvoX Compiler 操作表达的可移植操作，则可以选择带分解实现的 block。区分这些路径，才能避免把编译声明误认为运行时实现。

## 编辑中间程序，再交给编译器

例如，编译器开发者可以用 `source_text()` 检查可执行对象，编辑其 StableHLO，再通过 `compile_text` 连同输入、输出规格提交。这条路径跳过追踪和图构建，随后沿用正常的编译与加载阶段。规格描述的是外层元组，因此执行时必须保持元组形式的输入输出契约。模块由外部编译器验证；文本成功提交并不代表数值结果已经正确。[流程实现][pipeline]

每次编辑后，保留一组小规模输入，与原程序比较结果。缺失的自定义目标应在编译器合法化阶段诊断，不能通过悄悄切换后端掩盖。NumPy 解释器和原生 CPU 引擎会明确拒绝这些编译扩展。新增图内操作也没有自动批处理和求导规则，需要这些变换时应选择已有支持的实现路径。[能力与限制][guide]

## 明确接入哪个后端

后端实例现在会在流程各阶段保持一致。注册接口支持显式替换和移除，入口点允许外部包提供后端。编译后端需要声明能力与支持的数据类型，并实现编译和加载；空的数据类型集合会拒绝所有图。自定义 IREE 编译器和运行时模块可通过选项或环境变量传入，便于测试自定义编译器构建，同时避免混用默认运行时。[后端扩展指南][guide]

## 分别检查传输和数值比较

同一开发时段也调整了 Vulkan 传输：不超过 16 MiB 的上传使用映射的一致性缓冲区，更大数据走复制路径；回读则区分真正的主机内存与仅对主机可见的 GPU 内存。源码记录的测量来自一套 Intel 集成显卡、Mesa 和 IREE 环境，应在自己的硬件上分别测量传输与执行。[传输实现][transfer]

原生 CPU 的更新还为大缓冲区和传入数组复用存储，减少重复分配开销。归约线程按独立输出拆分工作，同时保留每个输出的折叠顺序。编译适配器也开放了 `split_reduction_threshold` 和 `split_reduction_non_exact`；调整归约策略时，应同时检查数值结果和耗时。 [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

原生 CPU 的 `power` 修复还使指数处理与 NumPy 的浮点幂路径一致，并在一致性检查工具中明确区分整数、布尔值的精确比较与浮点数的容差比较。采用这一源码修订前，保留参考输出，测试所选编译器和设备，并核对比较容差。此前的 [v0.1.1 版本公告][release] 介绍了原有准备流程；本次源码更新扩展了开发者定制该流程的方式。[数值修复][power]

相关更新 · 2026-11-26: [EvoX Compiler v0.2.3：为工作负载安装匹配的后端](/zh-cn/releases/evoxc-0-2-3).


相关更新 · 2026-11-28: [EvoX Compiler 将可复用准备工作与变化输入分开](/zh-cn/news/evoxc-structural-input-split).

[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /zh-cn/releases/evoxc-0-1-1
