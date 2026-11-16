---
title: "Modal (ui-modal) – modal App Bridge cho Vue 3"
description: "Modal render ui-modal của Shopify App Bridge trong Vue 3: bind v-model:open, nhận các event show và hide, thêm một TitleBar. Import từ polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Modal là một lớp phủ ngăn tương tác với phần còn lại của app cho đến khi bị đóng, như [tài liệu Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) của Shopify mô tả.

`Modal` render `ui-modal`. Hãy bind `v-model:open` để mở và đóng nó:

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

Component làm những gì, theo `Modal` trong `@shopify/app-bridge-react`:

- `open` gọi `show()` hoặc `hide()` của element. Khi modal mở hoặc đóng trong
  trang admin, các sự kiện `show` và `hide` được phát ra và `open` được cập nhật qua `v-model:open`.
  Modal sẽ được ẩn khi component bị unmount.
- `TitleBar` (hoặc `<ui-title-bar>`) và `SaveBar` (hoặc `<ui-save-bar>`) trong default
  slot vẫn là con trực tiếp của `ui-modal`. Mọi thứ khác được render vào `content` của
  element, bên trong một thẻ `<div>`.
- `id`, `variant` và `src` được truyền cho element.

Trang [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
của Shopify giải thích cách các modal này hoạt động:

- Modal được render bởi trang admin Shopify, trong một iframe cùng origin với app của bạn.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." JavaScript tùy chỉnh không được
  sao chép, và bạn không có quyền truy cập trực tiếp vào `document`.
- Với `src`, modal sẽ tải một route của app bạn thay vào đó. Type của `ui-modal` nói rằng
  khi đó "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". Route giao tiếp với app của bạn qua `postMessage`, như được minh họa trên
  trang đó.

Trang trên khuyên dùng modal `src` cho mọi trường hợp vượt quá các giới hạn của nó. Việc xử lý
sự kiện Vue và các element `s-*` của Polaris bên trong nội dung đã được di chuyển vẫn chưa được
xác minh trong trang admin.

## Gọi các method của element {#modal-methods}

`$el` của component là element `ui-modal`, có type là `UIModalElement`:

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

API `shopify.modal` (`ModalApi`) cũng nhận một `id`, nhưng các type của nó và trang
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
của Shopify mô tả nó cho element `s-modal` của Polaris. Với `ui-modal`, hãy gọi các method của element như ở trên.

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.

### Xác nhận một hành động không thể hoàn tác {#example-confirm-delete}

Dùng cách này khi một hành động trên dòng xóa thứ mà người bán không thể lấy lại.
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
- Một modal phục vụ mọi dòng. Dòng đặt `pending`, và title bar nêu tên sản phẩm.
  Phần thân modal giữ tĩnh, vì các cập nhật Vue bên trong nội dung đã bị di chuyển chưa được kiểm chứng.
- Ví dụ "Simple message modal" của Shopify đặt nút Delete trong title bar với
  `variant="primary"` và `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Các nút của title bar là con trực tiếp của `ui-modal`, nên `confirmDelete` chạy trong
  trang của bạn. Toast được hiển thị từ đó, sau khi request hoàn tất
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Một form ngắn trong modal {#example-form-modal}

Dùng cách này để thu thập một hoặc hai giá trị mà không rời trang, ví dụ một ghi chú cho đơn hàng.
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
- Nội dung là một `<form>` duy nhất. Shopify: "You can only provide a single parent element,
  commonly a `p`, `form`, or a `div`" (Bạn chỉ có thể cung cấp một element cha duy nhất,
  thường là `p`, `form` hoặc `div`)
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` xóa ghi chú dù modal đóng bằng cách nào, kể cả từ nút đóng của admin.
- Chưa kiểm chứng: liệu `v-model` trên `<textarea>` có thấy nội dung người bán gõ hay không. App Bridge
  "only copies the HTML elements and stylesheets into the modal frame" (chỉ sao chép các element HTML và stylesheet vào frame của modal), còn các listener của Vue là
  JavaScript. Nếu không hoạt động, hãy dùng modal có `src`, như trong ví dụ tiếp theo.
- Phiên bản form này của Shopify còn có `data-save-bar`, giúp nối nó với save bar
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Một editor trong modal có src {#example-src-modal}

Dùng cách này cho nội dung cần JavaScript riêng của bạn, ví dụ một rich editor. Modal tải
một route của app bạn, và hai frame trao đổi với nhau bằng `postMessage`.

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

- Trong modal, `window.opener` là trang app của bạn. Trong trang, `contentWindow` của modal là
  route đó ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  `contentWindow` "can only be accessed when the modal is open" (chỉ truy cập được khi modal đang mở) (`UIModalElement`), nên
  route gửi `ready` trước và trang trả lời bằng nội dung.
- Ví dụ của Shopify gửi với `location.origin` làm target origin. Các bước kiểm tra `event.origin`
  và `event.source` được thêm vào ở đây, để mỗi bên chỉ nhận message từ
  bên kia.
- Nút Save nằm trong title bar của trang. Nó yêu cầu route gửi nội dung, và
  trang lưu nội dung rồi hiển thị toast. "You're not able to access App Bridge features
  such as toast directly in your modal" (Bạn không thể truy cập trực tiếp các tính năng App Bridge như toast trong modal của bạn)
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- Route cần thẻ script `app-bridge.js` cùng CSS và JS riêng. Trong một app Vite,
  mọi route đều được phục vụ từ `index.html`, vốn đã có sẵn script đó.
- Phải đặt `variant="max"` trước khi modal được hiển thị. Sau đó, chỉ có thể đặt `small`, `base`
  và `large` (`UIModalElement`).

### Mở modal từ một component khác {#example-modal-by-id}

Dùng cách này khi nút mở modal nằm trong một component khác với modal,
ví dụ một modal trợ giúp được mở từ nhiều dòng của bảng.

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

- Mount `ShippingHelpModal` một lần, ví dụ trong layout của bạn, và gọi `show()` từ bất kỳ
  component nào. Các method `show()` và `hide()` nằm trên `UIModalElement`; [ví dụ modal có src](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  của Shopify gọi chúng qua `document.getElementById`.
- Modal này không có `v-model:open`, nên không có gì khác cần biết nó đang mở hay không.
- Trang [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  của Shopify cho thấy `shopify.modal.show(id)` với element `s-modal` của Polaris.

### Làm mới trang khi modal đóng {#example-show-hide-events}

Dùng cách này khi một modal thay đổi dữ liệu mà trang đang hiển thị, ví dụ một lần import thêm sản phẩm.
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
- `hide` được phát ra dù modal đóng bằng cách nào, kể cả nút đóng của admin, nên
  trang tải lại dữ liệu đúng một lần, ở một nơi. `show` và `hide` là các event mà
  `UIModalElement` liệt kê.
- `v-model:open` đã theo dõi modal. Dùng `@show` và `@hide` cho các side effect.

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `open` | `boolean` | Modal có đang hiện hay không. Dùng `v-model:open` để giữ đồng bộ khi App Bridge đóng modal. Mặc định: `false`. |
| `id` | `string` | Định danh duy nhất của modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | Kích thước của modal. Mặc định: `"base"`. Trước khi modal hiện, có thể đặt bất kỳ giá trị nào trong số này; sau đó chỉ đổi được giữa `small`, `base` và `large`. |
| `src` | `string` | URL của nội dung hiển thị trong modal. Khi có `src`, các con ngoài `ui-title-bar` và `ui-save-bar` bị bỏ qua. |

`open` là prop của component; `id`, `variant` và `src` là attribute của `ui-modal`, được truyền cho element.

### Events {#events}

| Event | Kiểu | Mô tả |
| --- | --- | --- |
| `show` | `Event` | Modal đã hiện. |
| `hide` | `Event` | Modal đã ẩn. |
| `update:open` | `boolean` | Phát ra sau `show` hoặc `hide` khi trạng thái mới khác với `open`, dùng cho `v-model:open`. |

### Slots {#slots}

| Slot | Mô tả |
| --- | --- |
| `default` | Nội dung modal. Một `TitleBar` (hoặc `<ui-title-bar>`) cấu hình title bar của modal. Nó và một `SaveBar` (hoặc `<ui-save-bar>`) vẫn là con trực tiếp của `ui-modal`; mọi thứ khác được render vào `content` của modal. |
