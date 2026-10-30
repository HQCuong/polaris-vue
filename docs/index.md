---
layout: home
title: Vue 3 wrappers for Shopify Polaris web components
description: Build Shopify apps with Vue 3. polaris-vue-elements gives you typed Vue components (props, events, v-model) around Shopify Polaris web components like s-button, s-text-field and s-modal, generated from the official Custom Elements Manifest.

hero:
  name: polaris-vue-elements
  text: Vue 3 wrappers for Shopify Polaris
  tagline: Typed Vue 3 components around Shopify's Polaris web components (s-button, s-text-field, s-modal, ...) — no separate Vue-specific design system to learn.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Components
      link: /components/

features:
  - title: Typed props & events
    details: Every wrapper's props and events are generated from Shopify's official Custom Elements Manifest, so you get autocomplete and type-checking that matches the real component API.
  - title: v-model on 17 form components
    details: Text fields, checkboxes, switches, selects, choice lists, date pickers and more all support v-model out of the box, mapped to the correct underlying prop/event pair for each element.
  - title: Degrades gracefully
    details: Unknown props pass straight through via $attrs, and slot content is forwarded verbatim. A stale wrapper version never breaks existing usage — it just lacks types for newer features.
  - title: Synced with the manifest
    details: Component and type definitions are generated directly from Shopify's Custom Elements Manifest, keeping the wrapper surface aligned with the Polaris runtime on the CDN.
---

<script setup>
import componentsSidebar from './.vitepress/components-sidebar.json'
</script>

## Polaris web components, typed for Vue

Shopify's [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)
(`<s-button>`, `<s-text-field>`, `<s-modal>`, …) work in any framework, but in a Vue
template they are untyped custom elements: no autocomplete, no prop checking, and no
`v-model`. `polaris-vue-elements` wraps each one in a thin Vue 3 component generated from
Shopify's Custom Elements Manifest, while the Polaris runtime keeps loading from Shopify's CDN.

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

## All components

<div v-for="group in componentsSidebar" :key="group.text">
  <h3>{{ group.text }}</h3>
  <p>
    <template v-for="(item, i) in group.items" :key="item.link">
      <a :href="item.link">{{ item.text }}</a><template v-if="i < group.items.length - 1"> · </template>
    </template>
  </p>
</div>
