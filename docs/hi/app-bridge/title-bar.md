---
title: "TitleBar (ui-title-bar) – Vue 3 के लिए App Bridge"
description: "TitleBar Vue 3 में Shopify App Bridge के ui-title-bar को render करता है, title attribute के रूप में सेट होता है; Modal में यह header और footer सेट करता है। Shopify embedded apps के लिए।"
---

# TitleBar {#title-bar}

Title bar Shopify admin में आपके app के ऊपर दिखता है; Shopify का [TitleBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) बताता है कि इसे customize कैसे करें।

`TitleBar` `ui-title-bar` को render करता है, जिसमें `title` एक attribute के रूप में सेट होता है। `Modal` में
यह modal का header और footer सेट करता है। इसके children `<button>` और `<a>` elements हैं;
`ui-title-bar` types `variant="primary"` या `variant="breadcrumb"`, `tone="critical"`, और
`<section label="...">` groups की अनुमति देते हैं। Page title bar के लिए Shopify अब
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
document करता है, जो [`SPage`](/hi/components/s-page) है।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।

### Modal में title और actions {#example-title-bar-in-modal}

इसे modal को उसका heading और footer buttons देने के लिए इस्तेमाल करें, यहाँ एक bulk action के लिए जिसका title चुने गए items गिनता है।

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ selectedIds: string[] }>()

const open = ref(false)
const publishing = ref(false)
const title = computed(() => {
  const n = props.selectedIds.length
  return `Publish ${n} ${n === 1 ? 'product' : 'products'}?`
})

async function publish(): Promise<void> {
  if (publishing.value) return
  const shopify = useAppBridge()
  publishing.value = true
  try {
    const res = await fetch('/api/products/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: props.selectedIds }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Products published')
  } catch {
    shopify.toast.show('Could not publish the products', { isError: true })
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton :disabled="selectedIds.length === 0" @click="open = true">Publish</SButton>
  <Modal id="publish-modal" v-model:open="open">
    <p>The products become visible on your online store.</p>
    <TitleBar :title="title">
      <button variant="primary" @click="publish">Publish</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Modal में `TitleBar` modal का header और footer सेट करता है। Shopify के "Simple form" example की तरह, मुख्य button में `variant="primary"` है और Cancel में कोई variant नहीं है ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form))।
- Buttons के click handlers आपके page में चलते हैं, इसलिए `publish` toast दिखा सकता है।
- Destructive action के लिए, मुख्य button में `tone="critical"` जोड़ें, जैसा [delete confirmation example](/hi/app-bridge/modal#example-confirm-delete) में है।
- Title modal खुलने से पहले चुने गए items से compute होता है। Modal खुले रहने के दौरान बदलने वाले title को App Bridge उठाता है या नहीं, यह verify नहीं किया गया है।

### s-page के साथ page का title bar {#example-page-title-bar}

इसे page के title bar के लिए इस्तेमाल करें। Shopify अब इसे `ui-title-bar` से नहीं, `s-page` से configure करता है।

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBadge, SButton, SLink, SMenu, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  title: string
  status: 'ACTIVE' | 'DRAFT'
}

const props = defineProps<{ productId: string }>()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}`)
  if (res.ok) product.value = (await res.json()) as Product
})

function save(): void {
  useAppBridge().toast.show('Product saved')
}
</script>

<template>
  <SPage :heading="product?.title ?? 'Product'">
    <template #breadcrumb-actions>
      <SLink href="/products">Products</SLink>
    </template>
    <template #accessory>
      <SBadge v-if="product?.status === 'DRAFT'" tone="warning">Draft</SBadge>
    </template>
    <template #primary-action>
      <SButton variant="primary" @click="save">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton commandFor="product-more-actions">More actions</SButton>
    </template>
    <SMenu id="product-more-actions">
      <SButton>Duplicate</SButton>
      <SButton tone="critical">Delete</SButton>
    </SMenu>
    <SSection heading="Details">…</SSection>
  </SPage>
</template>
```

- Shopify का title bar page `s-page` के `breadcrumb-actions`, `accessory`, `primary-action` और `secondary-actions` slots, `commandFor` से खुलने वाले menu, और हर page पर "only one primary action" (केवल एक primary action) के बारे में बताता है ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar))।
- `heading` लोड हुए record का अनुसरण करता है, इसलिए title bar में product का नाम आता है।
- `ui-title-bar` के types `variant="breadcrumb"` वाले buttons और links, और `<section label="...">` groups की भी अनुमति देते हैं। Shopify के मौजूदा pages यह नहीं बताते कि वे कैसे दिखते हैं, इसलिए इस page में उनका कोई example नहीं है।

## Props और events {#reference}

### Props {#props}

| Prop | Type | विवरण |
| --- | --- | --- |
| `title` | `string` | Title bar का title। इसे `document.title` से भी set किया जा सकता है। `TitleBar` इसे हमेशा attribute के रूप में set करता है। |

`TitleBar` कोई event emit नहीं करता।

### Slots {#slots}

| Slot | विवरण |
| --- | --- |
| `default` | `<button>` और `<a>` elements, और उनके `<section>` groups, जैसा नीचे है। |

`ui-title-bar` types इन children का वर्णन करते हैं:

| Child | Attributes |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Types में note है कि Remix में anchor elements supported नहीं हैं, जहाँ उनकी जगह Remix का `<Link>` component इस्तेमाल किया जा सकता है। |
| `<section>` | `label`: `string`. इसके children `<a>` और `<button>` elements हैं। |

इन types में `<button>` और `<a>` `id`, `name`, `class`, `href`, `rel`, `target` और `onclick` भी लेते हैं।
