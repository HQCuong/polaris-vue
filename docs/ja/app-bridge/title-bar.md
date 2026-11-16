---
title: "TitleBar (ui-title-bar) – Vue 3 向け App Bridge"
description: "TitleBar は Vue 3 で Shopify App Bridge の ui-title-bar をレンダリングし、title は属性として設定されます。Modal 内ではヘッダーとフッターを設定します。Shopify 埋め込みアプリ向けです。"
---

# TitleBar {#title-bar}

タイトルバーは Shopify 管理画面でアプリの上部に表示されます。カスタマイズ方法は Shopify の [TitleBar リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)で説明されています。

`TitleBar` は `ui-title-bar` をレンダリングし、`title` は属性として設定されます。`Modal` 内では、
モーダルのヘッダーとフッターを設定します。子要素は `<button>` と `<a>` 要素です。
`ui-title-bar` の型では `variant="primary"` または `variant="breadcrumb"`、
`tone="critical"`、`<section label="...">` によるグループが使えます。ページのタイトルバーについては、
Shopify は現在 [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
を文書化しており、これは [`SPage`](/ja/components/s-page) です。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。

### モーダル内のタイトルとアクション {#example-title-bar-in-modal}

モーダルに見出しとフッターのボタンを付けるために使います。ここでは、タイトルに選択数を表示する一括操作の例です。

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

- モーダル内では、`TitleBar` がモーダルのヘッダーとフッターを設定します。Shopify の "Simple form" の例と同様に、
  メインのボタンには `variant="primary"` を指定し、Cancel には variant を指定しません
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)）。
- ボタンのクリックハンドラーはページ内で実行されるので、`publish` はトーストを表示できます。
- 破壊的な操作では、[削除の確認の例](/ja/app-bridge/modal#example-confirm-delete)のように、プライマリボタンに
  `tone="critical"` を追加します。
- タイトルは、モーダルを開く前に選択内容から計算されます。モーダルが開いている間に変わるタイトルを App Bridge が
  反映するかどうかは、検証されていません。

### s-page によるページのタイトルバー {#example-page-title-bar}

ページのタイトルバーに使います。Shopify は現在、`ui-title-bar` ではなく `s-page` で設定します。

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

- Shopify のタイトルバーのページでは、`s-page` の `breadcrumb-actions`、`accessory`、`primary-action`、
  `secondary-actions` の slot、`commandFor` で開くメニュー、そしてページごとに "only one primary action"
  （プライマリアクションは 1 つだけ）が説明されています
  （[Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)）。
- `heading` は読み込まれたレコードに追従するので、タイトルバーに商品名が表示されます。
- `ui-title-bar` の型では、`variant="breadcrumb"` のボタンとリンク、`<section label="...">` のグループも
  使えます。Shopify の現在のページには、それらの見た目の説明がないため、このページには例を載せていません。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `title` | `string` | タイトルバーのタイトル。`document.title` でも設定できます。`TitleBar` は常にこれを属性として設定します。 |

`TitleBar` はイベントを emit しません。

### Slots {#slots}

| Slot | 説明 |
| --- | --- |
| `default` | 下表の `<button>` と `<a>` 要素、およびそれらをまとめる `<section>` グループ。 |

`ui-title-bar` の型は次の子要素を説明しています。

| 子要素 | 属性 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 型の注記によると、Remix では anchor 要素はサポートされず、代わりに Remix の `<Link>` コンポーネントを使えます。 |
| `<section>` | `label`: `string`. 子は `<a>` と `<button>` 要素です。 |

これらの型では、`<button>` と `<a>` は `id`、`name`、`class`、`href`、`rel`、`target`、`onclick` も受け取ります。
