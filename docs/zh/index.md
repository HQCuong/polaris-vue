---
layout: home
title: Shopify Polaris web components 的 Vue 3 wrapper
description: 使用 Vue 3 构建 Shopify 应用。polaris-vue-elements 为 s-button、s-text-field、s-modal 等 Shopify Polaris web components 提供带类型的 Vue 组件（props、events、v-model），由官方 Custom Elements Manifest 生成。

# Hero、features 和组件列表都是自定义组件
# (docs/.vitepress/theme/home/)，会根据页面语言自动切换文字。
markdownStyles: false
---

<script setup>
import HomeComponents from '../.vitepress/theme/home/HomeComponents.vue'
import HomeFeatures from '../.vitepress/theme/home/HomeFeatures.vue'
import HomeHero from '../.vitepress/theme/home/HomeHero.vue'
</script>

<HomeHero />

<HomeFeatures />

<section class="home-section home-intro vp-doc">
<div class="home-intro-text">

## 为 Vue 提供类型的 Polaris web components {#polaris-web-components-typed-for-vue}

Shopify 的 [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
（`<s-button>`、`<s-text-field>`、`<s-modal>` 等）可以在任何框架中使用，但在 Vue 模板中它们只是
没有类型的自定义元素：没有自动补全，没有 prop 检查，也没有 `v-model`。`polaris-vue-elements`
将每个元素封装为一个轻量的 Vue 3 组件，这些组件由 Shopify 的 Custom Elements Manifest 生成，
而 Polaris runtime 仍从 Shopify 的 CDN 加载。

</div>
<div class="home-intro-code">

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Store name" />
  <SButton variant="primary">Save</SButton>
</template>
```

</div>
</section>

<section class="home-section home-all vp-doc">

## 所有组件 {#all-components}

<HomeComponents />

</section>
