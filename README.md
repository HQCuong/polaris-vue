<div align="center">

<sub>**English** | [Tiếng Việt](./i18n/vi/README.md) | [한국어](./i18n/ko/README.md) | [简体中文](./i18n/zh/README.md) | [日本語](./i18n/ja/README.md) | [Deutsch](./i18n/de/README.md) | [Français](./i18n/fr/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: typed Vue 3 wrappers for Shopify Polaris web components" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](./LICENSE)

**[Documentation](https://polaris-vue-elements.dev/)** ·
[Getting started](https://polaris-vue-elements.dev/guide/getting-started) ·
[Components](https://polaris-vue-elements.dev/components/) ·
[Embedded app guide](https://polaris-vue-elements.dev/guide/shopify-embedded-app) ·
[Changelog](./CHANGELOG.md)

</div>

---

Typed Vue 3 wrapper components for [Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components): the `s-*` custom elements used to build Shopify App Home (embedded admin) apps.

The Polaris runtime itself loads from Shopify's CDN (the `polaris-2.js` stable channel receives compatible updates automatically). This library gives you an idiomatic, fully typed Vue surface on top of it.

## Features

- **Typed props and events for all 62 components**, generated from Shopify's official Custom Elements Manifest (`@shopify/polaris-types`): union-typed props like `variant`, autocomplete in templates, typed `@click` / `@aftershow` listeners.
- **`v-model` on 17 form components** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), each mapped to its correct property/event pair.
- **Imperative overlay control.** `SModal` exposes a typed `$el` (`ModalElement`), so `modal.value?.$el.showOverlay()` type-checks, alongside Polaris's declarative `commandFor` / `command` pattern.
- **Degrades gracefully, never blocks.** Unknown props pass through via `$attrs`, slots are forwarded verbatim, and brand-new Polaris components can always be used as raw `s-*` tags. A stale wrapper means missing types for new features, never broken existing ones.

## Installation

```sh
npm install polaris-vue-elements
```

Vue `^3.5` is a peer dependency.

### Runtime setup (required)

The wrappers are presentational only. Your host app loads the Polaris runtime from Shopify's CDN and tells Vue that `s-*` tags are custom elements:

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

> **Note:** `polaris-2.js` is Shopify's stable channel and brings the admin's new visual design. Apps still on `polaris-1.js` keep working: 2.0's component API is the same as 1.1 apart from a few additions. See [Polaris 2.0 and the new admin design](https://polaris-vue-elements.dev/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Quick start

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

> **Tip:** prefer writing Polaris's own `<s-button>` tags? Add `"types": ["polaris-vue-elements/elements"]` to your `tsconfig.json`, and Volar / `vue-tsc` type-check raw `<s-*>` tags too (types only; `v-model` stays wrapper-only). See [Typing raw `<s-*>` tags](https://polaris-vue-elements.dev/guide/getting-started#_7-typing-raw-s-tags-optional).

## Documentation

Everything lives at **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/)**:

- [Getting started](https://polaris-vue-elements.dev/guide/getting-started): setup, `v-model`, overlays and typed raw tags.
- [Build a Shopify embedded app with Vue 3](https://polaris-vue-elements.dev/guide/shopify-embedded-app): App Bridge, authenticated `fetch`, navigation and the save bar.
- [Known quirks](https://polaris-vue-elements.dev/guide/quirks): Polaris behaviors verified in a real browser.
- [Component reference](https://polaris-vue-elements.dev/components/): props, events, slots, best practices and live examples for all 62 components.

The site's source is in [`docs/`](./docs); run it locally with `npm run docs:dev`.

## How it works

Everything derivable from Shopify's manifest is machine-generated; human judgment lives in one small file.

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 62 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

Drift-guard tests make forgetting impossible: CI fails if generated code is stale, if a manifest component lacks a wrapper, or if a new form-like component is missing a v-model override. A scheduled workflow ([`sync-polaris.yml`](.github/workflows/sync-polaris.yml)) opens a sync PR automatically when a new `@shopify/polaris-types` is published.

<details>
<summary><strong>Updating to a new Polaris version by hand</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## Development

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

## Contributing

Bug reports, docs fixes and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, ground rules and the pre-PR checklist, and the [Code of Conduct](./CODE_OF_CONDUCT.md). To report a vulnerability, see [SECURITY.md](./SECURITY.md).

## Releasing

Releases are cut from `main` by pushing a version tag. [`release.yml`](.github/workflows/release.yml) does the rest: checks, `npm publish` with provenance via npm Trusted Publishing, and a GitHub Release whose notes come from `CHANGELOG.md`.

<details>
<summary><strong>Release steps (maintainers)</strong></summary>

1. In [`CHANGELOG.md`](./CHANGELOG.md), move the `## [Unreleased]` entries under a new `## [x.y.z] - YYYY-MM-DD` heading and update the compare links at the bottom. The polaris-types sync PRs record new/removed components there automatically; add prop, slot and icon changes by hand (removals are breaking).
2. `npm version x.y.z --no-git-tag-version`, commit both files, and push to `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Tags with a pre-release suffix (e.g. `v0.3.0-rc.0`) publish under the `next` dist-tag.

</details>

## License

[MIT](./LICENSE). Not affiliated with or endorsed by Shopify.
