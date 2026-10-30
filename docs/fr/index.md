---
layout: home
title: Wrappers Vue 3 pour les web components Shopify Polaris
description: Créez des apps Shopify avec Vue 3. polaris-vue-elements fournit des composants Vue typés (props, events, v-model) autour des web components Shopify Polaris comme s-button, s-text-field et s-modal, générés à partir du Custom Elements Manifest officiel.

# Le hero, les fonctionnalités et la liste des composants sont des composants
# maison (docs/.vitepress/theme/home/), qui s'adaptent à la langue de la page.
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

## Les web components Polaris, typés pour Vue {#polaris-web-components-typed-for-vue}

Les [web components Polaris](https://shopify.dev/docs/api/app-home/polaris-web-components) de Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) fonctionnent avec n'importe quel framework, mais dans un
template Vue ce ne sont que des custom elements non typés : pas d'autocomplétion, pas de vérification des
props et pas de `v-model`. `polaris-vue-elements` enveloppe chacun d'eux dans un composant Vue 3 léger,
généré à partir du Custom Elements Manifest de Shopify, tandis que le runtime Polaris continue d'être chargé
depuis le CDN de Shopify.

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

## Tous les composants {#all-components}

<HomeComponents />

</section>
