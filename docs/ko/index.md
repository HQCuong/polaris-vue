---
layout: home
title: Shopify Polaris web components를 위한 Vue 3 wrapper
description: Vue 3로 Shopify 앱을 만드세요. polaris-vue-elements는 s-button, s-text-field, s-modal 같은 Shopify Polaris web components를 감싼 타입이 지정된 Vue 컴포넌트(props, events, v-model)를 제공하며, 공식 Custom Elements Manifest에서 생성됩니다.

# 히어로, 기능 소개, 컴포넌트 목록은 직접 만든 컴포넌트(docs/.vitepress/theme/home/)로,
# 페이지 언어에 맞춰 텍스트가 자동으로 바뀝니다.
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

## Vue를 위한 타입이 지정된 Polaris web components {#polaris-web-components-typed-for-vue}

Shopify의 [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …)는 어떤 프레임워크에서도 동작하지만, Vue
템플릿에서는 타입이 없는 custom element일 뿐입니다. 자동 완성도, prop 검사도, `v-model`도
없습니다. `polaris-vue-elements`는 각 요소를 Shopify의 Custom Elements Manifest에서 생성한
얇은 Vue 3 컴포넌트로 감싸며, Polaris runtime은 계속 Shopify의 CDN에서 로드됩니다.

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

## 전체 컴포넌트 {#all-components}

<HomeComponents />

</section>
