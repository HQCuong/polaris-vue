---
title: 在 Vue 3 中通过 AI 编程智能体使用 Shopify Polaris——llms.txt 与 AGENTS.md
description: 以 Markdown 形式向 AI 编程智能体提供 polaris-vue-elements 文档——llms.txt、llms-full.txt、每个页面的 .md 副本，以及 npm 包中附带的 AGENTS.md 指南。
---

# 通过 AI 智能体使用 polaris-vue-elements {#using-polaris-vue-elements-with-ai-agents}

编程智能体直接阅读本库的文档，而不是根据 React 示例或原始的 `<s-*>` 标签去猜测，
就能写出更好的 Vue 代码。文档提供了三种智能体可读取的形式，
npm 包中还附带了一份专为智能体编写的简短指南。

## llms.txt 与 llms-full.txt {#llms-txt-and-llms-full-txt}

遵循 [llms.txt](https://llmstxt.org/) 约定，本站发布了：

| URL | 说明 |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | 英文文档的索引：指南、按类别划分的所有组件、App Bridge 和 CSS 变量，每项都有一行说明和指向其 Markdown 副本的链接。 |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | 所有英文页面合并在一个 Markdown 文件中。 |

`llms.txt` 足够小，可以作为起点提供给智能体；智能体会沿着链接
获取所需的页面。`llms-full.txt` 体积较大，适合需要把完整参考一次性放入上下文的场景。

## 每个页面的 Markdown 副本 {#a-markdown-copy-of-every-page}

每个英文页面在相同路径后加上 `.md` 即可得到其 Markdown 版本：

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

组件页面的副本包含其导入方式、`v-model` 绑定、props、events、methods 和
slots，但不含在线示例。每个 HTML 页面都通过
`<link rel="alternate" type="text/markdown">` 链接到它的副本。

## npm 包中的 AGENTS.md {#agents-md-in-the-npm-package}

`polaris-vue-elements` 附带 `AGENTS.md`，这是一份供智能体使用本库编写 Vue 3 应用的精简指南：
包含安装设置、导入、`v-model`、App Bridge、已知问题，以及所有组件及其标签的列表。
由于它就在包内，所以始终与你安装的版本一致：

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## 让你的智能体读取它 {#point-your-agent-at-it}

大多数编程智能体都会读取项目的说明文件，例如 `AGENTS.md`、`CLAUDE.md` 或
Cursor 规则。在你的智能体所使用的文件中加入几行内容，让它在编写 UI 代码之前
先阅读本库的指南：

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

如果你的智能体无法读取 `node_modules` 中的文件，请改为提供
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt) 的 URL。

## 后续步骤 {#next-steps}

- [快速开始](/zh/guide/getting-started)：安装、Polaris 运行时和 `v-model`。
- [已知问题与注意事项](/zh/guide/quirks)：同样值得提供给智能体的行为。
- [所有组件](/zh/components/)：这些 Markdown 副本所源自的参考文档。
