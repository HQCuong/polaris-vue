---
title: Vue 中的 Shopify Polaris web components——已知问题
description: 在 Vue 3 中使用 Shopify Polaris web components 时经过浏览器验证的已知问题——slot 要求、事件时机，以及与常见 Vue 组件库不同的 v-model 行为。
---

# 已知问题与注意事项 {#known-quirks-gotchas}

以下是底层 Polaris web components 真实存在、并经过浏览器验证的行为，
它们并不总是符合你从常见 Vue 组件库中形成的预期。
提前阅读这些内容，可以帮你节省不少调试时间。

## 1. `<SBanner>` 需要 slot 内容 {#_1-sbanner-needs-slot-content}

仅有 `heading` 属性是不够的——除非 `<s-banner>`
同时具有默认 slot 内容，否则它会渲染为空。

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Modal 的操作 slot 只接受特定 variant 的按钮 {#_2-modal-action-slots-only-accept-specific-button-variants}

`SModal` 的 `primary-action` slot 只接受单个
`variant="primary"` 的按钮。Polaris 在内部手动分配 slot 内容，
任何不匹配的节点都会被**静默丢弃**——没有警告，也没有报错，
只是不会渲染。`secondary-actions` 接受 `variant` 为
`secondary` 或 `auto` 的按钮。

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. 数字类型的 prop 必须绑定，而不是写成字符串属性 {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Polaris 自己的文档展示的是普通 HTML 属性（例如 `rows="3"`），
但这在 Vue 中会产生误导：对于类型为 `number` 的 prop，`vue-tsc` 期望的是
绑定表达式，而不是字符串字面量。

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Slot 分配只在 connect 时发生一次 {#_4-slot-assignment-happens-once-at-connect-time}

在父元素挂载之后修改子元素的 `slot` 属性，并不会
重新分配它。如果需要让某个元素在具名 slot 之间移动，请重新渲染
它（例如使用 `v-if`/`:key`），而不是以响应式方式修改 `slot`。

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Polaris 运行时在 CDN 上独立版本化——本库的版本并不是运行时的版本 {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

自 2026 年 8 月起，Polaris CDN 遵循语义化版本
（[更新日志](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)）。
请选择适合你发布流程的通道：

| URL | 提供的内容 |
| --- | --- |
| `polaris-2.js` | 稳定的 2.x 通道——Shopify 后台的新视觉风格；自动接收兼容的（minor）更新。**推荐。** |
| `polaris-2.0.js` | 固定版本——在你更改固定版本之前，不会有任何功能、修复或视觉上的变化。 |
| `polaris-1.js` | 上一个稳定的 1.x 通道。 |
| `polaris.js` | 旧版 URL——目前提供与 `polaris-1.js` 相同的构建，且永远不会自行升级到新的主版本。 |

新的主版本（例如 2.0）始终需要主动选择：由你修改脚本 URL。Polaris
2.0 是一次视觉更新：其 Custom Elements Manifest
（`@shopify/polaris-types@2.0.0`）声明的标签、props、events 和 slots
与 1.1 相同，只是新增了少量内容（`SThumbnail` 的 `loading` prop、更多 `STextField`
图标），因此这些 wrapper 也能搭配 `polaris-1.js` 使用。

无论加载哪个通道，运行时的更新都独立于你所安装的
`polaris-vue-elements` 版本。本库的版本只反映
其生成的**类型和 wrapper** 的新鲜程度：

- 过时的 wrapper 永远不会破坏已有的组件——只是可能
  缺少 Shopify 在该 wrapper 上次生成之后新增功能的
  带类型 props/events。
- 未知的 props 依然有效：它们会以无类型的方式通过 `$attrs` 透传到
  底层元素上。
- 未知的新组件依然有效：在为其生成带类型的 wrapper 之前，
  直接使用原生自定义元素标签即可（例如 `<s-new-component>`）。

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
