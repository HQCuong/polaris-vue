---
layout: home
title: Shopify Polaris web components के लिए Vue 3 wrappers
description: Vue 3 से Shopify apps बनाएँ। polaris-vue-elements आपको s-button, s-text-field और s-modal जैसे Shopify Polaris web components पर बने typed Vue components (props, events, v-model) देता है, जो आधिकारिक Custom Elements Manifest से generate किए गए हैं।

# Hero, features और components की सूची custom components हैं
# (docs/.vitepress/theme/home/), जो पेज की भाषा के अनुसार ढल जाते हैं।
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

## Polaris web components, Vue के लिए typed {#polaris-web-components-typed-for-vue}

Shopify के [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) किसी भी framework में काम करते हैं, लेकिन Vue
template में वे बिना types वाले custom elements होते हैं: न autocomplete, न props की जाँच, और न
`v-model`। `polaris-vue-elements` हर एक को Shopify के Custom Elements Manifest से generate किए गए
एक हल्के Vue 3 component में लपेटता है, जबकि Polaris runtime पहले की तरह Shopify के CDN से load होता रहता है।

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

## सभी components {#all-components}

<HomeComponents />

</section>
