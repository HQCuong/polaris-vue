# Getting started

`polaris-vue` is a set of typed Vue 3 components that wrap Shopify's Polaris web
components (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). The web components
themselves are loaded at runtime from Shopify's CDN — this library just gives you
a typed, idiomatic Vue surface (props, events, v-model) around them.

## 1. Install

> [!WARNING]
> This package is not published to npm yet. The install command below is a
> placeholder for when it is — until then, consume it from a git checkout or a
> local `npm link`.

```sh
npm install polaris-vue
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
    <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

This works in any Vue app, not just inside Shopify Admin — the components are
plain custom elements and render wherever the script is loaded.

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

Import components from `polaris-vue` and use them like any other Vue
component — props and events are fully typed:

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue'

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
import { STextField } from 'polaris-vue'

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
import { SModal } from 'polaris-vue'

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

## Next steps

Browse the [component reference](/components/) for the full prop/event list
of every wrapper, or read [Known quirks & gotchas](/guide/quirks) before you
run into them yourself.
