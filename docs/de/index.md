---
layout: home
title: Vue-3-Wrapper für die Shopify Polaris Web Components
description: Shopify-Apps mit Vue 3 bauen. polaris-vue-elements stellt typisierte Vue-Komponenten (Props, Events, v-model) für Shopify Polaris Web Components wie s-button, s-text-field und s-modal bereit, generiert aus dem offiziellen Custom Elements Manifest.

# Hero, Features und die Komponentenliste sind eigene Komponenten
# (docs/.vitepress/theme/home/), die ihre Texte nach der Sprache der Seite wählen.
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

## Polaris Web Components, typisiert für Vue {#polaris-web-components-typed-for-vue}

Die [Polaris Web Components](https://shopify.dev/docs/api/app-home/polaris-web-components) von Shopify
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) funktionieren in jedem Framework, sind in einem
Vue-Template aber untypisierte Custom Elements: keine Autovervollständigung, keine Prop-Prüfung und kein
`v-model`. `polaris-vue-elements` umschließt jedes davon mit einer schlanken Vue-3-Komponente, generiert aus
dem Custom Elements Manifest von Shopify, während die Polaris-Runtime weiterhin vom CDN von Shopify geladen wird.

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

## Shopify App Bridge, auch in Vue {#shopify-app-bridge-in-vue-too}

`polaris-vue-elements/app-bridge` enthält Vue 3 Gegenstücke zu den Komponenten und dem
Hook aus `@shopify/app-bridge-react` von Shopify: `Modal`, `SaveBar`, `AppWindow`,
`TitleBar`, `NavMenu` und `useAppBridge()`. Es befindet sich in der Beta, und der
Haupteinstieg von `polaris-vue-elements` importiert diesen Code nicht, daher wird er von
Apps, die ihn nicht verwenden, auch nicht geladen.
Siehe [App-Bridge-Komponenten für Vue](/de/app-bridge/).

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

## Alle Komponenten {#all-components}

<HomeComponents />

</section>
