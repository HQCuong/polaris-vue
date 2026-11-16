---
title: "SaveBar (ui-save-bar) – App Bridge for Vue 3"
description: "SaveBar renders the Shopify App Bridge ui-save-bar in Vue 3, with v-model:open, show and hide events and discardConfirmation. For Shopify embedded apps."
---

# SaveBar {#save-bar}

Before you start, see [Install](/app-bridge/#install); for `open`, see [Modal](/app-bridge/modal).

The save bar indicates that a form on the current page has unsaved information, as Shopify's [SaveBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) describes it.

`SaveBar` renders `ui-save-bar`. As the `ui-save-bar` types describe, "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button":

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SaveBar } from 'polaris-vue-elements/app-bridge'

const dirty = ref(false)

function save(): void {
  dirty.value = false
}
function discard(): void {
  dirty.value = false
}
</script>

<template>
  <SaveBar id="settings-save-bar" v-model:open="dirty" discard-confirmation>
    <button variant="primary" @click="save">Save</button>
    <button @click="discard">Discard</button>
  </SaveBar>
</template>
```

`open`, `v-model:open`, `show`/`hide` and hiding on unmount work as for `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") is set as the element's `discardConfirmation` property.

For a form, the `data-save-bar` attribute in the
[embedded-app guide](/guide/shopify-embedded-app#save-bar) needs no component.

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the save bar is shown. Use `v-model:open` to keep it in sync when App Bridge hides the save bar. Default: `false`. |
| `id` | `string` | A unique identifier for the save bar. |
| `discardConfirmation` | `boolean` | Whether to show a confirmation dialog when the discard button is clicked. `SaveBar` sets it as the element's `discardConfirmation` property. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | The save bar was shown. |
| `hide` | `Event` | The save bar was hidden. |
| `update:open` | `boolean` | Emitted after `show` or `hide` when the new state differs from `open`, for `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | A `<button variant="primary">`, which is the Save button, and a `<button>` without a variant, which is the Discard button. The types also list `disabled` and `loading` for these buttons. |
