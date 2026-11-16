---
title: "AppWindow (s-app-window) – Vue 3 के लिए App Bridge"
description: "AppWindow Vue 3 में Shopify App Bridge के s-app-window को render करता है, जो Shopify admin में एक fullscreen modal window है: src ज़रूरी है, v-model:open से खोलें।"
---

# AppWindow {#app-window}

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

`open`, `v-model:open`, `show`/`hide` और unmount पर छिपना [`Modal`](/hi/app-bridge/modal) की तरह ही काम करते हैं। इसमें
कोई slot नहीं है।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।

### Full-screen editor {#example-window-editor}

इसे ऐसे editor के लिए इस्तेमाल करें जिसे पूरी screen चाहिए, और जो records की सूची से खुलता है।

::: code-group

```vue [ProductList.vue]
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const editingId = ref<string | null>(null)
const open = ref(false)

// The window loads this route of your app in an iframe.
const src = computed(() =>
  editingId.value ? `/products/${encodeURIComponent(editingId.value)}/editor` : null,
)

function edit(product: Product): void {
  editingId.value = product.id
  open.value = true
}

async function reload(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

onMounted(reload)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="base">
      <SStack v-for="product in products" :key="product.id" direction="inline" gap="base">
        <SText>{{ product.title }}</SText>
        <SButton @click="edit(product)">Open editor</SButton>
      </SStack>
    </SStack>
  </SSection>
  <AppWindow v-if="src" id="product-editor" :src="src" v-model:open="open" @hide="reload" />
</template>
```

```vue [ProductEditor.vue]
<script setup lang="ts">
// The route at /products/:id/editor, loaded inside the window.
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SBanner, SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'

interface ProductDraft {
  title: string
  description: string
}

const route = useRoute()
const url = computed(() => `/api/products/${encodeURIComponent(String(route.params.id))}`)

const saved = ref<ProductDraft>({ title: '', description: '' })
const form = ref<ProductDraft>({ ...saved.value })
const error = ref(false)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as ProductDraft
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const values = { ...form.value }
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  error.value = !res.ok
  if (res.ok) saved.value = values
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage :heading="saved.title || 'Product editor'">
    <SBanner v-if="error" tone="critical">The product could not be saved.</SBanner>
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.title" label="Product title" name="title" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="12" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

:::

- `src` "must point to a route within your app" (आपके app के भीतर के किसी route की ओर होना चाहिए), और "the URL is loaded in an iframe when the window opens" (window खुलने पर URL एक iframe में लोड होता है) (`SAppWindowAttributes`)। Window खुली होने पर `src` बदलने से वह नए URL पर चली जाती है (`SAppWindowElement`)।
- Window के लिए Shopify की best practices: उसे केवल किसी स्पष्ट action से खोलें, window के content में `s-page` से heading सेट करें, उसके forms में `data-save-bar` जोड़ें, और बंद होने पर merchant को वहीं लौटाएँ जहाँ से उसने शुरू किया था ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices))।
- Window तब render होती है जब कोई record चुना जा चुका हो, क्योंकि `src` ज़रूरी है।
- `@hide="reload"` हर बार बंद होने के बाद सूची को refresh करता है। Shopify `hide` event के उपयोगों में "updating UI state" (UI state को update करना) गिनाता है (`SAppWindowElement`)।
- Form [data-save-bar example](/hi/app-bridge/save-bar#example-data-save-bar) का अनुसरण करता है। जब उसमें unsaved changes हों, तो window का `hide()` बंद करने से पहले merchant से पूछता है।
- Editor errors को page में दिखाता है। Shopify यह नहीं बताता कि toast जैसी कौन सी App Bridge APIs window के अंदर काम करती हैं।
- Shopify यह documented नहीं करता कि window का route window को कैसे बंद करता है या आपके page को data वापस कैसे भेजता है। Page element के `contentWindow` से route तक पहुँच सकता है ("use this to communicate with the iframe content via `postMessage()`", यानी iframe के content से `postMessage()` के ज़रिए बात करने के लिए इसका इस्तेमाल करें), लेकिन केवल तब जब window खुली हो।

### चुने गए items को bulk edit करें {#example-window-bulk-edit}

इसे तब इस्तेमाल करें जब merchant rows चुनता है और उन्हें full-screen view में एक साथ edit करता है।

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SCheckbox, SSection, SStack } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const selected = ref<string[]>([])
const open = ref(false)

// The selection travels in the URL, which the bulk-edit route reads.
const src = computed(() => `/bulk-edit?ids=${encodeURIComponent(selected.value.join(','))}`)

function toggle(id: string): void {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id]
}

async function load(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

async function onHide(): Promise<void> {
  selected.value = []
  await load()
}

onMounted(load)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="small-200">
      <SCheckbox
        v-for="product in products"
        :key="product.id"
        :label="product.title"
        :checked="selected.includes(product.id)"
        @change="toggle(product.id)"
      />
    </SStack>
    <SButton :disabled="selected.length === 0" @click="open = true">
      Edit {{ selected.length }} selected
    </SButton>
  </SSection>
  <AppWindow id="bulk-editor" :src="src" v-model:open="open" @hide="onHide" />
</template>
```

- Shopify `src` के उपयोगों में bulk editors का नाम लेता है (`SAppWindowAttributes`)। Route आपके app का एक सामान्य page है, इसलिए वह चुने गए items को अपनी query string से पढ़ता है।
- Window बंद होने के बाद `onHide` चयन को साफ़ करता है और सूची को reload करता है।

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
