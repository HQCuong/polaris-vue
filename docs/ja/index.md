---
layout: home
title: Shopify Polaris web components 向け Vue 3 wrapper
description: Vue 3 で Shopify アプリを構築しましょう。polaris-vue-elements は、s-button、s-text-field、s-modal などの Shopify Polaris web components をラップした型付きの Vue コンポーネント（props、events、v-model）を提供します。公式の Custom Elements Manifest から生成されています。

# ヒーロー、機能紹介、コンポーネント一覧は独自コンポーネント
# (docs/.vitepress/theme/home/) で、ページの言語に合わせて文言が切り替わります。
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

## Vue のための型付き Polaris web components {#polaris-web-components-typed-for-vue}

Shopify の [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
（`<s-button>`、`<s-text-field>`、`<s-modal>` など）はどのフレームワークでも動作しますが、Vue の
テンプレートでは型のないカスタム要素にすぎません。補完も、prop のチェックも、`v-model` もありません。
`polaris-vue-elements` は、Shopify の Custom Elements Manifest から生成した薄い Vue 3 コンポーネントで
各要素をラップします。Polaris runtime はこれまでどおり Shopify の CDN から読み込まれます。

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

## すべてのコンポーネント {#all-components}

<HomeComponents />

</section>
