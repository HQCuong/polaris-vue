---
title: SaveBar
description: "SaveBar renders ui-save-bar. As the ui-save-bar types describe, \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Before you start, see [Install](/app-bridge/#install); for `open`, see [Modal](/app-bridge/modal).

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
