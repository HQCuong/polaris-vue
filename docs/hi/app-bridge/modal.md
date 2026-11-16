---
title: "Modal (ui-modal) – Vue 3 के लिए App Bridge modal"
description: "Modal Vue 3 में Shopify App Bridge के ui-modal को render करता है: v-model:open bind करें, show और hide events पाएँ, TitleBar जोड़ें। polaris-vue-elements/app-bridge से import करें।"
---

# Modal {#modal}

Modal एक overlay है जो बंद होने तक app के बाक़ी हिस्से से interaction रोकता है, जैसा Shopify का [Modal reference](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) बताता है।

`Modal` `ui-modal` को render करता है। इसे खोलने और बंद करने के लिए `v-model:open` bind करें:

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

`@shopify/app-bridge-react` के `Modal` के अनुसार, यह component क्या करता है:

- `open` element के `show()` या `hide()` को call करता है। जब admin में modal खुलता या बंद होता है,
  तो `show` और `hide` emit होते हैं और `open`, `v-model:open` के ज़रिए update होता है।
  Component unmount होने पर modal छिपा दिया जाता है।
- Default slot में `TitleBar` (या `<ui-title-bar>`) और `SaveBar` (या `<ui-save-bar>`)
  `ui-modal` के सीधे children बने रहते हैं। बाक़ी सब कुछ element के `content` में, एक `<div>` के
  अंदर render होता है।
- `id`, `variant` और `src` element को पास किए जाते हैं।

Shopify की [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
बताती है कि ये modals कैसे काम करते हैं:

- Modals को Shopify admin render करता है, एक ऐसे iframe में जो आपके app के same-origin है।
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Custom JavaScript कॉपी नहीं होती, और
  आपको `document` तक सीधी पहुँच नहीं मिलती।
- `src` के साथ, modal इसके बजाय आपके app का एक route लोड करता है। `ui-modal` types कहते हैं कि
  तब "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored"। Route आपके app से `postMessage` के ज़रिए बात करता है, जैसा उस page पर दिखाया गया है।

ऊपर का page उन सभी स्थितियों के लिए `src` वाले modal की सलाह देता है जिन्हें इसकी सीमाएँ रोकती हैं। स्थानांतरित किए गए
content के अंदर Vue का event handling और Polaris के `s-*` elements admin में अभी verify नहीं किए गए हैं।

## Element methods को call करना {#modal-methods}

Component का `$el` `ui-modal` element है, जिसका type `UIModalElement` है:

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

`shopify.modal.show(id)` और `shopify.modal.hide(id)` भी `id` के साथ काम करते हैं।

## Props और events {#reference}

### Props {#props}

| Prop | Type | विवरण |
| --- | --- | --- |
| `open` | `boolean` | Modal दिख रहा है या नहीं। App Bridge के modal बंद करने पर sync बनाए रखने के लिए `v-model:open` इस्तेमाल करें। Default: `false`। |
| `id` | `string` | Modal का एक unique identifier। |
| `variant` | `"small" \| "base" \| "large" \| "max"` | Modal का size। Default: `"base"`। Modal दिखने से पहले इसे इनमें से कोई भी value दी जा सकती है; उसके बाद सिर्फ़ `small`, `base` या `large`। |
| `src` | `string` | Modal में दिखाए जाने वाले content का URL। `src` होने पर `ui-title-bar` और `ui-save-bar` के अलावा बाक़ी children ignore होते हैं। |

`open` component का prop है; `id`, `variant` और `src` `ui-modal` के attributes हैं, जो element को पास किए जाते हैं।

### Events {#events}

| Event | Type | विवरण |
| --- | --- | --- |
| `show` | `Event` | Modal दिखाया गया। |
| `hide` | `Event` | Modal छिपाया गया। |
| `update:open` | `boolean` | नई state `open` से अलग होने पर `show` या `hide` के बाद emit होता है, `v-model:open` के लिए। |

### Slots {#slots}

| Slot | विवरण |
| --- | --- |
| `default` | Modal का content। एक `TitleBar` (या `<ui-title-bar>`) modal का title bar configure करता है। यह और एक `SaveBar` (या `<ui-save-bar>`) `ui-modal` के सीधे children बने रहते हैं; बाक़ी सब कुछ modal के `content` में render होता है। |
