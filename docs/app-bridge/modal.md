---
title: "Modal (ui-modal) – App Bridge modal for Vue 3"
description: "Modal renders the Shopify App Bridge ui-modal in Vue 3: bind v-model:open, get show and hide events, add a TitleBar. From polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Before you start, see [Install](/app-bridge/#install).

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

`shopify.modal.show(id)` and `shopify.modal.hide(id)` also work with the `id`.

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
