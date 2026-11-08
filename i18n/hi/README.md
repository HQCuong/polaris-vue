<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md) | [Español](../es/README.md) | **हिन्दी** | [Português (Brasil)](../pt/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/hi/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: Shopify Polaris web components के लिए typed Vue 3 wrappers" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[दस्तावेज़](https://polaris-vue-elements.dev/hi/)** ·
[शुरुआत करें](https://polaris-vue-elements.dev/hi/guide/getting-started) ·
[Components](https://polaris-vue-elements.dev/hi/components/) ·
[Embedded app गाइड](https://polaris-vue-elements.dev/hi/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> यह अनुवाद अंग्रेज़ी संस्करण से पीछे हो सकता है। किसी भी अंतर की स्थिति में [अंग्रेज़ी संस्करण](../../README.md) ही मान्य है।

[Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components) के लिए typed Vue 3 wrapper components: ये वे `s-*` custom elements हैं जिनसे Shopify App Home (admin में embedded) apps बनाए जाते हैं।

Polaris runtime स्वयं Shopify के CDN से load होता है (`polaris-2.js` stable channel को compatible updates अपने-आप मिलते रहते हैं)। यह library उसके ऊपर एक idiomatic, पूरी तरह typed Vue surface देती है।

## विशेषताएँ

- **सभी 62 components के लिए typed props और events**, जो Shopify के आधिकारिक Custom Elements Manifest (`@shopify/polaris-types`) से generate किए गए हैं: `variant` जैसे union-typed props, templates में autocomplete, और typed `@click` / `@aftershow` listeners।
- **17 form components पर `v-model`** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), हर एक अपनी सही property/event जोड़ी से जुड़ा हुआ।
- **Overlays पर imperative नियंत्रण।** `SModal` एक typed `$el` (`ModalElement`) देता है, इसलिए `modal.value?.$el.showOverlay()` type-check होता है, और साथ में Polaris का declarative `commandFor` / `command` pattern भी उपलब्ध है।
- **धीरे-धीरे degrade होता है, कभी रुकावट नहीं बनता।** अनजान props `$attrs` के ज़रिए आगे पहुँच जाते हैं, slots जैसे के तैसे forward होते हैं, और Polaris के बिल्कुल नए components को हमेशा raw `s-*` tags के रूप में इस्तेमाल किया जा सकता है। पुराने wrapper का मतलब बस इतना है कि नई features के types नहीं होंगे, मौजूदा features कभी नहीं टूटेंगी।

## इंस्टॉलेशन

```sh
npm install polaris-vue-elements
```

Vue `^3.5` एक peer dependency है।

### Runtime setup (ज़रूरी)

Wrappers केवल presentational हैं। आपका host app Shopify के CDN से Polaris runtime load करता है और Vue को बताता है कि `s-*` tags custom elements हैं:

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **नोट:** `polaris-2.js` Shopify का stable channel है और admin का नया visual design लाता है। जो apps अभी भी `polaris-1.js` पर हैं, वे काम करती रहेंगी: कुछ नई चीज़ों को छोड़कर 2.0 का component API वही है जो 1.1 का है। देखें [Polaris 2.0 और admin का नया design](https://polaris-vue-elements.dev/hi/guide/getting-started#polaris-2-0-and-the-new-admin-design)।

## त्वरित शुरुआत

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **सुझाव:** क्या आप Polaris के अपने `<s-button>` tags लिखना पसंद करते हैं? अपने `tsconfig.json` में `"types": ["polaris-vue-elements/elements"]` जोड़ें, फिर Volar / `vue-tsc` raw `<s-*>` tags को भी type-check करेंगे (केवल types; `v-model` सिर्फ़ wrappers में ही मिलता है)। देखें [Raw `<s-*>` tags को type करना](https://polaris-vue-elements.dev/hi/guide/getting-started#_7-typing-raw-s-tags-optional)।

## दस्तावेज़

सब कुछ **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/hi/)** पर है:

- [शुरुआत करें](https://polaris-vue-elements.dev/hi/guide/getting-started): setup, `v-model`, overlays और typed raw tags।
- [Vue 3 के साथ Shopify embedded app बनाएँ](https://polaris-vue-elements.dev/hi/guide/shopify-embedded-app): App Bridge, authenticated `fetch`, navigation और save bar।
- [ज्ञात quirks](https://polaris-vue-elements.dev/hi/guide/quirks): Polaris का ऐसा व्यवहार जिसे असली browser में जाँचा गया है।
- [Component reference](https://polaris-vue-elements.dev/hi/components/): सभी 62 components के props, events, slots, best practices और live examples।

साइट का source [`docs/`](../../docs) में है; इसे local रूप से `npm run docs:dev` से चलाएँ।

## यह कैसे काम करता है

Shopify के manifest से जो कुछ भी निकाला जा सकता है, वह machine-generated है; इंसानी निर्णय केवल एक छोटी-सी file में रहता है।

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 62 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

Drift-guard tests कुछ भी भूलना असंभव बना देते हैं: अगर generated code पुराना है, अगर manifest के किसी component का wrapper नहीं है, या अगर किसी नए form-जैसे component में v-model override नहीं है, तो CI fail हो जाता है। एक scheduled workflow ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) नया `@shopify/polaris-types` publish होने पर अपने-आप एक sync PR खोलता है।

<details>
<summary><strong>Polaris के नए version पर हाथ से update करना</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## डेवलपमेंट

```sh
npm install
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
npm run test:unit      # vitest (drift guards + wrapper behavior)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # regenerate src/lib/generated/ from the manifest
npm run docs:generate  # regenerate docs/components/ from the manifest
npm run build:lib      # build the publishable package into dist/
```

## योगदान

Bug reports, docs सुधार और pull requests का स्वागत है। Setup, बुनियादी नियमों और PR से पहले की checklist के लिए [योगदान गाइड](./CONTRIBUTING.md) देखें, साथ ही [आचार संहिता](./CODE_OF_CONDUCT.md) भी। किसी vulnerability की रिपोर्ट करने के लिए [सुरक्षा नीति](./SECURITY.md) देखें।

## रिलीज़

Releases `main` से एक version tag push करके बनाए जाते हैं। बाकी काम [`release.yml`](../../.github/workflows/release.yml) करता है: checks, npm Trusted Publishing के ज़रिए provenance के साथ `npm publish`, और एक GitHub Release जिसके notes `CHANGELOG.md` से आते हैं।

<details>
<summary><strong>Release के चरण (maintainers के लिए)</strong></summary>

1. [`CHANGELOG.md`](../../CHANGELOG.md) में, `## [Unreleased]` की entries को एक नए `## [x.y.z] - YYYY-MM-DD` heading के नीचे ले जाएँ और नीचे दिए compare links को update करें। polaris-types sync PRs नए/हटाए गए components वहाँ अपने-आप दर्ज कर देते हैं; props, slots और icons के बदलाव हाथ से जोड़ें (कुछ हटाना breaking change होता है)।
2. `npm version x.y.z --no-git-tag-version` चलाएँ, दोनों files commit करें, और `main` पर push करें।
3. `git tag vx.y.z && git push origin vx.y.z`। Pre-release suffix वाले tags (जैसे `v0.3.0-rc.0`) `next` dist-tag के तहत publish होते हैं।

</details>

## लाइसेंस

[MIT](../../LICENSE)। यह project Shopify से संबद्ध नहीं है और न ही Shopify द्वारा समर्थित है।
