---
title: "AppWindow (s-app-window) – Vue 3 向け App Bridge"
description: "AppWindow は Vue 3 で、Shopify 管理画面のフルスクリーンのモーダルウィンドウである Shopify App Bridge の s-app-window をレンダリングします。src は必須で、v-model:open で開きます。"
---

# AppWindow {#app-window}

Shopify の [s-app-window リファレンス](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)では、専用の画面スペースを必要とする複雑なワークフローのための、フルスクリーンのモーダルウィンドウとして説明されています。

`AppWindow` は `s-app-window` をレンダリングします。`@shopify/app-bridge-types` のドキュメントでは、これを
"a fullscreen modal window in the Shopify admin" と説明しています。`src` は必須です。"the URL is loaded
in an iframe when the window opens".

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

`open`、`v-model:open`、`show`/`hide`、およびアンマウント時の非表示は、[`Modal`](/ja/app-bridge/modal) と同様に動作します。
slot はありません。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。

### 全画面のエディター {#example-window-editor}

レコードの一覧から開く、画面全体を使うエディターに使います。

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

- `src` は "must point to a route within your app"（アプリ内のルートを指す必要があります）、
  また "the URL is loaded in an iframe when the window opens"（ウィンドウが開くときに URL が iframe に読み込まれます）
  とされています（`SAppWindowAttributes`）。ウィンドウが開いている間に `src` を変更すると、新しい URL に移動します
  （`SAppWindowElement`）。
- ウィンドウに関する Shopify のベストプラクティス：明示的な操作からのみ開く、ウィンドウのコンテンツ内の
  `s-page` で見出しを設定する、フォームに `data-save-bar` を追加する、閉じたときにマーチャントを元の場所に戻す
  （[App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)）。
- `src` は必須なので、ウィンドウはレコードが選ばれてからレンダリングされます。
- `@hide="reload"` は、閉じるたびに一覧を更新します。Shopify は "updating UI state"（UI の状態の更新）を
  `hide` イベントの用途として挙げています（`SAppWindowElement`）。
- フォームは [data-save-bar の例](/ja/app-bridge/save-bar#example-data-save-bar)と同じです。
  未保存の変更があるとき、ウィンドウの `hide()` は閉じる前にマーチャントに確認します。
- エディターはエラーをページ内に表示します。トーストなどの App Bridge API のうちどれがウィンドウ内で動作するかは、
  Shopify に記載がありません。
- ウィンドウのルートがウィンドウを閉じる方法や、データをページに返す方法は、Shopify に記載がありません。
  ページは、要素の `contentWindow`（"use this to communicate with the iframe content via `postMessage()`"、
  `postMessage()` で iframe のコンテンツと通信するために使います）を通じてルートにアクセスできますが、
  ウィンドウが開いている間だけです。

### 選択した項目を一括編集する {#example-window-bulk-edit}

マーチャントが行を選択し、全画面のビューでまとめて編集する場合に使います。

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

- Shopify は、`src` の用途として一括編集を挙げています（`SAppWindowAttributes`）。ルートはアプリの
  通常のページなので、選択内容はそのクエリ文字列から読み取ります。
- ウィンドウが閉じた後、`onHide` が選択を解除して一覧を再読み込みします。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `open` | `boolean` | ウィンドウが表示されているかどうか。App Bridge がウィンドウを閉じたときに同期を保つには `v-model:open` を使います。デフォルト：`false`。 |
| `id` | `string` | アプリウィンドウ要素の一意の識別子。`commandFor` でボタンを結び付けたり、`document.getElementById()` で要素を取得したりするときに使います。 |
| `src` | `string` (必須) | ウィンドウに表示するコンテンツの URL。ウィンドウのコンテンツをレンダリングするアプリのルートを指す必要があり、ウィンドウが開くと iframe に読み込まれます。 |

### Events {#events}

| Event | 型 | 説明 |
| --- | --- | --- |
| `show` | `Event` | ウィンドウが開きました。 |
| `hide` | `Event` | ウィンドウが閉じました。 |
| `update:open` | `boolean` | 新しい状態が `open` と異なるとき、`show` または `hide` の後に emit されます。`v-model:open` 用です。 |

### Slots {#slots}

`AppWindow` には slot がありません。`SAppWindowAttributes` は子を定義していません。
