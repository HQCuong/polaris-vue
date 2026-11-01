---
layout: home
title: Wrappers de Vue 3 para los web components de Shopify Polaris
description: Crea apps de Shopify con Vue 3. polaris-vue-elements te ofrece componentes de Vue tipados (props, events, v-model) en torno a los web components de Shopify Polaris como s-button, s-text-field y s-modal, generados a partir del Custom Elements Manifest oficial.

# El hero, las funciones y la lista de componentes son componentes propios
# (docs/.vitepress/theme/home/), que se adaptan al idioma de la página.
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

## Los web components de Polaris, tipados para Vue {#polaris-web-components-typed-for-vue}

Los [web components de Polaris](https://shopify.dev/docs/api/app-home/polaris-web-components) de Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) funcionan con cualquier framework, pero en un template
de Vue son custom elements sin tipos: sin autocompletado, sin comprobación de props y sin `v-model`.
`polaris-vue-elements` envuelve cada uno en un componente ligero de Vue 3 generado a partir del
Custom Elements Manifest de Shopify, mientras el runtime de Polaris se sigue cargando desde el CDN de Shopify.

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

## Todos los componentes {#all-components}

<HomeComponents />

</section>
