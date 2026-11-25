# Figma 功能画布整理

一个供 Codex 使用的 skill。选中 Figma Section 或提供 Section 链接，即可按分类、模块和功能组整理画框，并将每个画板下方的说明统一为 `Remark`。

## 安装与使用

在已配置 Figma 连接的 Codex 环境中，将仓库克隆到本机技能目录：

```sh
git clone https://github.com/Moenly/figma-section-layout.git ~/.codex/skills/figma-section-layout
```

在新的 Codex 对话里，选中目标 Section 或粘贴它的链接，然后输入：

> 用 $figma-section-layout 整理这个 Section。

如果只想检查，可以说「用 $figma-section-layout 检查画框和 Remark 的间距，列出偏差」。

只有画框和 Remark 时，skill 会依据画框内容和流程创建左侧分类卡、上方模块条，以及分支所需的小组标题。

## 默认排版

| 元素 | 规则 |
| --- | --- |
| 模块标题底边到画框顶边 | 统一 240 px，有无小组均预留 |
| 相邻大分类 | 上一排最低内容（含 Remark）到下一排模块标题顶边 480 px |
| 同组画框 | 水平净距 120 px |
| 不同功能组 | 水平净距 240 px |
| 左侧分类到首组 | 水平净距 240 px |
| 画框到 Remark | 垂直净距 64 px，左对齐、等宽 |
| Remark | 纵向自动布局，高度随正文自适应 |
| 截图或原型转手机稿 | 页面外层用普通 Frame，内部组件可用自动布局 |

整理时保留预留空间，只有用户明确要求才缩小 Section。完整规则和样本见 [SKILL.md](SKILL.md) 和 [布局实测](references/layout-samples.md)。
