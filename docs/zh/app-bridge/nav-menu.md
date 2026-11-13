---
title: 应用导航
description: Shopify 记录的应用导航使用带有 <s-link> 子元素的 <s-app-nav>；请参阅嵌入式应用指南以及 Shopify 的 app nav 参考文档。
---

# 应用导航 {#app-nav}

开始之前，请参阅[安装](/zh/app-bridge/#install)。

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
