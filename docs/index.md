---
layout: home
title: Vue 3 wrappers for Shopify Polaris web components
description: polaris-vue gives you typed Vue 3 components (props, events, v-model) around Shopify Polaris web components like s-button, s-text-field and s-modal — generated from the official Custom Elements Manifest.

hero:
  name: polaris-vue
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
  - title: v-model on 18 form components
    details: Text fields, checkboxes, switches, selects, choice lists, date pickers and more all support v-model out of the box, mapped to the correct underlying prop/event pair for each element.
  - title: Degrades gracefully
    details: Unknown props pass straight through via $attrs, and slot content is forwarded verbatim. A stale wrapper version never breaks existing usage — it just lacks types for newer features.
  - title: Synced with the manifest
    details: Component and type definitions are generated directly from Shopify's Custom Elements Manifest, keeping the wrapper surface aligned with the evergreen Polaris runtime.
---
