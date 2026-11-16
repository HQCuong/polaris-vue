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

`shopify.modal` API (`ModalApi`) भी `id` लेती है, लेकिन उसके types और Shopify का
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
page उसे Polaris के `s-modal` element के लिए बताते हैं। `ui-modal` के लिए, ऊपर की तरह element methods call करें।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।

### किसी destructive action की पुष्टि {#example-confirm-delete}

इसे तब इस्तेमाल करें जब row का कोई action ऐसी चीज़ delete करता है जो merchant वापस नहीं पा सकता।

```vue
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  SButton,
  STable,
  STableBody,
  STableCell,
  STableHeader,
  STableHeaderRow,
  STableRow,
} from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([
  { id: 'gid://shopify/Product/1', title: 'Wool sweater' },
  { id: 'gid://shopify/Product/2', title: 'Linen shirt' },
])
const pending = ref<Product | null>(null)
const open = ref(false)
const deleting = ref(false)

const title = computed(() => `Delete ${pending.value?.title ?? 'product'}?`)

async function askToDelete(product: Product): Promise<void> {
  pending.value = product
  // Let Vue render the new title before the modal opens.
  await nextTick()
  open.value = true
}

async function confirmDelete(): Promise<void> {
  const product = pending.value
  if (!product || deleting.value) return
  const shopify = useAppBridge()
  deleting.value = true
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    products.value = products.value.filter((p) => p.id !== product.id)
    open.value = false
    shopify.toast.show(`${product.title} deleted`)
  } catch {
    shopify.toast.show('Could not delete the product', { isError: true })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <STable>
    <STableHeaderRow>
      <STableHeader>Product</STableHeader>
      <STableHeader>Actions</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow v-for="product in products" :key="product.id">
        <STableCell>{{ product.title }}</STableCell>
        <STableCell>
          <SButton tone="critical" @click="askToDelete(product)">Delete</SButton>
        </STableCell>
      </STableRow>
    </STableBody>
  </STable>

  <Modal id="delete-product-modal" v-model:open="open" @hide="pending = null">
    <p>This permanently deletes the product. You can't undo this.</p>
    <TitleBar :title="title">
      <button variant="primary" tone="critical" @click="confirmDelete">Delete</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- एक modal हर row के लिए काम करता है। Row `pending` सेट करती है, और title bar में product का नाम आता है। Modal का body static रहता है, क्योंकि moved content के अंदर Vue के updates verify नहीं किए गए हैं।
- Shopify का "Simple message modal" Delete button को title bar में `variant="primary"` और `tone="critical"` के साथ रखता है ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal))।
- Title bar के buttons `ui-modal` के सीधे children हैं, इसलिए `confirmDelete` आपके page में चलता है। Toast वहीं से, request के बाद दिखाया जाता है ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api))।

### Modal में एक छोटा form {#example-form-modal}

इसे page छोड़े बिना एक या दो values लेने के लिए इस्तेमाल करें, जैसे किसी order पर note।

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ orderId: string }>()

const open = ref(false)
const note = ref('')
const saving = ref(false)

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  saving.value = true
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(props.orderId)}/note`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Note saved')
  } catch {
    shopify.toast.show('Could not save the note', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  note.value = ''
}
</script>

<template>
  <SButton @click="open = true">Add note</SButton>
  <Modal id="order-note-modal" v-model:open="open" @hide="reset">
    <form @submit.prevent="save">
      <label>
        Note
        <textarea v-model="note" name="note" rows="4" />
      </label>
    </form>
    <TitleBar title="Add a note">
      <button variant="primary" @click="save">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Content एक ही `<form>` है। Shopify: "You can only provide a single parent element, commonly a `p`, `form`, or a `div`" (केवल एक parent element दिया जा सकता है, आम तौर पर `p`, `form` या `div`) ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content))।
- Modal जिस भी तरह बंद हो, `@hide` note को साफ़ कर देता है, admin के close button से बंद होने पर भी।
- Verify नहीं हुआ: `<textarea>` पर `v-model` merchant की typing देख पाता है या नहीं। App Bridge "सिर्फ़ HTML elements और stylesheets को modal frame में copy करता है", और Vue के listeners JavaScript हैं। अगर यह काम न करे, तो अगले example की तरह `src` modal इस्तेमाल करें।
- Shopify के इस form में `data-save-bar` भी है, जो इसे save bar से जोड़ता है ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form))।

### src modal में एक editor {#example-src-modal}

इसे ऐसे content के लिए इस्तेमाल करें जिसे आपका अपना JavaScript चाहिए, जैसे rich editor। Modal आपके app का एक route लोड करता है, और दोनों frames `postMessage` से बात करते हैं।

::: code-group

```ts [editor-messages.ts]
// Messages between the page and the modal route. Both sides import this file.
export type ToEditor = { type: 'load'; html: string } | { type: 'request-save' }

export type FromEditor = { type: 'ready' } | { type: 'save'; html: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isToEditor(data: unknown): data is ToEditor {
  if (!isRecord(data)) return false
  return data.type === 'request-save' || (data.type === 'load' && typeof data.html === 'string')
}

export function isFromEditor(data: unknown): data is FromEditor {
  if (!isRecord(data)) return false
  return data.type === 'ready' || (data.type === 'save' && typeof data.html === 'string')
}
```

```vue [ProductDescription.vue]
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { isFromEditor, type ToEditor } from './editor-messages'

const props = defineProps<{ productId: string; description: string }>()
const emit = defineEmits<{ saved: [html: string] }>()

const modal = ref<InstanceType<typeof Modal> | null>(null)
const open = ref(false)

function post(message: ToEditor): void {
  // contentWindow is only available while the modal is open.
  modal.value?.$el.contentWindow?.postMessage(message, location.origin)
}

async function save(html: string): Promise<void> {
  const shopify = useAppBridge()
  shopify.loading(true)
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    emit('saved', html)
    open.value = false
    shopify.toast.show('Description saved')
  } catch {
    shopify.toast.show('Could not save the description', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin) return
  if (event.source !== modal.value?.$el.contentWindow) return
  const message: unknown = event.data
  if (!isFromEditor(message)) return
  if (message.type === 'ready') post({ type: 'load', html: props.description })
  else void save(message.html)
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <SButton @click="open = true">Edit description</SButton>
  <Modal
    ref="modal"
    id="description-editor"
    src="/modals/description-editor"
    variant="max"
    v-model:open="open"
  >
    <TitleBar title="Edit description">
      <button variant="primary" @click="post({ type: 'request-save' })">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

```vue [DescriptionEditor.vue]
<script setup lang="ts">
// The route at /modals/description-editor, loaded inside the modal.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { STextArea } from 'polaris-vue-elements'
import { isToEditor, type FromEditor } from './editor-messages'

const html = ref('')
const loaded = ref(false)

function opener(): Window | null {
  // The app page that opened this modal.
  return window.opener as Window | null
}

function post(message: FromEditor): void {
  opener()?.postMessage(message, location.origin)
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin || event.source !== opener()) return
  const message: unknown = event.data
  if (!isToEditor(message)) return
  if (message.type === 'load') {
    html.value = message.html
    loaded.value = true
  } else {
    post({ type: 'save', html: html.value })
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  post({ type: 'ready' })
})
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <STextArea v-model="html" label="Description" :rows="20" :disabled="!loaded" />
</template>
```

:::

- Modal में `window.opener` आपका app page है। Page में modal का `contentWindow` वह route है ([मुख्य app frame से बात कैसे करें](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame))। `contentWindow` "can only be accessed when the modal is open" (केवल तब पहुँचा जा सकता है जब modal खुला हो) (`UIModalElement`), इसलिए route पहले `ready` भेजता है और page content के साथ जवाब देता है।
- Shopify का example target origin के रूप में `location.origin` के साथ भेजता है। यहाँ `event.origin` और `event.source` की जाँच जोड़ी गई है, ताकि हर पक्ष सिर्फ़ दूसरे पक्ष के messages स्वीकार करे।
- Save button page के title bar में है। यह route से उसका content माँगता है, और page उसे save करके toast दिखाता है। "You're not able to access App Bridge features such as toast directly in your modal" (आप अपने modal में toast जैसे App Bridge features सीधे इस्तेमाल नहीं कर सकते) ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route))।
- Route को `app-bridge.js` का script tag और अपना CSS और JS चाहिए। Vite app में हर route `index.html` से serve होता है, जिसमें script पहले से है।
- `variant="max"` modal दिखाने से पहले सेट होना चाहिए। उसके बाद केवल `small`, `base` और `large` सेट किए जा सकते हैं (`UIModalElement`)।

### किसी दूसरे component से modal खोलें {#example-modal-by-id}

इसे तब इस्तेमाल करें जब modal खोलने वाला button modal से अलग component में हो, जैसे कई table rows से खुलने वाला help modal।

::: code-group

```ts [useModalById.ts]
/// <reference types="@shopify/app-bridge-types" />

export interface ModalControls {
  show: () => Promise<void>
  hide: () => Promise<void>
}

// Finds the ui-modal element by its id when it is needed, as in Shopify's
// document.getElementById('my-modal').show() example.
export function useModalById(id: string): ModalControls {
  const element = (): UIModalElement | null =>
    document.getElementById(id) as unknown as UIModalElement | null
  return {
    show: async () => {
      await element()?.show()
    },
    hide: async () => {
      await element()?.hide()
    },
  }
}
```

```vue [ShippingHelpModal.vue]
<script setup lang="ts">
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <Modal id="shipping-help">
    <div>
      <p>Rates are calculated at checkout from the package weight.</p>
      <p>Free shipping applies after discounts.</p>
    </div>
    <TitleBar title="How shipping rates work" />
  </Modal>
</template>
```

```vue [RatesTable.vue]
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useModalById } from './useModalById'

const help = useModalById('shipping-help')
</script>

<template>
  <SButton variant="tertiary" icon="question-circle" accessibilityLabel="How rates work" @click="help.show()" />
</template>
```

:::

- `ShippingHelpModal` को एक बार mount करें, जैसे अपने layout में, और किसी भी component से `show()` call करें। `show()` और `hide()` methods `UIModalElement` पर हैं; Shopify का [src modal example](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route) इन्हें `document.getElementById` से call करता है।
- Modal में `v-model:open` नहीं है, इसलिए किसी और को यह जानने की ज़रूरत नहीं कि वह खुला है या नहीं।
- Shopify का [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api) page Polaris के `s-modal` element के साथ `shopify.modal.show(id)` दिखाता है।

### Modal बंद होने पर page refresh करें {#example-show-hide-events}

इसे तब इस्तेमाल करें जब modal ऐसा data बदलता है जो page दिखाता है, जैसे products जोड़ने वाला import।

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
const importing = ref(false)
const count = ref<number | null>(null)

async function loadCount(): Promise<void> {
  const res = await fetch('/api/products/count')
  if (res.ok) count.value = ((await res.json()) as { count: number }).count
}

function onShow(): void {
  importing.value = true
}

async function onHide(): Promise<void> {
  importing.value = false
  await loadCount()
}

onMounted(loadCount)
</script>

<template>
  <SSection heading="Catalog">
    <SStack direction="inline" gap="base" alignItems="center">
      <SText>{{ count ?? '…' }} products</SText>
      <SButton :disabled="importing" @click="open = true">Import products</SButton>
    </SStack>
  </SSection>

  <Modal
    id="import-products"
    src="/modals/import-products"
    v-model:open="open"
    @show="onShow"
    @hide="onHide"
  >
    <TitleBar title="Import products" />
  </Modal>
</template>
```

- Modal जिस भी तरह बंद हो, `hide` fire होता है, admin के close button से भी, इसलिए page अपना data एक ही जगह, एक बार reload करता है। `show` और `hide` वे events हैं जो `UIModalElement` सूचीबद्ध करता है।
- `v-model:open` पहले से modal का अनुसरण करता है। Side effects के लिए `@show` और `@hide` इस्तेमाल करें।

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
