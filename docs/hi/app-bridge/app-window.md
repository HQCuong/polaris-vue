---
title: "AppWindow (s-app-window) – Vue 3 के लिए App Bridge"
description: "AppWindow Vue 3 में Shopify App Bridge के s-app-window को render करता है, जो Shopify admin में एक fullscreen modal window है: src ज़रूरी है, v-model:open से खोलें।"
---

# AppWindow {#app-window}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें; `open` के लिए [Modal](/hi/app-bridge/modal) देखें।

Shopify का [s-app-window reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) इसे ऐसे complex workflows के लिए एक fullscreen modal window बताता है जिन्हें अलग screen space चाहिए।

`AppWindow` `s-app-window` को render करता है, जिसे `@shopify/app-bridge-types` docs
"a fullscreen modal window in the Shopify admin" बताते हैं। `src` ज़रूरी है: "the URL is loaded
in an iframe when the window opens"।

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

`open`, `v-model:open`, `show`/`hide` और unmount पर छिपना `Modal` की तरह ही काम करते हैं। इसमें
कोई slot नहीं है।

## Props और events {#reference}

### Props {#props}

| Prop | Type | विवरण |
| --- | --- | --- |
| `open` | `boolean` | Window दिख रहा है या नहीं। App Bridge के window बंद करने पर sync बनाए रखने के लिए `v-model:open` इस्तेमाल करें। Default: `false`। |
| `id` | `string` | App window element का एक unique identifier, जो `commandFor` से buttons जोड़ने या `document.getElementById()` से element पाने में काम आता है। |
| `src` | `string` (ज़रूरी) | Window में दिखाए जाने वाले content का URL। यह आपके app के ऐसे route की ओर होना चाहिए जो window का content render करे, और window खुलने पर यह एक iframe में load होता है। |

### Events {#events}

| Event | Type | विवरण |
| --- | --- | --- |
| `show` | `Event` | Window खुला। |
| `hide` | `Event` | Window बंद हुआ। |
| `update:open` | `boolean` | नई state `open` से अलग होने पर `show` या `hide` के बाद emit होता है, `v-model:open` के लिए। |

### Slots {#slots}

`AppWindow` में कोई slot नहीं है: `SAppWindowAttributes` कोई children define नहीं करता।
