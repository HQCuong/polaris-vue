---
title: "Modal (ui-modal) – App Bridge modal for Vue 3"
description: "Modal renders the Shopify App Bridge ui-modal in Vue 3: bind v-model:open, get show and hide events, add a TitleBar. From polaris-vue-elements/app-bridge."
---

# Modal {#modal}

A modal is an overlay that prevents interaction with the rest of the app until it is dismissed, as Shopify's [Modal reference](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) describes it.

`Modal` renders `ui-modal`. Bind `v-model:open` to open and close it:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const open = ref(false)

function confirm(): void {
  open.value = false
  useAppBridge().toast.show('Reset')
}
</script>

<template>
  <button @click="open = true">Reset settings</button>
  <Modal id="reset-modal" v-model:open="open">
    <p>This restores the default values.</p>
    <TitleBar title="Reset settings?">
      <button variant="primary" @click="confirm">Reset</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

What the component does, following `Modal` in `@shopify/app-bridge-react`:

- `open` calls the element's `show()` or `hide()`. When the modal opens or closes in
  the admin, `show` and `hide` are emitted and `open` is updated through `v-model:open`.
  The modal is hidden when the component unmounts.
- A `TitleBar` (or `<ui-title-bar>`) and a `SaveBar` (or `<ui-save-bar>`) in the default
  slot stay direct children of `ui-modal`. Everything else is rendered into the element's
  `content`, inside one `<div>`.
- `id`, `variant` and `src` are passed to the element.

Shopify's [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
explains how these modals work:

- Modals are rendered by the Shopify admin, in an iframe that is same-origin to your app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Custom JavaScript is not
  copied, and you do not have direct access to the `document`.
- With `src`, the modal loads a route of your app instead. The `ui-modal` types say that
  then "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". The route communicates with your app through `postMessage`, as shown on
  that page.

The page above recommends the `src` modal for anything its limitations rule out. Vue
event handling and Polaris `s-*` elements inside the moved content have not been
verified in the admin yet.

## Calling element methods {#modal-methods}

The component's `$el` is the `ui-modal` element, typed as `UIModalElement`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'polaris-vue-elements/app-bridge'

const modal = ref<InstanceType<typeof Modal> | null>(null)

async function toggle(): Promise<void> {
  await modal.value?.$el.toggle()
}
</script>

<template>
  <Modal ref="modal" id="info-modal">
    <p>Details</p>
  </Modal>
</template>
```

The `shopify.modal` API (`ModalApi`) takes an `id` too, but its types and Shopify's
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
page describe it for the Polaris `s-modal` element. For `ui-modal`, call the element methods as above.

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.

### Confirm a destructive action {#example-confirm-delete}

Use this when a row action deletes something that the merchant can't get back.

```vue
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  SButton,
  STable,
  STableBody,
  STableCell,
  STableHeader,
  STableHeaderRow,
  STableRow,
} from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([
  { id: 'gid://shopify/Product/1', title: 'Wool sweater' },
  { id: 'gid://shopify/Product/2', title: 'Linen shirt' },
])
const pending = ref<Product | null>(null)
const open = ref(false)
const deleting = ref(false)

const title = computed(() => `Delete ${pending.value?.title ?? 'product'}?`)

async function askToDelete(product: Product): Promise<void> {
  pending.value = product
  // Let Vue render the new title before the modal opens.
  await nextTick()
  open.value = true
}

async function confirmDelete(): Promise<void> {
  const product = pending.value
  if (!product || deleting.value) return
  const shopify = useAppBridge()
  deleting.value = true
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    products.value = products.value.filter((p) => p.id !== product.id)
    open.value = false
    shopify.toast.show(`${product.title} deleted`)
  } catch {
    shopify.toast.show('Could not delete the product', { isError: true })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <STable>
    <STableHeaderRow>
      <STableHeader>Product</STableHeader>
      <STableHeader>Actions</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow v-for="product in products" :key="product.id">
        <STableCell>{{ product.title }}</STableCell>
        <STableCell>
          <SButton tone="critical" @click="askToDelete(product)">Delete</SButton>
        </STableCell>
      </STableRow>
    </STableBody>
  </STable>

  <Modal id="delete-product-modal" v-model:open="open" @hide="pending = null">
    <p>This permanently deletes the product. You can't undo this.</p>
    <TitleBar :title="title">
      <button variant="primary" tone="critical" @click="confirmDelete">Delete</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- One modal serves every row. The row sets `pending`, and the title bar names the product.
  The modal body stays static, because Vue updates inside the moved content are not verified.
- Shopify's "Simple message modal" puts the Delete button in the title bar with
  `variant="primary"` and `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- The title bar buttons are direct children of `ui-modal`, so `confirmDelete` runs in your
  page. The toast is shown from there, after the request
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### A short form in a modal {#example-form-modal}

Use this to collect one or two values without leaving the page, such as a note on an order.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ orderId: string }>()

const open = ref(false)
const note = ref('')
const saving = ref(false)

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  saving.value = true
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(props.orderId)}/note`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Note saved')
  } catch {
    shopify.toast.show('Could not save the note', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  note.value = ''
}
</script>

<template>
  <SButton @click="open = true">Add note</SButton>
  <Modal id="order-note-modal" v-model:open="open" @hide="reset">
    <form @submit.prevent="save">
      <label>
        Note
        <textarea v-model="note" name="note" rows="4" />
      </label>
    </form>
    <TitleBar title="Add a note">
      <button variant="primary" @click="save">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- The content is a single `<form>`. Shopify: "You can only provide a single parent element,
  commonly a `p`, `form`, or a `div`"
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` clears the note however the modal closes, including from the admin's close button.
- Not verified: whether `v-model` on the `<textarea>` sees the merchant's typing. App Bridge
  "only copies the HTML elements and stylesheets into the modal frame", and Vue's listeners are
  JavaScript. If it does not work, use a `src` modal, as in the next example.
- Shopify's version of this form also has `data-save-bar`, which connects it to the save bar
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### An editor in a src modal {#example-src-modal}

Use this for content that needs your own JavaScript, such as a rich editor. The modal loads
a route of your app, and the two frames talk with `postMessage`.

::: code-group

```ts [editor-messages.ts]
// Messages between the page and the modal route. Both sides import this file.
export type ToEditor = { type: 'load'; html: string } | { type: 'request-save' }

export type FromEditor = { type: 'ready' } | { type: 'save'; html: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isToEditor(data: unknown): data is ToEditor {
  if (!isRecord(data)) return false
  return data.type === 'request-save' || (data.type === 'load' && typeof data.html === 'string')
}

export function isFromEditor(data: unknown): data is FromEditor {
  if (!isRecord(data)) return false
  return data.type === 'ready' || (data.type === 'save' && typeof data.html === 'string')
}
```

```vue [ProductDescription.vue]
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { isFromEditor, type ToEditor } from './editor-messages'

const props = defineProps<{ productId: string; description: string }>()
const emit = defineEmits<{ saved: [html: string] }>()

const modal = ref<InstanceType<typeof Modal> | null>(null)
const open = ref(false)

function post(message: ToEditor): void {
  // contentWindow is only available while the modal is open.
  modal.value?.$el.contentWindow?.postMessage(message, location.origin)
}

async function save(html: string): Promise<void> {
  const shopify = useAppBridge()
  shopify.loading(true)
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    emit('saved', html)
    open.value = false
    shopify.toast.show('Description saved')
  } catch {
    shopify.toast.show('Could not save the description', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin) return
  if (event.source !== modal.value?.$el.contentWindow) return
  const message: unknown = event.data
  if (!isFromEditor(message)) return
  if (message.type === 'ready') post({ type: 'load', html: props.description })
  else void save(message.html)
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <SButton @click="open = true">Edit description</SButton>
  <Modal
    ref="modal"
    id="description-editor"
    src="/modals/description-editor"
    variant="max"
    v-model:open="open"
  >
    <TitleBar title="Edit description">
      <button variant="primary" @click="post({ type: 'request-save' })">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

```vue [DescriptionEditor.vue]
<script setup lang="ts">
// The route at /modals/description-editor, loaded inside the modal.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { STextArea } from 'polaris-vue-elements'
import { isToEditor, type FromEditor } from './editor-messages'

const html = ref('')
const loaded = ref(false)

function opener(): Window | null {
  // The app page that opened this modal.
  return window.opener as Window | null
}

function post(message: FromEditor): void {
  opener()?.postMessage(message, location.origin)
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin || event.source !== opener()) return
  const message: unknown = event.data
  if (!isToEditor(message)) return
  if (message.type === 'load') {
    html.value = message.html
    loaded.value = true
  } else {
    post({ type: 'save', html: html.value })
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  post({ type: 'ready' })
})
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <STextArea v-model="html" label="Description" :rows="20" :disabled="!loaded" />
</template>
```

:::

- In the modal, `window.opener` is your app page. In the page, the modal's `contentWindow` is
  the route ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  `contentWindow` "can only be accessed when the modal is open" (`UIModalElement`), so the
  route says `ready` first and the page answers with the content.
- Shopify's example sends with `location.origin` as the target origin. The `event.origin`
  and `event.source` checks are added here, so that each side only accepts messages from
  the other.
- The Save button lives in the page's title bar. It asks the route for its content, and
  the page saves it and shows the toast. "You're not able to access App Bridge features
  such as toast directly in your modal"
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- The route needs the `app-bridge.js` script tag and its own CSS and JS. In a Vite app,
  every route is served from `index.html`, which already has the script.
- `variant="max"` must be set before the modal is shown. After that, only `small`, `base`
  and `large` can be set (`UIModalElement`).

### Open a modal from another component {#example-modal-by-id}

Use this when the button that opens a modal lives in a different component from the modal,
such as a help modal opened from several table rows.

::: code-group

```ts [useModalById.ts]
/// <reference types="@shopify/app-bridge-types" />

export interface ModalControls {
  show: () => Promise<void>
  hide: () => Promise<void>
}

// Finds the ui-modal element by its id when it is needed, as in Shopify's
// document.getElementById('my-modal').show() example.
export function useModalById(id: string): ModalControls {
  const element = (): UIModalElement | null =>
    document.getElementById(id) as unknown as UIModalElement | null
  return {
    show: async () => {
      await element()?.show()
    },
    hide: async () => {
      await element()?.hide()
    },
  }
}
```

```vue [ShippingHelpModal.vue]
<script setup lang="ts">
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <Modal id="shipping-help">
    <div>
      <p>Rates are calculated at checkout from the package weight.</p>
      <p>Free shipping applies after discounts.</p>
    </div>
    <TitleBar title="How shipping rates work" />
  </Modal>
</template>
```

```vue [RatesTable.vue]
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useModalById } from './useModalById'

const help = useModalById('shipping-help')
</script>

<template>
  <SButton variant="tertiary" icon="question-circle" accessibilityLabel="How rates work" @click="help.show()" />
</template>
```

:::

- Mount `ShippingHelpModal` once, for example in your layout, and call `show()` from any
  component. The `show()` and `hide()` methods are on `UIModalElement`; Shopify's
  [src modal example](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  calls them through `document.getElementById`.
- The modal has no `v-model:open`, so nothing else needs to know whether it is open.
- Shopify's [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  page shows `shopify.modal.show(id)` with the Polaris `s-modal` element.

### Refresh the page when a modal closes {#example-show-hide-events}

Use this when a modal changes data that the page shows, such as an import that adds products.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
const importing = ref(false)
const count = ref<number | null>(null)

async function loadCount(): Promise<void> {
  const res = await fetch('/api/products/count')
  if (res.ok) count.value = ((await res.json()) as { count: number }).count
}

function onShow(): void {
  importing.value = true
}

async function onHide(): Promise<void> {
  importing.value = false
  await loadCount()
}

onMounted(loadCount)
</script>

<template>
  <SSection heading="Catalog">
    <SStack direction="inline" gap="base" alignItems="center">
      <SText>{{ count ?? '…' }} products</SText>
      <SButton :disabled="importing" @click="open = true">Import products</SButton>
    </SStack>
  </SSection>

  <Modal
    id="import-products"
    src="/modals/import-products"
    v-model:open="open"
    @show="onShow"
    @hide="onHide"
  >
    <TitleBar title="Import products" />
  </Modal>
</template>
```

- `hide` fires whichever way the modal closes, including the admin's close button, so the
  page reloads its data once, in one place. `show` and `hide` are the events that
  `UIModalElement` lists.
- `v-model:open` already follows the modal. Use `@show` and `@hide` for side effects.

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the modal is shown. Use `v-model:open` to keep it in sync when App Bridge closes the modal. Default: `false`. |
| `id` | `string` | A unique identifier for the modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | The size of the modal. Default: `"base"`. Before the modal is shown, it can be set to any of these values; after that, only to `small`, `base` or `large`. |
| `src` | `string` | The URL of the content to show in the modal. With `src`, children other than `ui-title-bar` and `ui-save-bar` are ignored. |

`open` is a prop of the component; `id`, `variant` and `src` are `ui-modal` attributes, passed to the element.

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | The modal was shown. |
| `hide` | `Event` | The modal was hidden. |
| `update:open` | `boolean` | Emitted after `show` or `hide` when the new state differs from `open`, for `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | The modal content. A `TitleBar` (or `<ui-title-bar>`) configures the modal's title bar. It and a `SaveBar` (or `<ui-save-bar>`) stay direct children of `ui-modal`; everything else is rendered into the modal's `content`. |
