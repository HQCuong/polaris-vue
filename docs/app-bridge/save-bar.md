---
title: "SaveBar (ui-save-bar) – App Bridge for Vue 3"
description: "SaveBar renders the Shopify App Bridge ui-save-bar in Vue 3, with v-model:open, show and hide events and discardConfirmation. For Shopify embedded apps."
---

# SaveBar {#save-bar}

The save bar indicates that a form on the current page has unsaved information, as Shopify's [SaveBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) describes it.

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

`open`, `v-model:open`, `show`/`hide` and hiding on unmount work as for [`Modal`](/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") is set as the element's `discardConfirmation` property.

For a form, the `data-save-bar` attribute in the
[embedded-app guide](/guide/shopify-embedded-app#save-bar) needs no component.

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.

### Settings page with a save bar {#example-settings-form}

Use this for a settings page whose fields are Vue state: the save bar shows while the state
differs from what was last saved.

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

- `dirty` is a `computed`, so it is bound with `:open`, not `v-model:open`. Saving or
  discarding makes `dirty` false, and `SaveBar` hides the bar. Shopify's own example also
  hides the bar in its save and discard handlers
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Add the `disabled` or `loading` attribute to a button to disable it or show it as loading
  in the save bar" ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` and `''`/`undefined` add and remove a bare `loading` attribute; a plain
  `:loading="false"` would render `loading="false"`.
- `discard-confirmation` shows a confirmation dialog when the merchant clicks Discard.
- Shopify recommends the [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  during an async save ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### A reusable dirty-form composable {#example-use-dirty-form}

Use this when several pages need the same save and discard logic.

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

- Give each page's `SaveBar` its own `id`.
- The composable holds only Vue state. The App Bridge parts stay in the component:
  `SaveBar`, the toast, and the buttons' `loading` and `disabled` attributes.

### Ask before leaving with Vue Router {#example-leave-confirmation}

Use this on an edit page that the merchant can leave with in-app links or `router.push()`.

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

- While the save bar shows, links in the admin don't open. If your app changes its own
  route, the admin's address bar keeps the previous page, and a reload opens it. Vue
  Router's `push()` counts as a route change
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Shopify's two cases: if the merchant should decide, wait for
  `shopify.saveBar.leaveConfirmation()`; if the navigation ends the edit, wait for
  `shopify.saveBar.hide(id)` first. The guard above also hides the bar after the merchant
  confirms, so that the bar is gone before the route changes.
- `leaveConfirmation()` "resolves when the merchant confirms or when no save bar is
  visible". Shopify does not say what happens when the merchant chooses to stay; the guard
  then keeps waiting, and a later navigation replaces it.
- `SaveBar` hides the bar when it unmounts, but that is after the route change. Shopify:
  "Don't rely on removing the `<ui-save-bar>` element or the form from the page to hide the
  save bar."

### A form with data-save-bar {#example-data-save-bar}

Use this when the edits are fields of one form: App Bridge tracks the fields itself, and no
`SaveBar` is needed.

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

- The `submit` event fires when the merchant clicks Save and the `reset` event when they
  click Discard. `data-discard-confirmation` adds a confirmation before Discard
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge compares each field with its saved value: the value before the merchant's
  first edit. It ignores values that your code sets, so the values loaded in `onMounted`
  don't show the bar. After `submit`, the current values become the saved values and the
  bar hides
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  If your request then fails, the bar is already hidden, so the error toast is the
  merchant's only signal.
- `@reset` copies the saved values back into the Vue state. Without it, `v-model` would
  keep the discarded values.
- Which to use: `data-save-bar` for a standard form, `SaveBar` (`ui-save-bar`) for state
  "that isn't tied to a single form". Shopify: "Choose one approach or the other. Don't
  combine `data-save-bar` with programmatic methods on the same page"
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Values that your code sets {#example-code-set-values}

Use this when a form value comes from code instead of typing, such as a product chosen in
the resource picker.

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

- This is Shopify's "Controlled inputs" example in Vue: a hidden input carries the state,
  and an `input` event that bubbles makes App Bridge check the form again
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- When your code sets values that are already saved (for example "Reset to defaults" that
  saves at once), Shopify says to call the form's `requestSubmit()` instead: the `submit`
  event makes them the saved values
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- The resource picker returns `undefined` when the merchant cancels, so `picked?.[0]` is
  `undefined` and nothing changes.

### Save bar in an AppWindow {#example-save-bar-in-app-window}

Use this for an editor that opens in an [`AppWindow`](/app-bridge/app-window).

Put `data-save-bar` on a form in the window's route, as in the
[full-screen editor example](/app-bridge/app-window#example-window-editor). Shopify: "Don't use
a `<ui-save-bar>` on the parent page and show it from inside the window: that bar belongs to
the parent page, so it appears behind the window and merchants can't see or click Save or
Discard" ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
The window's `hide()` asks the merchant before closing when such a form has unsaved changes
(`SAppWindowElement`).

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the save bar is shown. Use `v-model:open` to keep it in sync when App Bridge hides the save bar. Default: `false`. |
| `id` | `string` | A unique identifier for the save bar. |
| `discardConfirmation` | `boolean` | Whether to show a confirmation dialog when the discard button is clicked. `SaveBar` sets it as the element's `discardConfirmation` property. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | The save bar was shown. |
| `hide` | `Event` | The save bar was hidden. |
| `update:open` | `boolean` | Emitted after `show` or `hide` when the new state differs from `open`, for `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | A `<button variant="primary">`, which is the Save button, and a `<button>` without a variant, which is the Discard button. The types also list `disabled` and `loading` for these buttons. |
