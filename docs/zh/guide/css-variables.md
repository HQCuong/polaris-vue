---
title: Shopify Polaris CSS 变量与设计令牌（web components）
description: Shopify web components 运行时定义的每一个 Polaris 设计令牌，支持实时预览、搜索和复制。以 tokens.css 的形式导入，供你的应用自己的 CSS 使用。
schema: TechArticle
---

# Polaris CSS 变量（设计令牌） {#css-variables}

Polaris web components 会自行设置样式，但你的应用通常也有一些自己的 CSS：
页面网格、自定义卡片、图表图例、两个组件之间的间距。借助 Polaris CSS 变量，
这些 CSS 可以使用与周围组件相同的颜色、间距、圆角和字体，
从而与 admin 的设计保持一致，而不是靠硬编码的猜测值。

`polaris-vue-elements` 将它们打包成一个样式表 `tokens.css`，
其内容提取自你的应用所加载的 Polaris 运行时。

::: warning 非官方
Shopify 并未公布 Polaris web components 的 CSS 变量列表。这些名称和值
提取自 Shopify 的运行时（`polaris-2.js`），因此值会跟随 CDN 变化；
如果 Shopify 重命名某个变量，其名称也可能改变或消失。该列表每天都会检查
（参见[如何保持最新](#how-it-stays-up-to-date)）。
:::

## 何时使用 {#when-to-use}

- **应当**将它们用于你的应用自己拥有的元素：包装元素、布局容器、自定义小部件，
  以及你在 Polaris 组件之外渲染的文本。
- **不要**试图用它们重新设置 Polaris 组件的样式。每个组件都在自己的 shadow root
  中渲染，因此在页面上设置 `--p-color-bg-fill-brand` 并不会改变 `<SButton>` 的颜色。
  请改用组件的 props（`tone`、`variant`、`padding`……）。
- **优先使用布局组件。** `<SStack>`、`<SGrid>` 和 `<SBox>` 已经可以通过 props
  接收 Polaris 的间距、内边距和边框值。只有当它们无法满足需求时，再使用 CSS 变量。

## 安装 {#install}

只需导入一次样式表，例如在 `main.ts` 中：

```ts
import 'polaris-vue-elements/tokens.css'
```

然后就可以在任意 CSS 中使用这些变量：

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

原始名称和值也以 JSON 形式提供，可用于工具或 CSS-in-JS：

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## 主题 {#themes}

运行时有两种外观。使用旧版 admin 设计的店铺获得基础值（`tokens.css` 中的
`:root` 块）。使用新版 admin 设计的店铺，以及 Shopify admin 之外的任何页面，
获得 `admin-next` 主题：当第一个 Polaris 组件渲染时，运行时会给 `<html>` 添加
`p-partial-theme-admin-next` 类，而 `tokens.css` 会在同一个类下覆盖有差异的值。
你的 CSS 会自动跟随运行时选定的主题，无需任何额外工作。在下方切换 **基础** 和
**admin-next**，即可查看任一组值；半填充的圆点标记两者之间取值不同的变量。

运行时仅在额外条件下才应用的值（广色域 P3 颜色、移动端字号、高对比度模式、
`corner-shape` 支持）未被收录；`tokens.css` 中提供的是每个变量的默认值。

## 如何保持最新 {#how-it-stays-up-to-date}

一个定时任务每天从 Shopify 的 CDN 读取 `polaris-2.js`，提取其中的变量，
并在有任何新增、删除或变更时打开一个 pull request。`polaris-vue-elements`
的每个版本都包含该版本发布时的列表。

<div class="css-variables-list">

## 全部变量 {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### 颜色：背景 {#color-bg}

<CssVariables group="color-bg" />

### 颜色：文本 {#color-text}

<CssVariables group="color-text" />

### 颜色：边框 {#color-border}

<CssVariables group="color-border" />

### 颜色：图标 {#color-icon}

<CssVariables group="color-icon" />

### 颜色：其他 {#color-other}

<CssVariables group="color-other" />

### 间距 {#space}

<CssVariables group="space" />

### 圆角 {#border-radius}

<CssVariables group="border-radius" />

### 边框宽度 {#border-width}

<CssVariables group="border-width" />

### 字体 {#font}

<CssVariables group="font" />

### 阴影 {#shadow}

<CssVariables group="shadow" />

### 动效 {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### 宽度 {#width}

<CssVariables group="width" />

### 高度 {#height}

<CssVariables group="height" />

### 断点 {#breakpoints}

断点变量保存的是宽度值，但 CSS 无法在媒体查询中使用 `var()`，
因此请直接写出数值：`@media (min-width: 48rem)`。

<CssVariables group="breakpoints" />

### 其他 {#other}

<CssVariables group="other" />

</div>

## 从 `@shopify/polaris-tokens` 迁移 {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` 是 Polaris React 的令牌包。Polaris web components 并不使用它：
运行时定义了自己的变量，大多数名称都沿用了下来。如果你的应用的 CSS 来自某个 Polaris React
应用，请对照下面的列表检查。只存在于旧版包中的名称在 web components 应用中没有值，
因此使用它的 CSS 只会得到你写的 `var()` 回退值，或者什么都得不到。

<CssVariablesMigration />

## 常见问题 {#faq}

### Polaris web components 有 CSS 变量吗？

有。Polaris 运行时（`polaris-2.js`）在 `:root` 上定义了约 700 个 `--p-*` 自定义属性，
并在其组件内部使用它们。Shopify 没有为它们提供文档，而且运行时中的名称带有构建哈希。
`tokens.css` 以稳定的名称为你提供相同的值。

### 可以用这些变量重新设置 Polaris 组件的样式吗？

不可以。每个组件都在自己的 shadow root 中渲染，并读取运行时自己带哈希的变量，
因此在页面上设置 `--p-color-bg-fill-brand` 并不会改变 `<SButton>`。请使用组件的 props，
例如 `tone` 和 `variant`。这些变量是给组件周围你自己的元素使用的。

### 为什么 DevTools 中的变量名以 `-6e076` 这样的哈希结尾？

运行时会给每个名称加上与构建相关的后缀（`--p-color-bg-surface-6e076`），
而且这个后缀每次构建都会变化。不要把这些名称复制到你的 CSS 中：
`tokens.css` 去掉了后缀，因此在 Shopify 发布新构建后，`var(--p-color-bg-surface)` 仍然有效。

### 它和 `@shopify/polaris-tokens` 有什么区别？

`@shopify/polaris-tokens` 是面向 Polaris React 的令牌包。本列表直接来自 web components
运行时本身，因此包含组件实际使用的令牌，包括新版 admin 设计（`admin-next`）的值。
大多数名称是相同的；差异请参见
[从 `@shopify/polaris-tokens` 迁移](#migrating-from-polaris-tokens)。

### 这些变量支持深色模式吗？

不支持作为页面主题。运行时有一组深色值（`admin-next-dark`），但它只应用于某些组件内部的部分区域，
从不应用于整个页面，因此 `tokens.css` 没有深色主题。如果你想自己构建一个，
可以在 `tokens.json` 的 `themes["admin-next-dark"]` 下找到这些值。
