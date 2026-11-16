---
title: "AppWindow (s-app-window) – App Bridge for Vue 3"
description: "AppWindow renders the Shopify App Bridge s-app-window, a fullscreen modal window in the Shopify admin, in Vue 3: src is required, open it with v-model:open."
---

# AppWindow {#app-window}

Shopify's [s-app-window reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) describes it as a fullscreen modal window for complex workflows that need dedicated screen space.

`AppWindow` renders `s-app-window`, which the `@shopify/app-bridge-types` docs describe as
"a fullscreen modal window in the Shopify admin". `src` is required: "the URL is loaded
in an iframe when the window opens".

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Edit in bulk</button>
  <AppWindow id="bulk-editor" src="/bulk-editor" v-model:open="open" />
</template>
```

`open`, `v-model:open`, `show`/`hide` and hiding on unmount work as for [`Modal`](/app-bridge/modal). It has
no slot.

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.

### A full-screen editor {#example-window-editor}

Use this for an editor that needs the whole screen, opened from a list of records.

::: code-group

```vue [ProductList.vue]
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const editingId = ref<string | null>(null)
const open = ref(false)

// The window loads this route of your app in an iframe.
const src = computed(() =>
  editingId.value ? `/products/${encodeURIComponent(editingId.value)}/editor` : null,
)

function edit(product: Product): void {
  editingId.value = product.id
  open.value = true
}

async function reload(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

onMounted(reload)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="base">
      <SStack v-for="product in products" :key="product.id" direction="inline" gap="base">
        <SText>{{ product.title }}</SText>
        <SButton @click="edit(product)">Open editor</SButton>
      </SStack>
    </SStack>
  </SSection>
  <AppWindow v-if="src" id="product-editor" :src="src" v-model:open="open" @hide="reload" />
</template>
```

```vue [ProductEditor.vue]
<script setup lang="ts">
// The route at /products/:id/editor, loaded inside the window.
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SBanner, SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'

interface ProductDraft {
  title: string
  description: string
}

const route = useRoute()
const url = computed(() => `/api/products/${encodeURIComponent(String(route.params.id))}`)

const saved = ref<ProductDraft>({ title: '', description: '' })
const form = ref<ProductDraft>({ ...saved.value })
const error = ref(false)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as ProductDraft
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const values = { ...form.value }
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  error.value = !res.ok
  if (res.ok) saved.value = values
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage :heading="saved.title || 'Product editor'">
    <SBanner v-if="error" tone="critical">The product could not be saved.</SBanner>
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.title" label="Product title" name="title" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="12" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

:::

- `src` "must point to a route within your app", and "the URL is loaded in an iframe when
  the window opens" (`SAppWindowAttributes`). Changing `src` while the window is open
  navigates it to the new URL (`SAppWindowElement`).
- Shopify's best practices for the window: open it only from an explicit action, set the
  heading with `s-page` in the window's content, add `data-save-bar` to its forms, and
  return the merchant to where they started on close
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- The window is rendered once a record is chosen, because `src` is required.
- `@hide="reload"` refreshes the list after every close. Shopify lists "updating UI state"
  as a use of the `hide` event (`SAppWindowElement`).
- The form follows the [data-save-bar example](/app-bridge/save-bar#example-data-save-bar).
  When it has unsaved changes, the window's `hide()` asks the merchant before closing.
- The editor shows errors in the page. Shopify does not say which App Bridge APIs, such as
  toast, work inside the window.
- Shopify does not document how the window's route closes the window or sends data back
  to your page. The page can reach the route through the element's `contentWindow`
  ("use this to communicate with the iframe content via `postMessage()`"), only while the
  window is open.

### Bulk edit a selection {#example-window-bulk-edit}

Use this when the merchant selects rows and edits them together in a full-screen view.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SCheckbox, SSection, SStack } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const selected = ref<string[]>([])
const open = ref(false)

// The selection travels in the URL, which the bulk-edit route reads.
const src = computed(() => `/bulk-edit?ids=${encodeURIComponent(selected.value.join(','))}`)

function toggle(id: string): void {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id]
}

async function load(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

async function onHide(): Promise<void> {
  selected.value = []
  await load()
}

onMounted(load)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="small-200">
      <SCheckbox
        v-for="product in products"
        :key="product.id"
        :label="product.title"
        :checked="selected.includes(product.id)"
        @change="toggle(product.id)"
      />
    </SStack>
    <SButton :disabled="selected.length === 0" @click="open = true">
      Edit {{ selected.length }} selected
    </SButton>
  </SSection>
  <AppWindow id="bulk-editor" :src="src" v-model:open="open" @hide="onHide" />
</template>
```

- Shopify names bulk editors among the uses of `src` (`SAppWindowAttributes`). The route is
  an ordinary page of your app, so it reads the selection from its query string.
- After the window closes, `onHide` clears the selection and reloads the list.

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the window is shown. Use `v-model:open` to keep it in sync when App Bridge closes the window. Default: `false`. |
| `id` | `string` | A unique identifier for the app window element, used to connect buttons with `commandFor` or to get the element with `document.getElementById()`. |
| `src` | `string` (required) | The URL of the content to show in the window. It must point to a route of your app that renders the window content, and it is loaded in an iframe when the window opens. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | The window opened. |
| `hide` | `Event` | The window closed. |
| `update:open` | `boolean` | Emitted after `show` or `hide` when the new state differs from `open`, for `v-model:open`. |

### Slots {#slots}

`AppWindow` has no slots: `SAppWindowAttributes` defines no children.
