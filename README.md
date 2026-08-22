# polaris-vue

Typed Vue 3 wrapper components for [Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components) — the `s-*` custom elements used to build Shopify App Home (embedded admin) apps.

The Polaris runtime itself is loaded from Shopify's CDN and always evergreen. This library gives you an idiomatic, fully typed Vue surface on top of it:

- **Typed props & events for all 59 components**, generated from Shopify's official Custom Elements Manifest (`@shopify/polaris-types`) — union-typed props like `variant`, autocomplete in templates, typed `@click`/`@aftershow` listeners.
- **`v-model` on 18 form components** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …) with the correct property/event pair for each.
- **Imperative overlay control** — `SModal` exposes a typed `$el` (`ModalElement`) so `modal.value?.$el.showOverlay()` type-checks, alongside Polaris's declarative `commandFor`/`command` pattern.
- **Degrades gracefully, never blocks** — unknown props pass through via `$attrs`, user-provided slots are forwarded verbatim, and brand-new Polaris components can always be used as raw `s-*` tags. A stale wrapper means missing types for new features, never broken existing ones.

## Installation

> **Not published to npm yet.** Until it is, consume it from a git checkout or `npm link`. The final package name is still to be decided.

```sh
npm install polaris-vue
```

Vue `^3.5` is a peer dependency.

### Runtime setup (required)

The wrappers are presentational only — your host app must load the Polaris runtime from Shopify's CDN, and tell Vue that `s-*` tags are custom elements:

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
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

### Quick start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

Full documentation — guides, known quirks, and generated reference pages for all 59 components — lives in `docs/` (`npm run docs:dev`).

## Architecture

Everything derivable from Shopify's manifest is machine-generated; human judgment lives in one small file.

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 59 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

When Shopify ships a new Polaris version:

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # the diff IS the changelog
```

Drift-guard tests make forgetting impossible: CI fails if generated code is stale, if a manifest component lacks a wrapper, or if a new form-like component is missing a v-model override. A scheduled GitHub Actions workflow (`sync-polaris.yml`) opens a sync PR automatically when a new `@shopify/polaris-types` is published.

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

1. **Never edit `src/lib/generated/` or `docs/components/` by hand** — they are overwritten by the generators. Change `scripts/generate.mjs` / `scripts/generate-docs.mjs` instead.
2. **New form component needs v-model?** Add one line to `src/lib/overrides.ts` (the `overrides.spec.ts` drift guard will point at exactly what's missing).
3. **Curated docs example?** Add `docs/examples/<tag>.md` (complex live demos go in `docs/examples/demos/*.vue` — SFCs are immune to markdown-it mangling); the docs generator inlines it automatically.
4. Before opening a PR, make sure the full suite passes: `npm run generate && npm run docs:generate && npx vitest run && npm run type-check && npx oxlint . && npx eslint .` — CI runs the same checks plus a codegen-freshness diff.
5. Behavioral claims about Polaris components (slot rules, rendering quirks) should be verified against the real CDN runtime in a browser, not just jsdom — see `docs/guide/quirks.md` for previously verified findings.

## License

[MIT](./LICENSE)
