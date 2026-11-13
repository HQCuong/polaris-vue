---
title: SaveBar
description: "SaveBar render ui-save-bar. Như type của ui-save-bar mô tả, \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install); về `open`, xem [Modal](/vi/app-bridge/modal).

`SaveBar` render `ui-save-bar`. Như type của `ui-save-bar` mô tả, "the button with
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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") được đặt làm property `discardConfirmation` của element.

Với một form, attribute `data-save-bar` trong
[hướng dẫn embedded app](/vi/guide/shopify-embedded-app#save-bar) không cần component nào.
