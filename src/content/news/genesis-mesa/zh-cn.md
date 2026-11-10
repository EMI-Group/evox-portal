---
title: "Genesis 与 MESA：追踪从 Fortran 到 Rust 重写过程中的数值差异"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "插值精度、解析雅可比矩阵以及匹配的基准测试输入展示了 13 个 MESA 模块如何在 Rust 中重建并验证。"
---

科学软件的重写可能会产生看似合理的答案，但却改变了生成这些答案的数值路径。Genesis 的 MESA 案例为该问题提供了具体的检查手段：原始 Fortran 输出、已解释的浮点差异、求解步数记录，以及比较匹配工作负载的基准测试。

![放大镜下对比的 Fortran 与 Rust 输出](./mesa-numerical-continuity.webp)

*概念插图：用已有数值行为核对新的实现。*

[Evidence 记录](https://genesis.evox.group/evidence/mesa/)报告了 13 个重新开发的模块，包含 139,414 行 Fortran 代码和 89,946 行 Rust 代码。下文的工程细节源自 [仓库版本 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023)，其记录的基准测试日期为 2026 年 8 月 5 日。这些基准测试结果保留了各自的工作负载和计时定义。

## 按依赖关系重建 13 个模块

该工作区遵循从常量、工具函数和数学运算，到矩阵、插值和数值求解器，再到化学数据、反应率、中微子损失、反应网络、状态方程（EOS）和不透明度的依赖链。每个原始模块都有一个对应的 Rust crate。[工作区清单](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml)明确了这些包之间的关系。

反应网络能否工作，取决于底层数值例程与物理数据能否协同使用。公共 API 和每个目录下的上下文文档提供了集成契约。[仓库概览](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity)描述了 Rust 结构体、方法和 `Result` 值，并在文档中保留了原始 Fortran 名称，以便于交叉检查。

该实现包含 Rust 求解器，而非通过 FFI 调用 LAPACK 或 BLAS。范围保持在选定的数值和物理栈：完整的恒星与双星演化引擎、完整的 EOS 多来源混合以及其他列出的组件不在移植范围之内。

## 插值结果的偏差如何追溯到中间变量精度

[二维插值参考输出测试](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs)重建了原始的 31×35 网格和求值点。它区分了完全匹配的值与需要记录容差的值。

测试源码记录了一项具体的差异排查。一些原始 Fortran Hermite 插值的中间变量隐式使用了 `REAL(4)`：即在原本高精度的计算中使用了单精度。Rust 移植版则使用 `f64`。源码注释报告称，显式使用双精度的 Fortran 对照实现与 Rust 结果一致，而原始的混合精度路径则重现了原有参考输出。

这些插值记录的最大相对差异约为 3.05e-8，设定的相对容差为 1e-7。其余数值仍采用精确比较或更严格的容差。这是一种有用的工程区分：测试保留了数值差异的来源，而不是允许所有结果在统一的全局阈值下漂移。单精度 `_sg` 测试块尚未移植。

## 反应网络既需要数值路径也需要导数路径

[反应网络开发笔记](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md)记录了 approx21 解析雅可比矩阵的开发；这一导数矩阵会被刚性求解器使用。记录的前后测量显示，校验和更接近 Fortran，且积分器的各项计数与 Fortran 完全匹配。

对于记录的基准测试工作负载，两种实现均达到了 **199 步：198 步接受，1 步拒绝**，其中包含 **8,889 次函数评估和 199 次雅可比矩阵评估**。同时核对这些计数，可以发现某次运行看似更快、实际却改变了求解路径的情况。

校验和仍有约 3.1e-9 的差异。[基准测试辅助程序](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py)将其归因于 Fortran 数值路径使用了四倍精度，而 Rust 使用了 f64。因此，测试框架使用了记录在案的 1e-8 相对校验和容差；若将要求收紧至 1e-9，这项工作负载会被标记为不匹配。匹配的求解步数支持了这一对比，而数值路径的差异保持显式记录。

## 集成测试同时检查模块是否实际连接

一个独立的[单区集成测试](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs)通过公共 `BurnEosInfo` 接口，分别使用理想气体实现和 EOS 表实现运行燃烧计算。它预期两种计算结果会有所不同，检查守恒关系以及输出是否为有限值，并验证 EOS 调用次数等于函数评估与雅可比矩阵评估之和。

这是一个具有特定物理边界的模块连接测试：燃烧温度超过了可用表的最大值，因此 EOS 查表会将超出范围的输入限制在最高温度行。它验证了更换 EOS 实现确实会影响计算；这并非对完整高温恒星 EOS 的验证。其求解步数也属于此独立测试，而非上述基准测试。

## 以相同输入、求解参数和计时范围比较性能

[工作负载规范](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md)为两种语言固定了输入、规模、求解器参数和校验和定义。例如，插值基准测试在相同网格上评估 200 万个确定性点；初始化过程不计入这个循环的耗时。

[基准测试编排器](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py)读取驱动程序内部的计时和校验和，进行对比并编写报告。README 中 8 月 5 日的表格使用了 15 次运行的中位数，绑定到 CPU 0–3，对比了 gfortran `-O3 -march=native` 与 Rust 的 release 配置。

| 选定工作负载 | Fortran | Rust | 报告加速比 |
| --- | --- | --- | --- |
| 200 万次双三次插值评估 | 0.162522 s | 0.090700 s | 1.79× |
| 1 万次牛顿法求解 | 0.057918 s | 0.009029 s | 6.41× |
| 单区 approx21 燃烧代理工作负载 | 0.303473 s | 0.243294 s | 1.25× |

来源：[版本化基准测试表](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)。Evidence 页面另外报告了 1.55–6.87× 的中位数范围。这些记录并未确立一个通用的加速比，单区代理工作负载也没有测量完整恒星模拟的性能。

## 从参考输出与测试命令开始核查

仓库报告 **1,052 项通过，0 项失败，18 项忽略**。其 README 指出忽略的项为基准测试和耗时较长的完整时段燃烧测试。在准备好的 Rust 和 Fortran 环境中，记录的入口点为：

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

这些是源码记录的命令，而非为本文执行的新复现。Evidence 记录的 10.64 美元仅涵盖模型 token 费用；模型、执行回合数和实际耗时未予报告。

若要进行有效的初步检查，可以先阅读插值参考输出测试及其对照结果，然后遵循基准测试的输入契约。该路径使得重写版本可以通过具体的数值行为和测得的工作量进行评估。
