---
title: "Genesis WASM Render：修复 WebGL 渲染器中的验证顺序与像素精度"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "两项已记录的 WebGL2 修复将根本原因与回归结果联系起来，而最终验证记录则将 API 一致性与视觉匹配区分开来。"
---

软件 WebGL 渲染器不仅要能绘制出可辨认的图像，还必须编译着色器、维护 API 状态、按正确顺序验证输入，并在模块边界间保持图像精度。Genesis WASM Render 案例包含两个具体的示例，展示了这些要求是如何被调试和重新检查的。

![线框几何体变为着色像素图像](./software-graphics-pipeline.webp)

[Evidence 记录](https://genesis.evox.group/evidence/tbench-wasm/)描述了一个使用 DeepSeek V4 Flash 开发的 TypeScript 实现：通过了 2,017/2,019 个 Khronos CTS 用例，模型 token 费用约为 36 美元，从第一个到最后一个智能体提交（commit）历时 65.9 小时。该时间间隔是仓库的历史跨度，而非测得的智能体活跃运行时间。

## 按接口拆分图形流水线

[源代码架构](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md)将着色器编译与链接、光栅化、WebGL 状态与对象，以及呈现/图像解码进行了分离。着色器结果仍需经过插值、片元执行、纹理处理和绘制缓冲区，才能成为可见图像。

该渲染器不依赖额外的运行库，目标是在不调用原生 GPU 渲染的环境中运行。尽管如此，仍使用基于浏览器的一致性测试框架对其进行测试；该验证环境与渲染器的运行时依赖声明是不同的。

## 安全错误必须发生在纹理绑定错误之前

一个失败的 WebGL2 页面涉及跨域污染（origin-tainted）的图像源。[最终验证记录](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f)将其归因于验证顺序，而非缺失 worker 能力。

该实现在检查源是否为同源安全（origin-clean）之前，先检查了纹理绑定。修复提交 `7d8718a` 将安全检查移至所有六个相关图像源入口点的绑定验证之前，涵盖了图像和子图像上传。受影响页面的测试结果从 **9 个通过 / 4 个失败的子测试变为 13 / 0**。

这是一个集成问题：两项检查都存在，但它们的顺序改变了可观测的 API 行为。定向测试通过后，项目又进行了全量回归，检查其他页面是否仍然通过。

## 高位深纹理在上传前就丢失了精度

第二个页面测试了更高精度的纹理输入。同一份记录发现了一个图像解码路径，该路径在上传前将源压缩成每通道 8 位精度。修复提交 `89e4559` 和 `9bd7811` 增加了一个 JavaScript 16 位 PNG 路径并修正了通道处理，包括 RGBA 输入。

`tex-image-10bpc` 页面从 **2 个通过 / 1 个失败的子测试变为 3 / 0**。相关的实现是[呈现层 PNG 解码器](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts)。这个例子说明了为什么仅靠改变着色器算术运算无法解决所有的精度失败：数据在上游解码阶段已经丢失了精度。

## 核对提交的构建产物与实际运行的渲染器

[8 月 29 日的最终记录](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md)确定了 bundle 提交版本 `c4ffbff`。记录指出，检入的 `renderer.js` 是按检出状态直接测试的，未为了验证而重新构建。

| 评估测试集 | 通过 | 失败 | 超时 / 错误 |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1,184/1,184 | 0 | 0 / 0 |
| 合计 | 2,017/2,019 | 2 | 0 / 0 |

测试分母来自该版本测试树中的清单。记录还指出，所有 2,019 个评分页面均报告软件渲染器处于活动状态，因此原生回退（fallback）并未提供通过的结果。对于那两个修正后的 WebGL2 页面，全量运行在恢复这两个失败项的同时，也保留了之前通过的页面。

![记录的 Genesis 运行的 WebGL 一致性结果](./wasm-render-results-en.png)

*历史结果图表；版本化的最终记录定义了评估的 manifest 和计数。*

## 使用对照组调查剩余失败项

仍有两个 WebGL1 页面失败。最终记录将低 Alpha 颜色案例归因于 Chromium 的 2D-canvas 呈现/回读行为，并报告原生 WebGL 也存在同样的失败。对于双下划线着色器标识符，记录显示原生 Chrome 同样未能通过该测试页。

这些是项目记录的对照结果，而非独立的复现。它们解释了作者对剩余项的分类，而没有将 2,017/2,019 变成无条件的兼容性声明。

视觉对比是一项单独的检查。Evidence 记录报告，在选定的子集中，**16/38 个 three.js 页面达到了 0.1% 的严格像素阈值**，以及 **13/16 个 Babylon.js 场景**。API 一致性和像素一致性衡量的是不同的属性；高 CTS 计数并不能消除视觉上的失败。

## 追踪从测试页到最终产物的失败过程

在准备好所需的测试树和框架依赖项后，最终记录给出了以下 WebGL2 测试入口：

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

记录指出，详细的 JSON 输出已被 gitignore 忽略。已提交的报告和修复编号构成公开的追溯线索；本文并未重新运行该测试集。

该存档的 135,165 行受 Git 跟踪的文本包括生成的 bundle、第三方库、lockfile 和文档。36 美元涵盖了模型 token，不包括硬件。在检查此案例时，请从验证顺序修复及其测试页开始：它将特定的失败、源代码更改和集成结果联系起来，而不仅仅依赖于代码量。
