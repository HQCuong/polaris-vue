---
title: "Modal (ui-modal) – Vue 3 向け App Bridge modal"
description: "Modal は Vue 3 で Shopify App Bridge の ui-modal をレンダリングします。v-model:open をバインドし、show と hide イベントを受け取り、TitleBar を追加します。polaris-vue-elements/app-bridge からインポートします。"
---

# Modal {#modal}

Shopify の [Modal リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/modal)によると、モーダルは閉じられるまでアプリの他の部分の操作を妨げるオーバーレイです。

`Modal` は `ui-modal` をレンダリングします。`v-model:open` をバインドして開閉します。

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

`@shopify/app-bridge-react` の `Modal` に倣った、コンポーネントの動作は次のとおりです。

- `open` は要素の `show()` または `hide()` を呼び出します。管理画面でモーダルが開閉すると、
  `show` と `hide` が emit され、`open` は `v-model:open` を通じて更新されます。
  コンポーネントがアンマウントされると、モーダルは非表示になります。
- デフォルト slot 内の `TitleBar`（または `<ui-title-bar>`）と `SaveBar`（または `<ui-save-bar>`）は、
  `ui-modal` の直接の子のままになります。それ以外はすべて、1 つの `<div>` の中で、要素の
  `content` にレンダリングされます。
- `id`、`variant`、`src` は要素に渡されます。

Shopify の[Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
では、これらのモーダルの仕組みを説明しています。

- モーダルは Shopify 管理画面によって、アプリと同一オリジンの iframe 内にレンダリングされます。
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." カスタム JavaScript はコピーされず、
  `document` に直接アクセスすることもできません。
- `src` を指定すると、モーダルは代わりにアプリのルートを読み込みます。`ui-modal` の型には、その場合
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored" と記載されています。ルートは、そのページに示されているとおり、`postMessage` を通じてアプリと通信します。

上記のページでは、これらの制限で対応できない用途には `src` モーダルを推奨しています。移動された
コンテンツ内での Vue のイベント処理と Polaris `s-*` 要素は、管理画面ではまだ検証されていません。

## 要素のメソッドを呼び出す {#modal-methods}

コンポーネントの `$el` は `ui-modal` 要素で、型は `UIModalElement` です。

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

`shopify.modal` API（`ModalApi`）も `id` を受け取りますが、その型と Shopify の
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
ページは、Polaris の `s-modal` 要素向けに説明しています。`ui-modal` では、上記のように要素のメソッドを呼び出してください。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。

### 元に戻せない操作を確認する {#example-confirm-delete}

行の操作で、マーチャントが元に戻せないものを削除する場合に使います。

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

- 1 つのモーダルをすべての行で使い回します。行が `pending` を設定し、タイトルバーが商品名を表示します。
  移動されたコンテンツ内の Vue の更新は検証されていないため、モーダルの本文は固定のままにしています。
- Shopify の "Simple message modal" は、Delete ボタンをタイトルバーに置き、`variant="primary"` と
  `tone="critical"` を指定します
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)）。
- タイトルバーのボタンは `ui-modal` の直接の子なので、`confirmDelete` はページ内で実行されます。
  トーストは、リクエストの後にそこから表示されます
  （[Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)）。

### モーダル内の短いフォーム {#example-form-modal}

ページを離れずに、注文のメモなど 1～2 個の値を集めるために使います。

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

- コンテンツは 1 つの `<form>` です。Shopify："You can only provide a single parent element,
  commonly a `p`, `form`, or a `div`"（親要素は 1 つだけ指定できます。通常は `p`、`form`、`div` です）
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)）。
- `@hide` は、管理画面の閉じるボタンからを含め、モーダルがどのように閉じても、メモをクリアします。
- 未検証：`<textarea>` への `v-model` がマーチャントの入力を受け取れるかどうか。App Bridge は
  "only copies the HTML elements and stylesheets into the modal frame"（HTML 要素とスタイルシートだけをモーダルの
  フレームにコピーする）ため、Vue のリスナーは JavaScript なので引き継がれません。動作しない場合は、次の例のように
  `src` モーダルを使ってください。
- Shopify のこのフォームには `data-save-bar` もあり、保存バーと連携します
  （[Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)）。

### src モーダル内のエディター {#example-src-modal}

リッチエディターのように、独自の JavaScript が必要なコンテンツに使います。モーダルはアプリのルートを
読み込み、2 つのフレームは `postMessage` で通信します。

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

- モーダル内では、`window.opener` がアプリのページです。ページ側では、モーダルの `contentWindow` が
  ルートです（[How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)）。
  `contentWindow` は "can only be accessed when the modal is open"（モーダルが開いているときだけアクセスできる）
  ため（`UIModalElement`）、ルートが先に `ready` を送り、ページがコンテンツを返します。
- Shopify の例は、送信先オリジンに `location.origin` を指定しています。`event.origin` と `event.source` の
  チェックはここで追加したもので、それぞれの側が相手からのメッセージだけを受け入れるようにします。
- Save ボタンはページのタイトルバーにあります。ルートにコンテンツを要求し、ページがそれを保存して
  トーストを表示します。"You're not able to access App Bridge features
  such as toast directly in your modal"（モーダル内では、トーストなどの App Bridge の機能に直接アクセスできません）
  （[Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)）。
- ルートには `app-bridge.js` のスクリプトタグと、独自の CSS と JS が必要です。Vite アプリでは、
  すべてのルートが `index.html` から配信され、そこにすでにスクリプトがあります。
- `variant="max"` は、モーダルを表示する前に設定する必要があります。表示後に設定できるのは `small`、`base`、
  `large` だけです（`UIModalElement`）。

### 別のコンポーネントからモーダルを開く {#example-modal-by-id}

モーダルを開くボタンがモーダルとは別のコンポーネントにある場合に使います。たとえば、複数のテーブル行から
開くヘルプモーダルです。

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

- `ShippingHelpModal` を、たとえばレイアウトなどで 1 回だけマウントし、任意のコンポーネントから `show()` を
  呼び出します。`show()` と `hide()` は `UIModalElement` のメソッドです。Shopify の
  [src モーダルの例](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)でも、
  `document.getElementById` を通じて呼び出しています。
- このモーダルには `v-model:open` がないので、他の場所が開いているかどうかを知る必要はありません。
- Shopify の [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  ページでは、Polaris の `s-modal` 要素で `shopify.modal.show(id)` を使う例が示されています。

### モーダルが閉じたらページを更新する {#example-show-hide-events}

商品を追加するインポートなど、モーダルがページに表示されるデータを変更する場合に使います。

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

- `hide` は、管理画面の閉じるボタンからを含め、モーダルがどのように閉じても発火するので、ページはデータの
  再読み込みを 1 か所で 1 回だけ行います。`show` と `hide` は `UIModalElement` が挙げているイベントです。
- `v-model:open` はすでにモーダルに追従します。副作用には `@show` と `@hide` を使います。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `open` | `boolean` | モーダルが表示されているかどうか。App Bridge がモーダルを閉じたときに同期を保つには `v-model:open` を使います。デフォルト：`false`。 |
| `id` | `string` | モーダルの一意の識別子。 |
| `variant` | `"small" \| "base" \| "large" \| "max"` | モーダルのサイズ。デフォルト：`"base"`。モーダルが表示される前はこれらのどの値にも設定でき、表示後は `small`、`base`、`large` の間でのみ変更できます。 |
| `src` | `string` | モーダルに表示するコンテンツの URL。`src` がある場合、`ui-title-bar` と `ui-save-bar` 以外の子は無視されます。 |

`open` はコンポーネントの prop で、`id`、`variant`、`src` は要素に渡される `ui-modal` の属性です。

### Events {#events}

| Event | 型 | 説明 |
| --- | --- | --- |
| `show` | `Event` | モーダルが表示されました。 |
| `hide` | `Event` | モーダルが非表示になりました。 |
| `update:open` | `boolean` | 新しい状態が `open` と異なるとき、`show` または `hide` の後に emit されます。`v-model:open` 用です。 |

### Slots {#slots}

| Slot | 説明 |
| --- | --- |
| `default` | モーダルのコンテンツ。`TitleBar`（または `<ui-title-bar>`）はモーダルのタイトルバーを構成します。これと `SaveBar`（または `<ui-save-bar>`）は `ui-modal` の直接の子のままになり、それ以外はすべてモーダルの `content` にレンダリングされます。 |
