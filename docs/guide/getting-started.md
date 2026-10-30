---
title: Getting started with Shopify Polaris in Vue 3
description: Install polaris-vue-elements, load the Shopify Polaris web components runtime, and use typed Vue 3 wrappers like SButton and STextField with v-model in a Vue app or Shopify app.
---

# Getting started

`polaris-vue-elements` is a set of typed Vue 3 components that wrap Shopify's Polaris web
components (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). The web components
themselves are loaded at runtime from Shopify's CDN — this library just gives you
a typed, idiomatic Vue surface (props, events, v-model) around them.

## 1. Install

```sh
npm install polaris-vue-elements
```

## 2. Load the Polaris runtime

The wrapper components are presentational only — they don't ship the actual
custom element definitions. Your host app must load Shopify's Polaris runtime
script, which registers `<s-*>` elements globally:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

This works in any Vue app, not just inside Shopify Admin — the components are
plain custom elements and render wherever the script is loaded.

`polaris-2.js` is Shopify's stable channel and what we recommend for production.
To pin an exact release instead, or to understand how the runtime version relates
to this library's version, see
[Known quirks & gotchas](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 and the new admin design

Polaris 2.0 brings the Shopify admin's new visual design (color, typography,
spacing and icons). It became stable on October 22, 2026
([announcement](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Moving from 1.x is opt-in: swap `polaris-1.js` for `polaris-2.js`.

- **No code changes needed.** 2.0 is a visual update: its components, props,
  events and slots are the same as 1.1, plus a few additions (such as
  `SThumbnail`'s `loading` prop). Apps that stay on `polaris-1.js` keep working
  with these wrappers; only the additions need 2.x at runtime.
- **It follows each store's design.** Inside the Shopify admin, a store that has
  the new admin design gets the new look, and a store on the previous design keeps
  the 1.x look. Outside the admin, the new look is used by default, which makes it
  easy to preview locally.
- **Fixed or sticky content near the bottom of the viewport** should reserve space
  with the `--shopify-safe-area-inset-bottom` CSS variable
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  so the floating Sidekick bar doesn't cover it.
- **Built for Shopify apps** must match the admin's new visual style by
  **May 1, 2027**.

## 3. Configure Vite

Tell Vue's compiler to treat any `s-*` tag as a custom element instead of
trying to resolve it as a Vue component:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 4. Your first component

Import components from `polaris-vue-elements` and use them like any other Vue
component — props and events are fully typed:

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. v-model on form components

Form-like components support `v-model`, mapped to the correct underlying
prop/event pair for that element (see `src/lib/overrides.ts` for the full
mapping — text-likes use `value`/`input`, `SCheckbox`/`SSwitch` use
`checked`/`change`, `SChoiceList` uses `values`/`change`, and so on):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. Controlling overlays (modal, popover, tooltip)

Overlay components like `SModal` can be controlled two ways:

**Declaratively**, with the standard HTML `commandFor`/`command` attributes on
a trigger button — no script required:

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**Imperatively**, by grabbing a typed template ref and calling the underlying
element's method through `$el`:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. Typing raw `<s-*>` tags (optional)

If you'd rather keep writing Polaris's own tags (`<s-button>`, `<s-text-field>`, …)
than switch to the wrappers, the package can still type them. Opt in once, in your
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

or with a reference in a `.d.ts` file such as `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

This adds every Polaris tag to Vue's `GlobalComponents`, so Volar and `vue-tsc` check
raw tags the same way they check the wrappers: union-typed props, typed `@click` /
`@aftershow` listeners, and a typed element for imperative methods.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

It's types only: nothing is registered at runtime, so keep the `isCustomElement`
setting from step 3. Two differences from the wrappers:

- **No `v-model` on raw tags.** Bind `:value` and listen for `@input` / `@change`
  yourself, or use the wrapper component, which maps each form field's property and
  event for you.
- **Don't combine it with a hand-written shim** for the same tags in your project —
  two declarations of `GlobalComponents['s-button']` with different types conflict.
  Remove the shim when you opt in.

## Next steps

Browse the [component reference](/components/) for the full prop/event list
of every wrapper, or read [Known quirks & gotchas](/guide/quirks) before you
run into them yourself.

Building a Shopify app? See [Build a Shopify embedded app with Vue 3](/guide/shopify-embedded-app)
for loading App Bridge, authenticated requests and App Bridge APIs from Vue.
