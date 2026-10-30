---
layout: home
title: Vue 3 wrapper cho Shopify Polaris web components
description: Xây dựng app Shopify bằng Vue 3. polaris-vue-elements cung cấp các Vue component có type (props, events, v-model) cho Shopify Polaris web components như s-button, s-text-field và s-modal, được generate từ Custom Elements Manifest chính thức.

# Hero, features và danh sách component là các component tự viết
# (docs/.vitepress/theme/home/), tự đổi chữ theo ngôn ngữ của trang.
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

## Polaris web components, có type cho Vue {#polaris-web-components-typed-for-vue}

[Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components) của Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) chạy được với mọi framework, nhưng trong template
Vue chúng chỉ là custom element không có type: không autocomplete, không kiểm tra prop, và không có
`v-model`. `polaris-vue-elements` bọc từng element trong một Vue 3 component mỏng, được generate từ
Custom Elements Manifest của Shopify, còn runtime Polaris vẫn được tải từ CDN của Shopify.

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

## Tất cả components {#all-components}

<HomeComponents />

</section>
