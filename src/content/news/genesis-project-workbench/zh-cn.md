---
title: "Genesis 将项目、对话与 Git 汇集到同一工作台"
pubDate: 2026-11-22
updatedDate: 2026-11-27
summary: "项目级草稿和 VCT 工作区让开发者切换任务时，上下文仍归属于正确的仓库与执行节点。"
---

在对话、开发任务与 Git 变更之间切换，不应每次都重新建立项目上下文。Genesis PR #175 于 2026 年 11 月 20 日合入 `main`，引入包含项目导航、标签页、任务与对话历史、Git 面板和就地设置的 LiveView 项目工作台。相关工作区与草稿作用域更新，使所选项目成为可以贯穿这些界面的身份。[已合并的工作台更新][pr]

![同一工作台上的独立项目抽屉分别保存自己的笔记和工具](./cover.webp)

*概念插画：每个项目保留自己的工作上下文。*

## 在同一处查看项目

工作台把导航和工作视图连接起来。开发者可以返回项目，查看任务或对话历史，再检查 Git 变更，而不必把每个视图都当作新的起点。集成保留了上游工作区选择器、账户设置和任务暂停、恢复流程，并在重连后恢复审批上下文。这些连续性改进建立在[此前的 Assistant 任务工作流][previous]之上，具体动作仍由结构化审批确定授权范围。[工作台集成][pr]

例如，开发者在一个库与使用它的应用之间交替工作。打开应用标签页时，为库写下的需求草稿应仍留在库项目中。Git 操作也应指向所选项目的服务器和仓库。合入的变更会在工作台执行 Git 操作前检查项目归属；连接不可用时保留所选节点，不把操作转到仪表盘所在主机。

## 草稿身份不只是路径

共享的 `DraftScope` 用 `{node, token}` 定义浏览器草稿。已挂载到虚拟上下文树的项目使用 `vct:///projects/<name>` 挂载点；尚未挂载的项目回退到操作系统绝对路径。两者同时存在时优先使用挂载点。因此，同一挂载项目的不同路径写法可以访问同一份草稿，而同一路径上的不同 VCT 挂载点仍各自独立。[草稿作用域实现][scope]

浏览器存储键由节点和这个令牌共同组成。后续修复会在项目的 VCT 挂载点就绪后接管原来按路径保存的草稿，处理从选择目录到登记项目的过渡。这是浏览器草稿的连续性，与任务持久化不同，也不意味着服务器重启后对话必然能够恢复。[草稿接管修复][adopt]

远程项目还需要原样保留路径：仪表盘不能按浏览器所在主机的文件系统规则改写它。提交恢复的草稿前，应确认所选节点、仓库和模型，尤其是在本地与远程项目之间切换之后。

## 工作区用于分组，任务仍需要真实目录

VCT 新增了位于 `vct:///workspaces/<name>` 的工作区分组层。工作区包含有序成员列表和可选说明，成员引用项目挂载点或操作系统路径；工作区不能嵌套。Projects 面板和 Assistant 选择器能够展示这些分组，只读工作区 API 则让 Assistant 查看成员。[工作区操作接口][workspace]

分组本身没有执行目录。因此，对仅有工作区的选择，`DraftScope.path/1` 不返回路径，任务接纳逻辑也拒绝把 VCT 挂载点当作任务路径。在库与应用的例子中，可以把两者放入同一工作区，便于共同浏览；启动开发任务前，再选择实际接收任务的成员项目。工作区不会让所有成员自动成为写入目标。

在源码检出目录中，`mix vct.workspace list` 和 `mix vct.workspace show <name>` 用于检查分组。文档中的 `create` 命令接受重复的 `--member` 参数和可选 `--data-dir`；应使用目标 Genesis 实例的数据目录。检查时会报告缺失成员，不会静默丢弃。修改分组前请核对链接中的命令约定。

## 检查视图之间的交接

PR 记录了创建并完成任务、Assistant 键盘提交与流式输出、账户设置界面的浏览器检查，也记录了一次限定到项目的 Assistant 任务查询超时。检查长任务时，这一区别很实际：请求被接受与任务结果被观测到，是两个不同事件。[验证记录][pr]

在包含这些变更的构建中，可以尝试为两个项目分别保留草稿，重连所选节点，再打开目标项目的 Git 面板。确认草稿回到正确项目，审批仍显示真实执行目标。随后跟踪任务记录中的状态，而不是把标签页恢复视为后台工作完成的证明。

[pr]: https://github.com/EMI-Group/genesis/pull/175
[previous]: /zh-cn/news/genesis-assistant-project-workflows
[scope]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_dash/lib/evo_dash_web/live/draft_scope.ex
[adopt]: https://github.com/EMI-Group/genesis/commit/a0f7b141ed448590030f6d36de951bbb1ca3673e
[workspace]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/mix/tasks/vct.workspace.ex

2026 年 11 月 25 日的改进将任务选项保留在表单内，显式选择项目后打开概览，并将运行中任务的链接指向按任务过滤的智能体检查器。项目身份确认后，才提供该项目的 Assistant 草稿。这些检查在导航时保留所选项目与执行节点。 [GitHub](https://github.com/EMI-Group/genesis/commit/c40b76d207345ed6b9dc1435887b3482ff3ad9a4) · [GitHub](https://github.com/EMI-Group/genesis/commit/732f127e1712424fc4501bfe59200fa4661514f4) · [GitHub](https://github.com/EMI-Group/genesis/commit/e3bba720387f921bd72dda49016cdfb4ef0fa46b) · [GitHub](https://github.com/EMI-Group/genesis/commit/4f8a233f89a1dcecb63ce3d342b437b4d4fbf8af).

2026 年 11 月 27 日合入 main 的 PR #178 改进了现有项目选择器：优先显示最近项目，可浏览文件夹，手动路径输入默认折叠但仍可使用。选择会保留当前草稿，并绑定打开对话框的会话，过期对话框不能修改另一会话。Windows 上的计算机按钮可浏览所选节点的盘符根目录。内部项目提示不再进入可见对话记录，模型仍接收项目上下文；首次发送也不再产生重复历史条目。切换项目时，等待 History 确定新作用域后再检查结果。 [PR #178](https://github.com/EMI-Group/genesis/pull/178) · [History](https://github.com/EMI-Group/genesis/commit/0fc1182ea3e53baa50613f3504ff0a52798984dd).
