---
layout: home
title: Wrappers de Vue 3 para os web components do Shopify Polaris
description: Crie apps da Shopify com Vue 3. O polaris-vue-elements oferece componentes Vue tipados (props, events, v-model) em torno dos web components do Shopify Polaris, como s-button, s-text-field e s-modal, gerados a partir do Custom Elements Manifest oficial.

# O hero, os recursos e a lista de componentes são componentes próprios
# (docs/.vitepress/theme/home/), que se adaptam ao idioma da página.
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

## Os web components do Polaris, tipados para Vue {#polaris-web-components-typed-for-vue}

Os [web components do Polaris](https://shopify.dev/docs/api/app-home/polaris-web-components) da Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) funcionam com qualquer framework, mas em um template
Vue eles são custom elements sem tipos: sem autocompletar, sem verificação de props e sem `v-model`.
O `polaris-vue-elements` envolve cada um em um componente Vue 3 leve, gerado a partir do
Custom Elements Manifest da Shopify, enquanto o runtime do Polaris continua sendo carregado pelo CDN da Shopify.

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

## Todos os componentes {#all-components}

<HomeComponents />

</section>
