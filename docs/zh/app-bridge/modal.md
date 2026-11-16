---
title: "Modal (ui-modal) – 适用于 Vue 3 的 App Bridge modal"
description: "Modal 在 Vue 3 中渲染 Shopify App Bridge 的 ui-modal：绑定 v-model:open，接收 show 和 hide 事件，并添加 TitleBar。从 polaris-vue-elements/app-bridge 导入。"
---

# Modal {#modal}

按照 Shopify 的 [Modal 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/modal)的描述，modal 是一个覆盖层，在关闭之前会阻止与应用其余部分的交互。

`Modal` 渲染 `ui-modal`。绑定 `v-model:open` 即可打开和关闭它：

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

该组件的行为遵循 `@shopify/app-bridge-react` 中的 `Modal`：

- `open` 会调用元素的 `show()` 或 `hide()`。当 modal 在后台中打开或关闭时，
  会触发 `show` 和 `hide`，并通过 `v-model:open` 更新 `open`。
  组件卸载时 modal 会被隐藏。
- 默认 slot 中的 `TitleBar`（或 `<ui-title-bar>`）和 `SaveBar`（或 `<ui-save-bar>`）
  仍是 `ui-modal` 的直接子元素。其余所有内容都会渲染到元素的
  `content` 中，并包在一个 `<div>` 里。
- `id`、`variant` 和 `src` 会传递给元素。

Shopify 的 [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
解释了这些 modal 的工作方式：

- Modal 由 Shopify 后台渲染，位于与你的应用同源的 iframe 中。
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." 自定义 JavaScript 不会
  被复制，并且你无法直接访问 `document`。
- 使用 `src` 时，modal 会改为加载你应用的一个路由。`ui-modal` 的类型说明指出，
  此时 "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored"。该路由通过 `postMessage` 与你的应用通信，如该页面所示。

上述页面建议，凡是超出这些限制的场景都使用 `src` modal。被移动的内容中的 Vue
事件处理和 Polaris `s-*` 元素，尚未在后台中验证。

## 调用元素方法 {#modal-methods}

组件的 `$el` 就是 `ui-modal` 元素，类型为 `UIModalElement`：

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

`shopify.modal` API（`ModalApi`）同样接受 `id`，但它的类型以及 Shopify 的
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
页面描述的是 Polaris 的 `s-modal` 元素。对于 `ui-modal`，请像上文那样调用元素方法。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。

### 确认破坏性操作 {#example-confirm-delete}

当某个行操作会删除商家无法找回的内容时，使用这个示例。

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

- 一个 modal 服务所有行。行设置 `pending`，标题栏显示产品名称。
  modal 正文保持静态，因为被移动的内容中的 Vue 更新尚未验证。
- Shopify 的 “Simple message modal” 把 Delete 按钮放在标题栏中，并设置
  `variant="primary"` 和 `tone="critical"`
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)）。
- 标题栏按钮是 `ui-modal` 的直接子元素，因此 `confirmDelete` 在你的页面中运行。
  toast 在请求完成后从这里显示
  （[Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)）。

### modal 中的简短表单 {#example-form-modal}

当你需要在不离开页面的情况下收集一两个值时使用，例如订单备注。

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

- 内容是单个 `<form>`。Shopify：“你只能提供一个父元素，通常是 `p`、`form` 或 `div`”
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)）。
- 无论 modal 以何种方式关闭，包括通过后台的关闭按钮，`@hide` 都会清空备注。
- 尚未验证：`<textarea>` 上的 `v-model` 能否看到商家的输入。App Bridge
  “只会把 HTML 元素和样式表复制到 modal 框架中”，而 Vue 的监听器是 JavaScript。
  如果它不起作用，请使用 `src` modal，如下一个示例所示。
- Shopify 的这个表单还带有 `data-save-bar`，用来把它连接到保存栏
  （[Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)）。

### src modal 中的编辑器 {#example-src-modal}

当内容需要你自己的 JavaScript（例如富文本编辑器）时使用。modal 会加载你应用的一个路由，
两个框架通过 `postMessage` 通信。

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

- 在 modal 中，`window.opener` 是你的应用页面。在页面中，modal 的 `contentWindow` 是该路由
  （[How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)）。
  `contentWindow` “只能在 modal 打开时访问”（`UIModalElement`），因此路由先发送 `ready`，
  页面再用内容作为回应。
- Shopify 的示例使用 `location.origin` 作为目标 origin。这里额外加入了 `event.origin`
  和 `event.source` 检查，使双方只接受来自对方的消息。
- Save 按钮位于页面的标题栏中。它向路由请求内容，页面保存内容并显示 toast。
  “你无法在 modal 中直接访问 toast 等 App Bridge 功能”
  （[Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)）。
- 该路由需要 `app-bridge.js` 脚本标签以及它自己的 CSS 和 JS。在 Vite 应用中，
  每个路由都由 `index.html` 提供，其中已经包含该脚本。
- `variant="max"` 必须在 modal 显示之前设置。之后只能设置 `small`、`base`
  和 `large`（`UIModalElement`）。

### 从其他组件打开 modal {#example-modal-by-id}

当打开 modal 的按钮与 modal 位于不同组件中时使用，例如从多个表格行打开的帮助 modal。

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

- 只需挂载一次 `ShippingHelpModal`，例如在你的布局中，然后从任何组件调用 `show()`。
  `show()` 和 `hide()` 方法位于 `UIModalElement` 上；Shopify 的
  [src modal 示例](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  通过 `document.getElementById` 调用它们。
- 该 modal 没有 `v-model:open`，因此其他部分不需要知道它是否打开。
- Shopify 的 [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  页面用 Polaris 的 `s-modal` 元素展示了 `shopify.modal.show(id)`。

### modal 关闭时刷新页面 {#example-show-hide-events}

当 modal 会更改页面所显示的数据时使用，例如添加产品的导入。

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

- 无论 modal 以何种方式关闭，包括后台的关闭按钮，`hide` 都会触发，因此页面只在一个地方
  重新加载一次数据。`show` 和 `hide` 是 `UIModalElement` 列出的事件。
- `v-model:open` 已经跟随 modal 的状态。副作用请使用 `@show` 和 `@hide`。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | modal 是否显示。使用 `v-model:open` 在 App Bridge 关闭 modal 时保持同步。默认值：`false`。 |
| `id` | `string` | modal 的唯一标识符。 |
| `variant` | `"small" \| "base" \| "large" \| "max"` | modal 的尺寸。默认值：`"base"`。modal 显示之前可以设为其中任意值；显示之后只能在 `small`、`base` 和 `large` 之间切换。 |
| `src` | `string` | 在 modal 中显示的内容的 URL。设置 `src` 后，除 `ui-title-bar` 和 `ui-save-bar` 之外的子元素都会被忽略。 |

`open` 是组件的 prop；`id`、`variant` 和 `src` 是 `ui-modal` 的属性，会传递给元素。

### Events {#events}

| Event | 类型 | 说明 |
| --- | --- | --- |
| `show` | `Event` | modal 已显示。 |
| `hide` | `Event` | modal 已隐藏。 |
| `update:open` | `boolean` | 当新状态与 `open` 不同时，在 `show` 或 `hide` 之后触发，供 `v-model:open` 使用。 |

### Slots {#slots}

| Slot | 说明 |
| --- | --- |
| `default` | modal 的内容。`TitleBar`（或 `<ui-title-bar>`）用于配置 modal 的标题栏。它和 `SaveBar`（或 `<ui-save-bar>`）仍是 `ui-modal` 的直接子元素；其余所有内容都渲染到 modal 的 `content` 中。 |
