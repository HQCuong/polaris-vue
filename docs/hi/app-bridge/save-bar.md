---
title: "SaveBar (ui-save-bar) – Vue 3 के लिए App Bridge"
description: "SaveBar Vue 3 में Shopify App Bridge के ui-save-bar को render करता है, v-model:open, show और hide events और discardConfirmation के साथ। Shopify embedded apps के लिए।"
---

# SaveBar {#save-bar}

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

`open`, `v-model:open`, `show`/`hide` और unmount पर छिपना [`Modal`](/hi/app-bridge/modal) की तरह ही काम करते हैं।
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") element की `discardConfirmation` property के रूप में सेट होता है।

किसी form के लिए, [embedded-app guide](/hi/guide/shopify-embedded-app#save-bar) का `data-save-bar`
attribute किसी component के बिना काम करता है।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।

### Save bar वाला settings page {#example-settings-form}

इसे ऐसे settings page के लिए इस्तेमाल करें जिसके fields Vue state हैं: save bar तब दिखता है जब state आख़िरी बार save की गई state से अलग हो।

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SCheckbox, SPage, SSection, SStack, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Settings {
  title: string
  enabled: boolean
}

const saved = ref<Settings>({ title: '', enabled: true })
const form = ref<Settings>({ ...saved.value })
const saving = ref(false)

const dirty = computed(
  () => form.value.title !== saved.value.title || form.value.enabled !== saved.value.enabled,
)

onMounted(async () => {
  const res = await fetch('/api/settings')
  if (!res.ok) return
  saved.value = (await res.json()) as Settings
  form.value = { ...saved.value }
})

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  const values = { ...form.value }
  saving.value = true
  shopify.loading(true)
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
    shopify.loading(false)
  }
}

function discard(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Settings">
    <SaveBar id="settings-save-bar" :open="dirty" discard-confirmation>
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="save">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="form.title" label="Title" />
        <SCheckbox v-model="form.enabled" label="Enabled" />
      </SStack>
    </SSection>
  </SPage>
</template>
```

- `dirty` एक `computed` है, इसलिए इसे `v-model:open` से नहीं, `:open` से bind किया गया है। Save या discard करने पर `dirty` false हो जाता है, और `SaveBar` bar को छिपा देता है। Shopify का अपना example भी अपने save और discard handlers में bar को छिपाता है ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api))।
- "Add the `disabled` or `loading` attribute to a button to disable it or show it as loading in the save bar" (save bar में किसी button को disable करने या loading दिखाने के लिए उस पर `disabled` या `loading` attribute जोड़ें) ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element))। `.attr` और `''`/`undefined` एक bare `loading` attribute जोड़ते और हटाते हैं; सादा `:loading="false"` `loading="false"` render करेगा।
- `discard-confirmation` तब confirmation dialog दिखाता है जब merchant Discard पर click करता है।
- Async save के दौरान Shopify [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api) इस्तेमाल करने की सलाह देता है ([Save bar की best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices))।

### दोबारा इस्तेमाल होने वाला dirty-form composable {#example-use-dirty-form}

इसे तब इस्तेमाल करें जब कई pages को एक जैसा save और discard logic चाहिए।

::: code-group

```ts [useDirtyForm.ts]
import { computed, ref, type ComputedRef, type Ref } from 'vue'

export interface DirtyForm<T> {
  /** The values that the form edits. */
  values: Ref<T>
  /** True while `values` differs from the last saved values. */
  dirty: ComputedRef<boolean>
  saving: Ref<boolean>
  /** Sets new saved values, for example after loading them. */
  load: (next: T) => void
  /** Restores the last saved values. */
  discard: () => void
  /** Runs `persist` and, if it resolves, makes the values the saved values. */
  save: (persist: (values: T) => Promise<void>) => Promise<void>
}

// Works for JSON values (strings, numbers, booleans, arrays and plain objects).
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function useDirtyForm<T>(initial: T): DirtyForm<T> {
  const saved = ref(clone(initial)) as Ref<T>
  const values = ref(clone(initial)) as Ref<T>
  const saving = ref(false)
  const dirty = computed(() => JSON.stringify(values.value) !== JSON.stringify(saved.value))

  function load(next: T): void {
    saved.value = clone(next)
    values.value = clone(next)
  }

  function discard(): void {
    values.value = clone(saved.value)
  }

  async function save(persist: (values: T) => Promise<void>): Promise<void> {
    if (saving.value) return
    const snapshot = clone(values.value)
    saving.value = true
    try {
      await persist(snapshot)
      saved.value = snapshot
    } finally {
      saving.value = false
    }
  }

  return { values, dirty, saving, load, discard, save }
}
```

```vue [ShippingSettings.vue]
<script setup lang="ts">
import { onMounted } from 'vue'
import { SNumberField, SPage, SSection } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { useDirtyForm } from './useDirtyForm'

// Field values are strings, as s-number-field's value is.
const { values, dirty, saving, load, discard, save } = useDirtyForm({
  freeShippingOver: '50',
  handlingDays: '2',
})

onMounted(async () => {
  const res = await fetch('/api/shipping-settings')
  if (res.ok) load((await res.json()) as typeof values.value)
})

async function onSave(): Promise<void> {
  const shopify = useAppBridge()
  try {
    await save(async (next) => {
      const res = await fetch('/api/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    })
    shopify.toast.show('Shipping settings saved')
  } catch {
    shopify.toast.show('Could not save shipping settings', { isError: true })
  }
}
</script>

<template>
  <SPage heading="Shipping">
    <SaveBar id="shipping-save-bar" :open="dirty">
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="onSave">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Rates">
      <SNumberField v-model="values.freeShippingOver" label="Free shipping over" :min="0" />
      <SNumberField v-model="values.handlingDays" label="Handling days" :min="0" />
    </SSection>
  </SPage>
</template>
```

:::

- हर page के `SaveBar` को अपना `id` दें।
- Composable में केवल Vue state है। App Bridge के हिस्से component में ही रहते हैं: `SaveBar`, toast, और buttons के `loading` और `disabled` attributes।

### Vue Router के साथ छोड़ने से पहले पूछें {#example-leave-confirmation}

इसे ऐसे edit page पर इस्तेमाल करें जिसे merchant in-app links या `router.push()` से छोड़ सकता है।

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { SButton, SPage, SSection, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const SAVE_BAR_ID = 'product-save-bar'

const props = defineProps<{ productId: string }>()
const router = useRouter()

const saved = ref({ title: '' })
const title = ref('')
const dirty = computed(() => title.value !== saved.value.title)
const url = computed(() => `/api/products/${encodeURIComponent(props.productId)}`)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as { title: string }
  title.value = saved.value.title
})

async function save(): Promise<void> {
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value }),
  })
  if (res.ok) saved.value = { title: title.value }
}

// The merchant decides: wait for the confirmation, then hide the bar before the
// route changes.
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  const shopify = useAppBridge()
  await shopify.saveBar.leaveConfirmation()
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  return true
})

// The navigation ends the edit: hide the bar first, then navigate.
async function deleteProduct(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch(url.value, { method: 'DELETE' })
  if (!res.ok) {
    shopify.toast.show('Could not delete the product', { isError: true })
    return
  }
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  shopify.toast.show('Product deleted')
  await router.push('/products')
}
</script>

<template>
  <SPage heading="Edit product">
    <SaveBar :id="SAVE_BAR_ID" :open="dirty">
      <button variant="primary" @click="save">Save</button>
      <button @click="title = saved.title">Discard</button>
    </SaveBar>
    <SSection>
      <STextField v-model="title" label="Title" />
      <SButton tone="critical" @click="deleteProduct">Delete product</SButton>
    </SSection>
  </SPage>
</template>
```

- Save bar दिखने के दौरान admin के links नहीं खुलते। अगर आपका app अपना route बदलता है, तो admin का address bar पिछला page ही दिखाता रहता है, और reload करने पर वही खुलता है। Vue Router का `push()` route बदलना माना जाता है ([Save bar दिखने के दौरान navigation](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows))।
- Shopify के दो मामले: अगर merchant को तय करना है, तो `shopify.saveBar.leaveConfirmation()` का इंतज़ार करें; अगर navigation से edit ख़त्म होता है, तो पहले `shopify.saveBar.hide(id)` का इंतज़ार करें। ऊपर का guard merchant के confirm करने के बाद bar को भी छिपाता है, ताकि route बदलने से पहले bar हट चुका हो।
- `leaveConfirmation()` "resolves when the merchant confirms or when no save bar is visible" (तब resolve होता है जब merchant confirm करे या कोई save bar दिख न रहा हो)। जब merchant रुकना चुनता है तब क्या होता है, यह Shopify नहीं बताता; guard तब इंतज़ार करता रहता है, और बाद का navigation उसकी जगह ले लेता है।
- `SaveBar` unmount होने पर bar को छिपाता है, लेकिन वह route बदलने के बाद होता है। Shopify: "Don't rely on removing the `<ui-save-bar>` element or the form from the page to hide the save bar." (save bar छिपाने के लिए `<ui-save-bar>` element या form को page से हटाने पर निर्भर न रहें।)

### data-save-bar वाला form {#example-data-save-bar}

इसे तब इस्तेमाल करें जब edits एक ही form के fields हों: App Bridge fields को ख़ुद track करता है, और `SaveBar` की ज़रूरत नहीं होती।

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Profile {
  storeName: string
  description: string
}

const saved = ref<Profile>({ storeName: '', description: '' })
const form = ref<Profile>({ ...saved.value })

onMounted(async () => {
  const res = await fetch('/api/profile')
  if (!res.ok) return
  saved.value = (await res.json()) as Profile
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const values = { ...form.value }
  shopify.loading(true)
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Profile saved')
  } catch {
    shopify.toast.show('Could not save the profile', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Store profile">
    <form data-save-bar data-discard-confirmation @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.storeName" label="Store name" name="storeName" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="4" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

- `submit` event तब fire होता है जब merchant Save पर click करता है और `reset` event तब जब वह Discard पर click करता है। `data-discard-confirmation` Discard से पहले confirmation जोड़ता है ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api))।
- App Bridge हर field की तुलना उसकी saved value से करता है: यानी merchant के पहले edit से पहले की value। यह आपके code द्वारा सेट की गई values को अनदेखा करता है, इसलिए `onMounted` में लोड की गई values से bar नहीं दिखता। `submit` के बाद मौजूदा values saved values बन जाती हैं और bar छिप जाता है ([Save bar changes को कैसे track करता है](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes))। अगर इसके बाद आपकी request fail हो, तो bar पहले ही छिपा होता है, इसलिए error toast ही merchant के लिए एकमात्र संकेत है।
- `@reset` saved values को वापस Vue state में copy करता है। इसके बिना `v-model` discard की गई values को रखे रहेगा।
- कौन सा इस्तेमाल करें: standard form के लिए `data-save-bar`, और ऐसी state के लिए `SaveBar` (`ui-save-bar`) जो "isn't tied to a single form" (किसी एक form से जुड़ी नहीं है)। Shopify: "Choose one approach or the other. Don't combine `data-save-bar` with programmatic methods on the same page" (कोई एक तरीका चुनें। एक ही page पर `data-save-bar` को programmatic methods के साथ न मिलाएँ) ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar))।

### आपके code द्वारा सेट की गई values {#example-code-set-values}

इसे तब इस्तेमाल करें जब form की value typing से नहीं, code से आती है, जैसे resource picker में चुना गया product।

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SButton, SClickableChip, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface FeaturedProduct {
  id: string
  title: string
}

const saved = ref<FeaturedProduct | null>(null)
const selected = ref<FeaturedProduct | null>(null)
const hiddenInput = ref<HTMLInputElement | null>(null)

// App Bridge ignores values that code sets, so tell it with a native input event.
watch(
  selected,
  (product) => {
    const input = hiddenInput.value
    const next = product?.id ?? ''
    if (!input || input.value === next) return
    input.value = next
    input.dispatchEvent(new Event('input', { bubbles: true }))
  },
  { flush: 'post' },
)

async function pick(): Promise<void> {
  const picked = await useAppBridge().resourcePicker({ type: 'product', action: 'select' })
  const product = picked?.[0]
  if (product) selected.value = { id: product.id, title: product.title }
}

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch('/api/featured-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: selected.value?.id ?? null }),
  })
  if (res.ok) {
    saved.value = selected.value
    shopify.toast.show('Featured product saved')
  } else {
    shopify.toast.show('Could not save the featured product', { isError: true })
  }
}

function onReset(): void {
  selected.value = saved.value
}
</script>

<template>
  <SPage heading="Storefront">
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <input ref="hiddenInput" type="hidden" name="productId" />
      <SSection heading="Featured product">
        <SClickableChip v-if="selected" removable @remove="selected = null">
          {{ selected.title }}
        </SClickableChip>
        <SButton v-else @click="pick">Select product</SButton>
      </SSection>
    </form>
  </SPage>
</template>
```

- यह Vue में Shopify का "Controlled inputs" example है: एक hidden input state रखता है, और bubble होने वाला `input` event App Bridge से form को दोबारा जँचवाता है ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api))।
- जब आपका code ऐसी values सेट करता है जो पहले से saved हैं (जैसे "Reset to defaults" जो तुरंत save करता है), तो Shopify कहता है कि इसके बजाय form का `requestSubmit()` call करें: `submit` event उन्हें saved values बना देता है ([Save bar changes को कैसे track करता है](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes))।
- Merchant के cancel करने पर resource picker `undefined` लौटाता है, इसलिए `picked?.[0]` `undefined` होता है और कुछ नहीं बदलता।

### AppWindow में save bar {#example-save-bar-in-app-window}

इसे ऐसे editor के लिए इस्तेमाल करें जो [`AppWindow`](/hi/app-bridge/app-window) में खुलता है।

Window के route में किसी form पर `data-save-bar` लगाएँ, जैसा [full-screen editor example](/hi/app-bridge/app-window#example-window-editor) में है। Shopify: "Don't use a `<ui-save-bar>` on the parent page and show it from inside the window: that bar belongs to the parent page, so it appears behind the window and merchants can't see or click Save or Discard" (parent page पर `<ui-save-bar>` इस्तेमाल करके उसे window के अंदर से न दिखाएँ: वह bar parent page का है, इसलिए window के पीछे दिखता है और merchants Save या Discard को देख या click नहीं सकते) ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window))। जब ऐसे form में unsaved changes हों, तो window का `hide()` बंद करने से पहले merchant से पूछता है (`SAppWindowElement`)।

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
