---
title: "TitleBar (ui-title-bar) – App Bridge for Vue 3"
description: "TitleBar renders the Shopify App Bridge ui-title-bar in Vue 3: a title and buttons, and in a Modal its header and footer. For Shopify embedded apps."
---

# TitleBar {#title-bar}

The title bar appears at the top of your app in the Shopify admin; Shopify's [TitleBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) describes how to customize it.

`TitleBar` renders `ui-title-bar`, with `title` set as an attribute. In a `Modal` it sets
the modal's header and footer. Its children are `<button>` and `<a>` elements; the
`ui-title-bar` types allow `variant="primary"` or `variant="breadcrumb"`,
`tone="critical"`, and `<section label="...">` groups. For the page title bar, Shopify
now documents [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
which is [`SPage`](/components/s-page).

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.

### Title and actions in a modal {#example-title-bar-in-modal}

Use this to give a modal its heading and its footer buttons, here for a bulk action whose
title counts the selection.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ selectedIds: string[] }>()

const open = ref(false)
const publishing = ref(false)
const title = computed(() => {
  const n = props.selectedIds.length
  return `Publish ${n} ${n === 1 ? 'product' : 'products'}?`
})

async function publish(): Promise<void> {
  if (publishing.value) return
  const shopify = useAppBridge()
  publishing.value = true
  try {
    const res = await fetch('/api/products/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: props.selectedIds }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Products published')
  } catch {
    shopify.toast.show('Could not publish the products', { isError: true })
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton :disabled="selectedIds.length === 0" @click="open = true">Publish</SButton>
  <Modal id="publish-modal" v-model:open="open">
    <p>The products become visible on your online store.</p>
    <TitleBar :title="title">
      <button variant="primary" @click="publish">Publish</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- In a modal, `TitleBar` sets the modal's header and footer. As in Shopify's "Simple form"
  example, the main button has `variant="primary"` and Cancel has no variant
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- The buttons' click handlers run in your page, so `publish` can show the toast.
- For a destructive action, add `tone="critical"` to the primary button, as in the
  [delete confirmation example](/app-bridge/modal#example-confirm-delete).
- The title is computed from the selection before the modal opens. Whether App Bridge
  picks up a title that changes while the modal is open has not been verified.

### The page title bar with s-page {#example-page-title-bar}

Use this for the title bar of a page. Shopify now configures it with `s-page`, not
`ui-title-bar`.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBadge, SButton, SLink, SMenu, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  title: string
  status: 'ACTIVE' | 'DRAFT'
}

const props = defineProps<{ productId: string }>()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}`)
  if (res.ok) product.value = (await res.json()) as Product
})

function save(): void {
  useAppBridge().toast.show('Product saved')
}
</script>

<template>
  <SPage :heading="product?.title ?? 'Product'">
    <template #breadcrumb-actions>
      <SLink href="/products">Products</SLink>
    </template>
    <template #accessory>
      <SBadge v-if="product?.status === 'DRAFT'" tone="warning">Draft</SBadge>
    </template>
    <template #primary-action>
      <SButton variant="primary" @click="save">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton commandFor="product-more-actions">More actions</SButton>
    </template>
    <SMenu id="product-more-actions">
      <SButton>Duplicate</SButton>
      <SButton tone="critical">Delete</SButton>
    </SMenu>
    <SSection heading="Details">…</SSection>
  </SPage>
</template>
```

- Shopify's title bar page documents the `breadcrumb-actions`, `accessory`,
  `primary-action` and `secondary-actions` slots of `s-page`, a menu opened with
  `commandFor`, and "only one primary action" per page
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` follows the loaded record, so the title bar names the product.
- The `ui-title-bar` types also allow `variant="breadcrumb"` buttons and links and
  `<section label="...">` groups. Shopify's current pages do not describe how they look, so
  this page has no example of them.

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | The title of the title bar. It can also be set with `document.title`. `TitleBar` always sets it as an attribute. |

`TitleBar` emits no events.

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | `<button>` and `<a>` elements, and `<section>` groups of them, as below. |

The `ui-title-bar` types describe these children:

| Child | Attributes |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. The types note that anchor elements are not supported in Remix, where Remix's `<Link>` component can be used instead. |
| `<section>` | `label`: `string`. Its children are `<a>` and `<button>` elements. |

In these types, `<button>` and `<a>` also take `id`, `name`, `class`, `href`, `rel`, `target` and `onclick`.
