<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | **简体中文** | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/zh/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements：为 Shopify Polaris web components 提供完整类型的 Vue 3 封装" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[文档](https://polaris-vue-elements.dev/zh/)** ·
[快速开始](https://polaris-vue-elements.dev/zh/guide/getting-started) ·
[组件](https://polaris-vue-elements.dev/zh/components/) ·
[嵌入式应用指南](https://polaris-vue-elements.dev/zh/guide/shopify-embedded-app) ·
[更新日志](../../CHANGELOG.md)

</div>

---

> 本译文可能落后于英文版。如有出入，以[英文版](../../README.md)为准。

为 [Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components) 提供完整类型的 Vue 3 封装组件。Polaris web components 即用于构建 Shopify App Home（嵌入 Shopify 后台的）应用的 `s-*` 自定义元素。

Polaris runtime 本身仍从 Shopify 的 CDN 加载（稳定通道 `polaris-2.js` 会自动获得兼容的更新）。本库在其之上提供一层符合 Vue 习惯、类型完整的接口。

## 特性

- **全部 62 个组件的 props 和 events 均有类型**，由 Shopify 官方的 Custom Elements Manifest（`@shopify/polaris-types`）生成：`variant` 等联合类型 props、模板内自动补全、带类型的 `@click` / `@aftershow` 监听器。
- **17 个表单组件支持 `v-model`**（`STextField`、`SCheckbox`、`SSelect`、`SChoiceList` 等），每个组件都映射到正确的 property/event 组合。
- **以命令式方式控制浮层。** `SModal` 暴露带类型的 `$el`（`ModalElement`），因此 `modal.value?.$el.showOverlay()` 可以通过类型检查；同时也支持 Polaris 声明式的 `commandFor` / `command` 用法。
- **平稳降级，绝不阻碍你。** 未知 props 通过 `$attrs` 透传，slots 原样转发，新发布的 Polaris 组件始终可以直接以原生 `s-*` 标签使用。封装版本落后只意味着新特性暂时缺少类型，绝不会破坏已有功能。

## 安装

```sh
npm install polaris-vue-elements
```

Vue `^3.5` 为 peer dependency。

### 配置 runtime（必需）

这些封装组件只负责呈现。宿主应用需要从 Shopify 的 CDN 加载 Polaris runtime，并告诉 Vue `s-*` 标签是自定义元素：

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **注意：** `polaris-2.js` 是 Shopify 的稳定通道，带来 Shopify 后台的全新视觉设计。仍在使用 `polaris-1.js` 的应用可以照常运行：2.0 的组件 API 与 1.1 相同，只是新增了少量内容。参见 [Polaris 2.0 与新版后台设计](https://polaris-vue-elements.dev/zh/guide/getting-started#polaris-2-0-and-the-new-admin-design)。

## 快速上手

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **提示：** 更喜欢直接写 Polaris 原生的 `<s-button>` 标签？在 `tsconfig.json` 中加入 `"types": ["polaris-vue-elements/elements"]`，Volar / `vue-tsc` 也会对原生 `<s-*>` 标签进行类型检查（仅类型；`v-model` 仍只适用于封装组件）。参见[为原生 `<s-*>` 标签添加类型](https://polaris-vue-elements.dev/zh/guide/getting-started#_7-typing-raw-s-tags-optional)。

## 文档

所有文档都在 **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/zh/)**：

- [快速开始](https://polaris-vue-elements.dev/zh/guide/getting-started)：配置、`v-model`、浮层以及原生标签的类型。
- [用 Vue 3 构建 Shopify 嵌入式应用](https://polaris-vue-elements.dev/zh/guide/shopify-embedded-app)：App Bridge、带身份验证的 `fetch`、导航与保存栏。
- [已知问题与注意事项](https://polaris-vue-elements.dev/zh/guide/quirks)：在真实浏览器中验证过的 Polaris 行为。
- [组件参考](https://polaris-vue-elements.dev/zh/components/)：全部 62 个组件的 props、events、slots、最佳实践和在线示例。

文档站点的源码位于 [`docs/`](../../docs)；可通过 `npm run docs:dev` 在本地运行。

## 工作原理

所有能从 Shopify 的 manifest 推导出的内容都由机器生成；需要人工判断的部分只放在一个小文件里。

```
@shopify/polaris-types (custom-elements.json)   ← 唯一事实来源
        │  npm run generate
        ▼
src/lib/generated/        ← 元数据、Props/Events/Element 类型、组件（请勿手动编辑）
src/lib/runtime/          ← createWrapper：全部 62 个组件共用的一个通用工厂函数
src/lib/overrides.ts      ← 手写：仅包含 v-model 映射
```

防漂移（drift-guard）测试让遗漏无从发生：若生成的代码已过时、manifest 中的某个组件缺少封装，或新的表单类组件缺少 v-model override，CI 都会失败。一个定时运行的工作流（[`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)）会在 `@shopify/polaris-types` 发布新版本时自动创建同步 PR。

<details>
<summary><strong>手动升级到新的 Polaris 版本</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # 重新生成封装组件和类型
npm run docs:generate     # 重新生成组件参考文档
git diff                  # 检查改动，然后在 CHANGELOG.md 中记录 API 变更
```

</details>

## 开发

```sh
npm install
npm run dev            # playground（src/App.vue），运行真实的 Polaris 组件
npm run docs:dev       # 文档站点
npm run test:unit      # vitest（drift guard + 封装组件行为）
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # 根据 manifest 重新生成 src/lib/generated/
npm run docs:generate  # 根据 manifest 重新生成 docs/components/
npm run build:lib      # 将可发布的包构建到 dist/
```

## 参与贡献

欢迎提交 bug 报告、文档修正和 pull request。环境配置、基本规则和提交 PR 前的检查清单请参阅[贡献指南](./CONTRIBUTING.md)，另请阅读[行为准则](./CODE_OF_CONDUCT.md)。如需报告安全漏洞，请参阅[安全策略](./SECURITY.md)。

## 发布

版本发布通过向 `main` 推送版本 tag 触发。[`release.yml`](../../.github/workflows/release.yml) 会完成其余工作：运行检查、通过 npm Trusted Publishing 执行带 provenance 的 `npm publish`，并创建 GitHub Release，其说明取自 `CHANGELOG.md`。

<details>
<summary><strong>发布步骤（维护者）</strong></summary>

1. 在 [`CHANGELOG.md`](../../CHANGELOG.md) 中，将 `## [Unreleased]` 下的条目移到新的 `## [x.y.z] - YYYY-MM-DD` 标题下，并更新文件末尾的对比链接。polaris-types 同步 PR 会自动在其中记录新增/移除的组件；prop、slot 和图标的变更需手动补充（移除属于破坏性变更）。
2. 执行 `npm version x.y.z --no-git-tag-version`，提交这两个文件，并推送到 `main`。
3. `git tag vx.y.z && git push origin vx.y.z`。带预发布后缀的 tag（例如 `v0.3.0-rc.0`）会以 `next` dist-tag 发布。

</details>

## 许可证

[MIT](../../LICENSE)。本项目与 Shopify 无关联，也未获得 Shopify 的认可。
