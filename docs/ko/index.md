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

<section class="home-section home-intro vp-doc">
<div class="home-intro-text">

## Vue에서도 Shopify App Bridge를 {#shopify-app-bridge-in-vue-too}

`polaris-vue-elements/app-bridge`는 Shopify의 `@shopify/app-bridge-react`에 있는
컴포넌트와 훅에 대응하는 Vue 3 컴포넌트와 훅을 제공합니다: `Modal`, `SaveBar`,
`AppWindow`, `TitleBar`, `NavMenu`, `useAppBridge()`. 현재 베타이며, `polaris-vue-elements`
메인 entry는 이 코드를 import하지 않으므로 이 코드를 사용하지 않는 앱은 이를 로드하지
않습니다. [Vue용 App Bridge 컴포넌트](/ko/app-bridge/)를 확인하세요.

</div>
<div class="home-intro-code">

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

</div>
</section>

<section class="home-section home-all vp-doc">

## 전체 컴포넌트 {#all-components}

<HomeComponents />

</section>
