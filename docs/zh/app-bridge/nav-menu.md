---
title: "NavMenu (ui-nav-menu) – 适用于 Vue 3 的 App Bridge"
description: "Vue 3 Shopify 嵌入式应用的应用导航：Shopify 记录的是 s-app-nav，可直接作为原生标签使用；NavMenu 渲染较早的 App Bridge ui-nav-menu。"
---

# 应用导航 {#app-nav}

开始之前，请参阅[安装](/zh/app-bridge/#install)。

按照 Shopify 的 [NavMenu 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)的描述，应用导航用于配置应用在 Shopify 后台中的导航项。

Shopify 记录的应用导航使用带有 `<s-link>` 子元素的 `<s-app-nav>`；请参阅
[嵌入式应用指南](/zh/guide/shopify-embedded-app#app-navigation)以及 Shopify 的
[app nav 参考文档](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)。
它同样没有 React 组件；Shopify 的
[React 迁移指南](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
说明应直接渲染它。因此本库没有为它提供组件，原生标签
可配合现有的 `s-` `isCustomElement` 规则使用。

`NavMenu` 渲染较旧的 `ui-nav-menu`，供仍在使用它的应用使用：

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

这两种元素如何与 Vue Router 配合使用，目前尚未验证。

## Props 和事件 {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` 没有 prop，也不触发事件：`UINavMenuAttributes` 只定义了子元素，`NavMenu` 从默认 slot 渲染它们。类型没有描述这些子元素。

| Slot | 说明 |
| --- | --- |
| `default` | 导航链接，例如上面示例中的 `<a href="/" rel="home">`。 |

### `s-app-nav` {#reference-app-nav}

在类型中，`s-app-nav` 没有属性。它的子元素是以链接元素给出的导航项：每个链接在应用的导航菜单中创建一项，带有 `rel="home"` 的那个链接设置默认着陆页。

类型对这些链接的属性描述如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `href` | `string` (必填) | 导航项的路径，是应用内的相对路径，例如 `/products` 或 `/settings`。点击后应用会导航到该路由而不重新加载整个页面；它应与应用路由中的某个路由匹配。 |
| `rel` | `"home"` | 将该链接标记为应用的默认着陆页。该链接会在导航菜单中隐藏，并且只应有一个链接带有 `rel="home"`。 |
| `children` | `string` | 导航项显示的标签。类型建议使用简短的标签（一到两个词），用名词说明目的地，例如 "Products" 或 "Settings"。 |
