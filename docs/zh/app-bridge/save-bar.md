---
title: "SaveBar (ui-save-bar) – 适用于 Vue 3 的 App Bridge"
description: "SaveBar 在 Vue 3 中渲染 Shopify App Bridge 的 ui-save-bar，支持 v-model:open、show 和 hide 事件以及 discardConfirmation。适用于 Shopify 嵌入式应用。"
---

# SaveBar {#save-bar}

按照 Shopify 的 [SaveBar 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar)的描述，保存栏表示当前页面上的表单有未保存的信息。

`SaveBar` 渲染 `ui-save-bar`。正如 `ui-save-bar` 的类型说明所述，"the button with
variant `primary` is the Save button and the button without a variant is the Discard
button"：

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

`open`、`v-model:open`、`show`/`hide` 以及卸载时隐藏的行为与 [`Modal`](/zh/app-bridge/modal) 相同。
`discardConfirmation`（"whether to show a confirmation dialog when the discard button is
clicked"）会设为元素的 `discardConfirmation` property。

对于表单，[嵌入式应用指南](/zh/guide/shopify-embedded-app#save-bar)中的
`data-save-bar` attribute 不需要组件。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。

### 带保存栏的设置页面 {#example-settings-form}

用于字段是 Vue 状态的设置页面：只要状态与上次保存的内容不同，就显示保存栏。

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

- `dirty` 是一个 `computed`，因此用 `:open` 绑定，而不是 `v-model:open`。保存或放弃
  会使 `dirty` 变为 false，`SaveBar` 随之隐藏保存栏。Shopify 自己的示例也在保存和放弃的
  处理函数中隐藏保存栏
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- “给按钮添加 `disabled` 或 `loading` attribute，即可在保存栏中禁用它或显示加载状态”
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)）。
  `.attr` 以及 `''`/`undefined` 用来添加和移除不带值的 `loading` attribute；
  普通的 `:loading="false"` 会渲染出 `loading="false"`。
- 商家点击 Discard 时，`discard-confirmation` 会显示确认对话框。
- Shopify 建议在异步保存期间使用 [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  （[Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)）。

### 可复用的 dirty-form composable {#example-use-dirty-form}

当多个页面需要相同的保存和放弃逻辑时使用。

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

- 为每个页面的 `SaveBar` 指定各自的 `id`。
- composable 只保存 Vue 状态。App Bridge 相关部分留在组件中：
  `SaveBar`、toast，以及按钮的 `loading` 和 `disabled` attribute。

### 使用 Vue Router 时离开前先询问 {#example-leave-confirmation}

用于商家可以通过应用内链接或 `router.push()` 离开的编辑页面。

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

- 保存栏显示期间，后台中的链接不会打开。如果你的应用更改了自己的路由，后台的地址栏
  仍会保留上一个页面，重新加载时会打开它。Vue Router 的 `push()` 算作路由更改
  （[Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)）。
- Shopify 的两种情形：如果应由商家决定，就等待
  `shopify.saveBar.leaveConfirmation()`；如果导航会结束这次编辑，就先等待
  `shopify.saveBar.hide(id)`。上面的守卫也会在商家确认后隐藏保存栏，
  使保存栏在路由更改之前就已消失。
- `leaveConfirmation()` “在商家确认时，或在没有可见保存栏时 resolve”。
  Shopify 没有说明商家选择留下时会发生什么；此时守卫会继续等待，之后的导航会取代它。
- `SaveBar` 在卸载时会隐藏保存栏，但那是在路由更改之后。Shopify：
  “不要依赖从页面中移除 `<ui-save-bar>` 元素或表单来隐藏保存栏。”

### 带 data-save-bar 的表单 {#example-data-save-bar}

当修改的是同一个表单的字段时使用：App Bridge 会自行跟踪这些字段，不需要 `SaveBar`。

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

- 商家点击 Save 时触发 `submit` 事件，点击 Discard 时触发 `reset` 事件。
  `data-discard-confirmation` 会在 Discard 之前增加一次确认
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- App Bridge 会把每个字段与其已保存的值比较：已保存的值是商家第一次编辑之前的值。
  它会忽略你的代码设置的值，因此在 `onMounted` 中加载的值不会显示保存栏。
  `submit` 之后，当前值成为已保存的值，保存栏随之隐藏
  （[How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)）。
  如果之后你的请求失败，保存栏已经隐藏，所以错误 toast 是商家唯一的提示。
- `@reset` 会把已保存的值复制回 Vue 状态。没有它，`v-model` 会保留已放弃的值。
- 如何选择：标准表单使用 `data-save-bar`，“不与单个表单绑定”的状态使用
  `SaveBar`（`ui-save-bar`）。Shopify：“二选一。不要在同一页面上把 `data-save-bar`
  与编程式方法混用”
  （[Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)）。

### 由你的代码设置的值 {#example-code-set-values}

当表单值来自代码而不是键入时使用，例如在 resource picker 中选择的产品。

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

- 这是 Shopify 的 “Controlled inputs” 示例的 Vue 版本：一个隐藏的 input 承载状态，
  冒泡的 `input` 事件使 App Bridge 重新检查表单
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- 当你的代码设置的值本来就是已保存的值时（例如立即保存的“恢复默认值”），
  Shopify 说应改为调用表单的 `requestSubmit()`：`submit` 事件会使它们成为已保存的值
  （[How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)）。
- 商家取消时，resource picker 返回 `undefined`，因此 `picked?.[0]` 为
  `undefined`，不会有任何更改。

### AppWindow 中的保存栏 {#example-save-bar-in-app-window}

用于在 [`AppWindow`](/zh/app-bridge/app-window) 中打开的编辑器。

把 `data-save-bar` 放在窗口路由中的表单上，如
[全屏编辑器示例](/zh/app-bridge/app-window#example-window-editor)所示。Shopify：“不要在父页面上使用
`<ui-save-bar>` 并从窗口内部显示它：该保存栏属于父页面，因此会出现在窗口后面，
商家看不到也无法点击 Save 或 Discard”
（[Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)）。
当这样的表单有未保存的更改时，窗口的 `hide()` 会在关闭前询问商家
（`SAppWindowElement`）。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 保存栏是否显示。使用 `v-model:open` 在 App Bridge 隐藏保存栏时保持同步。默认值：`false`。 |
| `id` | `string` | 保存栏的唯一标识符。 |
| `discardConfirmation` | `boolean` | 点击放弃（discard）按钮时是否显示确认对话框。`SaveBar` 将它设为元素的 `discardConfirmation` 属性（property）。 |

### Events {#events}

| Event | 类型 | 说明 |
| --- | --- | --- |
| `show` | `Event` | 保存栏已显示。 |
| `hide` | `Event` | 保存栏已隐藏。 |
| `update:open` | `boolean` | 当新状态与 `open` 不同时，在 `show` 或 `hide` 之后触发，供 `v-model:open` 使用。 |

### Slots {#slots}

| Slot | 说明 |
| --- | --- |
| `default` | 一个作为保存按钮的 `<button variant="primary">`，以及一个作为放弃按钮、没有 variant 的 `<button>`。类型还为这些按钮列出了 `disabled` 和 `loading`。 |
