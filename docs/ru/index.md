---
layout: home
title: Обёртки Vue 3 для веб-компонентов Shopify Polaris
description: Создавайте приложения Shopify на Vue 3. polaris-vue-elements предоставляет типизированные компоненты Vue (пропсы, события, v-model) вокруг веб-компонентов Shopify Polaris, таких как s-button, s-text-field и s-modal, сгенерированные из официального Custom Elements Manifest.

# Герой-блок, список возможностей и список компонентов — собственные компоненты
# (docs/.vitepress/theme/home/), которые подстраиваются под язык страницы.
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

## Веб-компоненты Polaris с типами для Vue {#polaris-web-components-typed-for-vue}

[Веб-компоненты Polaris](https://shopify.dev/docs/api/app-home/polaris-web-components) от Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) работают в любом фреймворке, но в шаблоне
Vue это кастомные элементы без типов: без автодополнения, без проверки пропсов и без `v-model`.
`polaris-vue-elements` оборачивает каждый из них в тонкий компонент Vue 3, сгенерированный из
Custom Elements Manifest от Shopify, а рантайм Polaris по-прежнему загружается с CDN Shopify.

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

## Shopify App Bridge — тоже на Vue {#shopify-app-bridge-in-vue-too}

`polaris-vue-elements/app-bridge` содержит аналоги на Vue 3 для компонентов и хука
из `@shopify/app-bridge-react` от Shopify: `Modal`, `SaveBar`, `AppWindow`,
`TitleBar`, `NavMenu` и `useAppBridge()`. Он находится в бете, а основная точка входа
`polaris-vue-elements` его не импортирует, поэтому приложения, которые его не используют,
его не загружают. См. [компоненты App Bridge для Vue](/ru/app-bridge/).

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

## Все компоненты {#all-components}

<HomeComponents />

</section>
