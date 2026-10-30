---
layout: home
title: Vue 3 wrappers for Shopify Polaris web components
description: Build Shopify apps with Vue 3. polaris-vue-elements gives you typed Vue components (props, events, v-model) around Shopify Polaris web components like s-button, s-text-field and s-modal, generated from the official Custom Elements Manifest.

# The hero and features are custom components (docs/.vitepress/theme/home/), so
# there is no `hero`/`features` frontmatter. `markdownStyles: false` drops the
# default .vp-doc wrapper; the sections below opt back in where they need it.
markdownStyles: false
---

<script setup>
import HomeComponents from './.vitepress/theme/home/HomeComponents.vue'
import HomeFeatures from './.vitepress/theme/home/HomeFeatures.vue'
import HomeHero from './.vitepress/theme/home/HomeHero.vue'
</script>

<HomeHero />

<HomeFeatures />

<section class="home-section home-intro vp-doc">
<div class="home-intro-text">

## Polaris web components, typed for Vue

Shopify's [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) work in any framework, but in a Vue
template they are untyped custom elements: no autocomplete, no prop checking, and no
`v-model`. `polaris-vue-elements` wraps each one in a thin Vue 3 component generated from
Shopify's Custom Elements Manifest, while the Polaris runtime keeps loading from Shopify's CDN.

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

## All components

<HomeComponents />

</section>
