---
title: "SaveBar (ui-save-bar) – Vue 3 के लिए App Bridge"
description: "SaveBar Vue 3 में Shopify App Bridge के ui-save-bar को render करता है, v-model:open, show और hide events और discardConfirmation के साथ। Shopify embedded apps के लिए।"
---

# SaveBar {#save-bar}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें; `open` के लिए [Modal](/hi/app-bridge/modal) देखें।

Save bar बताता है कि मौजूदा page के किसी form में बिना save की गई जानकारी है, जैसा Shopify का [SaveBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) बताता है।

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

## Props और events {#reference}

### Props {#props}

| Prop | Type | विवरण |
| --- | --- | --- |
| `open` | `boolean` | Save bar दिख रहा है या नहीं। App Bridge के save bar छिपाने पर sync बनाए रखने के लिए `v-model:open` इस्तेमाल करें। Default: `false`। |
| `id` | `string` | Save bar का एक unique identifier। |
| `discardConfirmation` | `boolean` | Discard button पर click होने पर confirmation dialog दिखाना है या नहीं। `SaveBar` इसे element की `discardConfirmation` property के रूप में set करता है। |

### Events {#events}

| Event | Type | विवरण |
| --- | --- | --- |
| `show` | `Event` | Save bar दिखाया गया। |
| `hide` | `Event` | Save bar छिपाया गया। |
| `update:open` | `boolean` | नई state `open` से अलग होने पर `show` या `hide` के बाद emit होता है, `v-model:open` के लिए। |

### Slots {#slots}

| Slot | विवरण |
| --- | --- |
| `default` | एक `<button variant="primary">`, जो Save button है, और बिना variant का एक `<button>`, जो Discard button है। Types इन buttons के लिए `disabled` और `loading` भी बताते हैं। |
