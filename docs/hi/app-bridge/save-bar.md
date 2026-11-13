---
title: SaveBar
description: "SaveBar ui-save-bar को render करता है। जैसा ui-save-bar types बताते हैं, \"the button with variant primary is the Save button and the button without a variant is the Discard button\"।"
---

# SaveBar {#save-bar}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें; `open` के लिए [Modal](/hi/app-bridge/modal) देखें।

`SaveBar` `ui-save-bar` को render करता है। जैसा `ui-save-bar` types बताते हैं, "the button with
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

`open`, `v-model:open`, `show`/`hide` और unmount पर छिपना `Modal` की तरह ही काम करते हैं।
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") element की `discardConfirmation` property के रूप में सेट होता है।

किसी form के लिए, [embedded-app guide](/hi/guide/shopify-embedded-app#save-bar) का `data-save-bar`
attribute किसी component के बिना काम करता है।
