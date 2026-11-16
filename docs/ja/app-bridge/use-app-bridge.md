---
title: "useAppBridge() – Vue 3 向け Shopify App Bridge"
description: "Vue 3 の useAppBridge() は、@shopify/app-bridge-react と同様に Shopify App Bridge の shopify グローバルを ShopifyGlobal 型で返します。Shopify 埋め込みアプリ向けです。"
---

# useAppBridge() {#use-app-bridge}

`shopify` グローバルは App Bridge スクリプトが定義します。Shopify の [useAppBridge リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)では、`toast` や `resourcePicker` などの App Bridge API を使うための手段として説明されています。

`useAppBridge()` は `shopify` グローバルを返します。型は `ShopifyGlobal` です。

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

`@shopify/app-bridge-react` と同様です。

- サーバー上では、いずれかのプロパティを読み取ると例外を投げるオブジェクトを返します。API は
  `onMounted()` またはイベントハンドラーから呼び出してください。
- ブラウザーでは、`shopify` が定義されていない場合に例外を投げます。これは "likely means the App
  Bridge script tag was not added correctly to this page" ということです。

埋め込みアプリガイドのように `shopify` グローバルを直接使うこともできます。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。
どの例も `useAppBridge()` を `onMounted()` またはイベントハンドラーの中で呼び出すので、
サーバーサイドレンダリングでも動作します。

### リソースピッカーで商品を選ぶ {#example-resource-picker}

マーチャントがストアから商品を選ぶ場合に使います。ここでは、後から再び編集できるバンドルの例です。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { useAppBridge, type Product } from 'polaris-vue-elements/app-bridge'

interface BundleItem {
  productId: string
  title: string
  variantIds: string[]
}

const items = ref<BundleItem[]>([])

async function chooseProducts(): Promise<void> {
  const selection = await useAppBridge().resourcePicker({
    type: 'product',
    action: 'select',
    multiple: 5,
    filter: { draft: false, archived: false },
    // Opens with the current bundle selected, variants included.
    selectionIds: items.value.map((item) => ({
      id: item.productId,
      variants: item.variantIds.map((id) => ({ id })),
    })),
  })
  // undefined means the merchant cancelled: keep the current bundle.
  if (!selection) return
  items.value = selection.map((product: Product) => ({
    productId: product.id,
    title: product.title,
    variantIds: product.variants.flatMap((variant) => (variant.id ? [variant.id] : [])),
  }))
}
</script>

<template>
  <SSection heading="Bundle products">
    <SStack gap="base">
      <SText v-if="items.length === 0">No products yet.</SText>
      <SText v-for="item in items" :key="item.productId">
        {{ item.title }} ({{ item.variantIds.length }} variants)
      </SText>
      <SButton @click="chooseProducts">
        {{ items.length ? 'Change products' : 'Select products' }}
      </SButton>
    </SStack>
  </SSection>
</template>
```

- ピッカーは、マーチャントがキャンセルすると "rather than an empty array"（空配列ではなく）`undefined` を返すので、
  明示的に確認してください
  （[Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)）。
- `selectionIds` は、編集のワークフロー向けに、商品とそれぞれのバリエーションを事前に選択します。
  `multiple: 5` は選択数の上限です。`type: 'product'` の場合も、マーチャントは 1 つの商品の複数のバリエーションを
  選択できます。`filter.draft` と `filter.archived` を `false` にすると、下書きとアーカイブ済みの商品が
  非表示になります（`ResourcePickerOptions`）。
- `action: 'select'` はタイトルの動詞を決めます。"add" はリストへの追加、"select" は目的のための選択や
  選択内容の置き換えに使います。

### アプリ独自のレコードを選ぶ {#example-picker}

メールテンプレートのように、アプリ内にあるレコードをマーチャントが選ぶ場合に使います。
商品、バリエーション、コレクションについては、Shopify はリソースピッカーを案内しています。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface EmailTemplate {
  id: string
  name: string
  author: string
  timesUsed: number
  draft: boolean
}

const props = defineProps<{ templates: EmailTemplate[] }>()
const chosenIds = ref<string[]>([])

async function chooseTemplates(): Promise<void> {
  const picker = await useAppBridge().picker({
    heading: 'Select templates',
    multiple: 3,
    headers: [{ content: 'Template' }, { content: 'Created by' }, { content: 'Times used', type: 'number' }],
    items: props.templates.map((template) => ({
      id: template.id,
      heading: template.name,
      data: [template.author, template.timesUsed],
      badges: template.draft ? [{ content: 'Draft', tone: 'info' as const }] : [],
      selected: chosenIds.value.includes(template.id),
    })),
  })
  const ids = await picker.selected
  // undefined means the merchant cancelled.
  if (ids !== undefined) chosenIds.value = ids
}
</script>

<template>
  <SButton @click="chooseTemplates">Choose templates ({{ chosenIds.length }})</SButton>
</template>
```

- `shopify.picker()` はピッカーで resolve され、その `selected` の Promise は、選択された `id` で resolve されます。
  マーチャントがキャンセルした場合は `undefined` です。`data` の値は `headers` の順序に対応し、`type: 'number'` は
  列を右揃えにします
  （[Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)）。
- `selected: true` は現在の選択を事前に選択します。マーチャントはそれを変更することもできます。

### 成功、エラー、元に戻すためのトースト {#example-toast}

マーチャントの作業を中断せずに操作を確認し、元に戻す手段を提示するために使います。

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ orderId: string }>()

async function post(action: 'archive' | 'unarchive'): Promise<boolean> {
  const res = await fetch(`/api/orders/${encodeURIComponent(props.orderId)}/${action}`, {
    method: 'POST',
  })
  return res.ok
}

async function undo(): Promise<void> {
  const shopify = useAppBridge()
  if (await post('unarchive')) shopify.toast.show('Order restored')
  else shopify.toast.show('Could not restore the order', { isError: true })
}

async function archive(): Promise<void> {
  const shopify = useAppBridge()
  if (!(await post('archive'))) {
    shopify.toast.show('Could not archive the order', { isError: true })
    return
  }
  const toastId = shopify.toast.show('Order archived', {
    duration: 10000,
    action: 'Undo',
    onAction: () => {
      shopify.toast.hide(toastId)
      void undo()
    },
  })
}
</script>

<template>
  <SButton @click="archive">Archive order</SButton>
</template>
```

- `ToastOptions` には `duration`（ミリ秒、デフォルトは 5000）、`isError`、`action`、`onAction`、`onDismiss` が
  あります。`show()` は、`hide(id)` 用にトーストの ID を返します
  （[Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)）。
- Shopify の用途には、"action buttons in toasts for quick follow-up actions like
  undoing changes"（変更の取り消しのような素早いフォローアップ操作のためのトースト内のアクションボタン）と、
  操作を妨げないエラーメッセージが含まれています（同じページ）。
- 長めの `duration` は、マーチャントが元に戻す時間を確保します。それ以外では `hide()` を呼ぶ必要はありません。
  トーストは `duration` の経過後に非表示になります。

### リクエストの前後の読み込みインジケーター {#example-loading}

アプリがデータを待っている間に使い、管理画面に処理中であることを表示します。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton, SSection, SText } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const report = ref<{ orders: number; revenue: string } | null>(null)

async function refresh(): Promise<void> {
  const shopify = useAppBridge()
  shopify.loading(true)
  try {
    const res = await fetch('/api/reports/today')
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    report.value = (await res.json()) as { orders: number; revenue: string }
  } catch {
    shopify.toast.show('Could not load the report', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

onMounted(refresh)
</script>

<template>
  <SSection heading="Today">
    <SText v-if="report">{{ report.orders }} orders, {{ report.revenue }}</SText>
    <SButton @click="refresh">Refresh</SButton>
  </SSection>
</template>
```

- `shopify.loading(true)` は管理画面のヘッダーに読み込みインジケーターを表示し、`shopify.loading(false)` は
  非表示にします
  （[Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)）。
  `finally` により、必ず解除されます。

### ルート変更中の読み込みインジケーター {#example-loading-route-change}

Vue Router と組み合わせて、遅延読み込みされるページで管理画面の読み込みインジケーターを表示するために使います。

```ts
import type { Router } from 'vue-router'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

function setLoading(on: boolean): void {
  // Router guards also run during server-side rendering, where there is no shopify global.
  if (typeof window !== 'undefined') useAppBridge().loading(on)
}

export function showLoadingDuringNavigation(router: Router): void {
  router.beforeEach(() => setLoading(true))
  router.afterEach(() => setLoading(false))
  router.onError(() => setLoading(false))
}
```

- `showLoadingDuringNavigation(router)` は、ルーターを作成する場所で 1 回だけ呼び出します。Shopify は
  "page transitions or route changes"（ページ遷移やルートの変更）を Loading API の用途として挙げています
  （[Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)）。
- `afterEach` はキャンセルされたナビゲーションでも実行され、`onError` はページの読み込みに失敗した場合を
  カバーします。

### バックエンドへのリクエスト {#example-authenticated-fetch}

マーチャントのセッションを使って、自分のサーバーからデータを読み込むために使います。

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SSection, SText } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Order {
  id: string
  name: string
}

const orders = ref<Order[]>([])
let socket: WebSocket | null = null
let active = true

onMounted(async () => {
  // App Bridge adds the ID token to requests to your app's domain.
  const res = await fetch('/api/orders')
  if (res.ok) orders.value = (await res.json()) as Order[]

  // A WebSocket is not covered by that, so get a token yourself.
  const token = await useAppBridge().idToken()
  if (!active) return
  socket = new WebSocket(`wss://your-app.example.com/orders?token=${encodeURIComponent(token)}`)
  socket.addEventListener('message', (event: MessageEvent<string>) => {
    orders.value = [JSON.parse(event.data) as Order, ...orders.value]
  })
})

onBeforeUnmount(() => {
  active = false
  socket?.close()
})
</script>

<template>
  <SSection heading="Live orders">
    <SText v-for="order in orders" :key="order.id">{{ order.name }}</SText>
  </SSection>
</template>
```

- App Bridge の fetch インターセプターは "automatically includes the ID token in the
  `Authorization` header for requests to your app's domain"（アプリのドメインへのリクエストの `Authorization`
  ヘッダーに ID トークンを自動的に含めます）。インターセプターが適用されない場所、たとえば WebSocket
  でのみ、自分で `shopify.idToken()` を呼び出してください。これは Shopify 自身の例でもあります
  （[ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)）。
- ID トークンは自分のバックエンドにだけ送り、そこで検証してください（同じページ）。
  [バックエンドと通信する](/ja/guide/shopify-embedded-app#_4-talk-to-your-backend)も参照してください。

### config からショップとロケールを取得する {#example-config}

マーチャントの管理画面の言語で数値をフォーマットする場合や、アプリがどのショップにあるかを表示する場合に使います。

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SText } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ amount: number; currency: string }>()

const locale = ref('en-US')
const shop = ref('')

onMounted(() => {
  const { config } = useAppBridge()
  locale.value = config.locale ?? 'en-US'
  shop.value = config.shop ?? ''
})

const price = computed(() =>
  new Intl.NumberFormat(locale.value, { style: 'currency', currency: props.currency }).format(
    props.amount,
  ),
)
</script>

<template>
  <SText>{{ price }} on {{ shop }}</SText>
</template>
```

- `config` は同期的です。"All properties are synchronous and available immediately
  without awaiting a Promise"（すべてのプロパティは同期的で、Promise を待たずにすぐに使えます）
  （[Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)）。
- `locale` は、マーチャントが管理画面に選んだ言語で、"not the shop's
  customer-facing locale"（ショップの顧客向けロケールではありません）。`shop` は恒久的な `.myshopify.com`
  ドメインで、"not a custom domain"（カスタムドメインではありません）（`AppBridgeConfig`）。

### アプリレベルの composable {#example-admin-action}

すべてのボタンで、同じ読み込みインジケーターとトーストを繰り返し書かずに使うために使います。

::: code-group

```ts [useAdminAction.ts]
import { ref, type Ref } from 'vue'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

export interface AdminActionMessages {
  success: string
  error: string
}

export interface AdminAction {
  pending: Ref<boolean>
  run: <T>(action: () => Promise<T>, messages: AdminActionMessages) => Promise<T | undefined>
}

export function useAdminAction(): AdminAction {
  const pending = ref(false)

  async function run<T>(
    action: () => Promise<T>,
    messages: AdminActionMessages,
  ): Promise<T | undefined> {
    // Read the global when the action runs, not during setup, so this is SSR-safe.
    const shopify = useAppBridge()
    pending.value = true
    shopify.loading(true)
    try {
      const result = await action()
      shopify.toast.show(messages.success)
      return result
    } catch {
      shopify.toast.show(messages.error, { isError: true })
      return undefined
    } finally {
      pending.value = false
      shopify.loading(false)
    }
  }

  return { pending, run }
}
```

```vue [DuplicateProduct.vue]
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useAdminAction } from './useAdminAction'

const props = defineProps<{ productId: string }>()
const { pending, run } = useAdminAction()

function duplicate(): void {
  void run(
    async () => {
      const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}/duplicate`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    },
    { success: 'Product duplicated', error: 'Could not duplicate the product' },
  )
}
</script>

<template>
  <SButton :loading="pending" @click="duplicate">Duplicate</SButton>
</template>
```

:::

- この composable は、前の例と同様に、[Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  と [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)
  を組み合わせています。`pending` はボタン自身の `loading` prop を制御します。

### オプションのアクセススコープを要求する {#example-optional-scopes}

割引の作成など、インストール時にアプリが要求しない権限が機能に必要な場合に使います。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBanner, SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const SCOPE = 'write_discounts'
const granted = ref<boolean | null>(null)

onMounted(async () => {
  const detail = await useAppBridge().scopes.query()
  granted.value = detail.granted.includes(SCOPE)
})

async function requestScope(): Promise<void> {
  const shopify = useAppBridge()
  const response = await shopify.scopes.request([SCOPE])
  granted.value = response.detail.granted.includes(SCOPE)
  if (response.result === 'declined-all') {
    shopify.toast.show('Automatic discounts stay off')
  }
}
</script>

<template>
  <SBanner v-if="granted === false" heading="Automatic discounts need permission">
    Allow the app to create discounts to turn this feature on.
    <template #secondary-actions>
      <SButton @click="requestScope">Allow</SButton>
    </template>
  </SBanner>
</template>
```

- `query()` は `granted`、`required`、`optional` のスコープを返します。`request()` は権限付与のモーダルを開き、
  `result`（`'granted-all'` または `'declined-all'`）と更新された `detail` で resolve されます
  （[Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)）。
- 要求するスコープは、アプリの設定でオプションとして宣言されている必要があります。必須スコープは
  取り消せません（`Scopes`）。

### 管理画面でリソースを作成または編集する {#example-intents}

アプリ内にフォームを作らずに、管理画面自身の画面で Shopify のリソースをマーチャントが作成または編集できるように
するために使います。

```vue
<script setup lang="ts">
import { SButton, SStack } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ productGid: string }>()

async function createDiscount(): Promise<void> {
  const shopify = useAppBridge()
  // invoke is optional in the types.
  const activity = await shopify.intents.invoke?.('create:shopify/Discount', {
    data: { type: 'amount-off-product' },
  })
  const response = await activity?.complete
  if (response?.code === 'ok') shopify.toast.show('Discount created')
  else if (response?.code === 'error') {
    shopify.toast.show(response.message ?? 'Could not create the discount', { isError: true })
  }
}

async function editProduct(): Promise<void> {
  const shopify = useAppBridge()
  const activity = await shopify.intents.invoke?.('edit:shopify/Product', {
    value: props.productGid,
  })
  const response = await activity?.complete
  if (response?.code === 'ok') shopify.toast.show('Product updated')
}
</script>

<template>
  <SStack direction="inline" gap="base">
    <SButton @click="createDiscount">Create discount</SButton>
    <SButton @click="editProduct">Edit product</SButton>
  </SStack>
</template>
```

- `invoke()` は `action:type` と、`value`（編集する GID）や `data` などのオプションを受け取ります。
  割引には `data.type` が必要です。`complete` の Promise がレスポンスを返すアクティビティで resolve されます。
  `code` は、マーチャントが完了したときは `'ok'`、ワークフローを閉じたときは `'closed'`、失敗したときは
  `message` 付きの `'error'` です
  （[Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)）。
- 商品を編集する場合、Shopify は最初に `hasOnlyDefaultVariant` を確認し、商品にバリエーションがあるときは
  `shopify/ProductVariant` を使うよう提案しています（同じページ）。

### 成功の後にレビューを依頼する {#example-review-request}

最初のキャンペーンを送信したときなど、ワークフローがうまくいった最後に使います。

```ts
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

// Call this after the merchant's first campaign has been sent.
export async function askForReview(): Promise<void> {
  try {
    const result = await useAppBridge().reviews.request()
    if (!result.success) console.info(`Review modal not shown: ${result.code}`)
  } catch {
    // The review request is optional; ignore failures.
  }
}
```

- Shopify："It's better to request a review at the end of a successful workflow than when a
  merchant first opens your app"（マーチャントが初めてアプリを開いたときよりも、成功したワークフローの最後に
  レビューを依頼する方が適切です）。"Review us" ボタンからは呼び出さないでください。レート制限によってモーダルが
  表示されないことがあり、ボタンが壊れているように見えます
  （[Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)）。
- このモーダルは、60 日間に最大 1 回、365 日間に最大 3 回しか表示されず、モバイル、インストールから 24 時間以内、
  マーチャントがすでにアプリをレビューした後には表示されません。`code` が `'cooldown-period'` などの理由を
  示します（同じページ）。

### サポートボタンを処理する {#example-support-handler}

マーチャントがアプリ上部のサポートボタンをクリックしたときに、自分のヘルプページを開くために使います。

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const router = useRouter()

onMounted(() => {
  void useAppBridge().support.registerHandler?.(() => {
    void router.push('/app/help')
  })
})

onBeforeUnmount(() => {
  void useAppBridge().support.registerHandler?.(null)
})
</script>

<template>
  <RouterView />
</template>
```

- ハンドラーは、たとえば `App.vue` で 1 回だけ登録します。`null` で登録を解除します
  （[Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)）。
- アプリには、アプリ内のページを指す Support link extension が必要です。"Without this
  extension, the support callback is ignored"（この extension がないと、サポートのコールバックは無視されます）
  （同じページ）。

### Shopify Mobile に対応する {#example-environment}

アプリが Shopify Mobile アプリで動作しているときにレイアウトを変更したり、ホストの下部 UI の上に
フローティングボタンを保ったりするために使います。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const mobile = ref(false)

onMounted(() => {
  mobile.value = useAppBridge().environment.mobile
})
</script>

<template>
  <div v-if="mobile" class="floating-action">
    <SButton variant="primary">New order</SButton>
  </div>
  <SButton v-else variant="primary">New order</SButton>
</template>

<style scoped>
.floating-action {
  position: fixed;
  right: 16px;
  bottom: calc(16px + var(--shopify-safe-area-inset-bottom, 0px));
}
</style>
```

- `shopify.environment` には `mobile`、`embedded`、`pos`、`intent` があり、いずれも同期的な真偽値です
  （[Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)）。
- App Bridge は `--shopify-safe-area-inset-bottom` を、アプリの下部にかぶさるホスト UI の高さに設定します。
  固定配置の要素は自動では移動されないので、Shopify の例のように、この変数を `bottom` のオフセットに
  加えてください（同じページ）。

### バーコードをスキャンする {#example-scanner}

スマートフォンや Shopify POS での在庫管理や入荷のワークフローで、バーコードをスキャンしてバリエーションを
見つけるために使います。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface VariantLookup {
  data?: { productVariants: { nodes: { title: string; product: { title: string } }[] } }
}

const canScan = ref(false)

onMounted(() => {
  const { environment } = useAppBridge()
  canScan.value = environment.mobile || environment.pos
})

async function scan(): Promise<void> {
  const shopify = useAppBridge()
  try {
    const { data: barcode } = await shopify.scanner.capture()
    const res = await fetch('shopify:admin/api/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query ($q: String!) {
          productVariants(first: 1, query: $q) { nodes { title product { title } } }
        }`,
        variables: { q: `barcode:${barcode}` },
      }),
    })
    const json = (await res.json()) as VariantLookup
    const variant = json.data?.productVariants.nodes[0]
    if (variant) shopify.toast.show(`${variant.product.title}: ${variant.title}`)
    else shopify.toast.show('Product not found', { isError: true })
  } catch {
    shopify.toast.show('Scan cancelled or failed', { isError: true })
  }
}
</script>

<template>
  <SButton v-if="canScan" @click="scan">Scan barcode</SButton>
</template>
```

- `scanner.capture()` はデバイスのカメラを開き、`data` にバーコードを持つ `ScannerPayload` で resolve されます。
  Shopify の例も、同様に GraphQL Admin API でバーコードを検索し、キャンセルされたスキャンを `catch` で処理して
  います
  （[Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)）。
- `shopify:admin/api/graphql.json` には Direct API access が必要です。
  [バックエンドと通信する](/ja/guide/shopify-embedded-app#_4-talk-to-your-backend)を参照してください。
- ボタンをモバイルと POS でのみ表示するのは、この例の判断です。Scanner API はデバイスのカメラを使い、
  Shopify は POS 向けとして説明しています。

### データについて Sidekick に尋ねる {#example-sidekick}

レポートなど、アプリが表示している内容を Sidekick に説明してもらえるようにするために使います。

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge, type SidekickVisibilityChangeDetail } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ reportSummary: string }>()

const available = ref(false)
const panelOpen = ref(false)

function onVisibilityChange(event: CustomEvent<SidekickVisibilityChangeDetail>): void {
  panelOpen.value = event.detail.visibilityState === 'visible'
}

onMounted(async () => {
  available.value = await useAppBridge()
    .sidekick.isEnabled()
    .catch(() => false)
  window.addEventListener('shopify:sidekick:visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('shopify:sidekick:visibilitychange', onVisibilityChange)
})

async function ask(): Promise<void> {
  const shopify = useAppBridge()
  try {
    await shopify.sidekick.launch({
      message: `Explain the main changes in this sales report: ${props.reportSummary}`,
    })
  } catch (error) {
    // Errors that start with "sidekick.launch:" happen before anything is sent.
    if (error instanceof Error && error.message.startsWith('sidekick.launch:')) {
      shopify.toast.show('Sidekick could not send this question', { isError: true })
    }
  }
}
</script>

<template>
  <SButton v-if="available" :disabled="panelOpen" @click="ask">Ask Sidekick</SButton>
</template>
```

- エントリーポイントを表示する前に `isEnabled()` を確認し、`launch` は読み込み時やタイマーではなく、
  マーチャントの操作から呼び出してください
  （[Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)）。
- その他のエラーは、Shopify がプロンプトを送信した後に発生することがあるため、"don't retry those errors
  automatically"（それらのエラーを自動的に再試行しないでください）（同じページ）。
- App Bridge は、パネルが開閉したときに `window` で `shopify:sidekick:visibilitychange` を dispatch しますが、
  Shopify モバイルアプリでは dispatch されません（同じページ）。

### テーマアプリ埋め込みが有効か確認する {#example-app-extensions}

設定ページで、テーマアプリ埋め込みがまだ有効でないことをマーチャントに知らせるために使います。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBanner } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

// The handle of the embed's file in your theme app extension.
const EMBED_HANDLE = 'reviews-embed'
const embedActive = ref<boolean | null>(null)

onMounted(async () => {
  try {
    const extensions = await useAppBridge().app.extensions()
    const blocks = extensions.flatMap((extension) =>
      extension.type === 'theme_app_extension' ? extension.activations : [],
    )
    const embed = blocks.find((block) => 'handle' in block && block.handle === EMBED_HANDLE)
    embedActive.value = embed !== undefined && 'status' in embed && embed.status === 'active'
  } catch {
    embedActive.value = null
  }
})
</script>

<template>
  <SBanner v-if="embedActive === false" tone="warning" heading="Turn on the reviews embed">
    Enable the app embed in your theme editor so reviews show on your store.
  </SBanner>
</template>
```

- `app.extensions()` はアプリの extension を一覧にします。テーマアプリ extension では、各 activation が
  `handle` と、`'active'`、`'available'`、`'unavailable'` のいずれかの `status` を持つブロックまたは埋め込みです
  （[App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)）。
- activation のデータは、ストアの公開済みテーマのものだけです（同じページ）。

### Web Vitals を監視サービスに送る {#example-web-vitals}

アプリの実環境でのパフォーマンスを、自分の監視サービスで追跡するために使います。

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

onMounted(() => {
  void useAppBridge().webVitals.onReport?.((report) => {
    navigator.sendBeacon('/api/web-vitals', JSON.stringify(report.metrics))
  })
})

onBeforeUnmount(() => {
  void useAppBridge().webVitals.onReport?.(null)
})
</script>

<template>
  <RouterView />
</template>
```

- `onReport` は、LCP、CLS、INP などの `metrics`（それぞれ `name`、`value`、`id` を持つ）を受け取るコールバックを
  登録します。`null` で登録を解除します。Shopify の例でも、`navigator.sendBeacon` で送信しています
  （[Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)）。

## API {#reference}

`@shopify/app-bridge-types` の `ShopifyGlobal` のトップレベルのメンバーです。説明は型の JSDoc から、JSDoc がないメンバーはリンク先の shopify.dev ページの概要から取っています。

| メンバー | 型 | 説明 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | アプリの設定：`apiKey`（`<meta name="shopify-api-key">` タグで指定するアプリのクライアント ID）、`appOrigins`、`debug`、`disabledFeatures`、`host`、`locale`、`shop`。 |
| `origin` | `string` | 型に説明はありません。 |
| `ready` | `Promise<void>` | 型に説明はありません。 |
| `setSignals` | `(RealSignal: any) => void` | シグナルの実装（例：`@preact/signals`）を登録し、App Bridge が返すリアクティブな値が組み込みの shim ではなくアプリ自身の Signal クラスを使うようにします。 |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`、`embedded`、`pos`、`intent`：アプリが Shopify Mobile アプリで動作しているか、Shopify 管理画面に埋め込まれているか、Shopify POS で動作しているか、インテントとして動作しているか。 |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 時間のかかる処理の間、読み込みインジケーターを表示します。 |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | サーバー間認証と API リクエスト用の ID トークンを生成します。 |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | ログイン中のマーチャントの情報（名前、メールアドレス、ロケールなど）。 |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` は Shopify 管理画面にトースト通知を表示してその ID を返し、`hide(id)` はそれを非表示にします。 |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | マーチャントが商品、コレクション、バリエーションなどの Shopify リソースを検索して選択できるようにします。 |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` はバーコードをスキャンするためにデバイスのカメラを開き、`ScannerPayload` で resolve されます。 |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`、`hide(id)`、`toggle(id)` は ID を指定してモーダルを表示、非表示、切り替えします。 |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`、`hide(id)`、`toggle(id)` は ID を指定して保存バーを表示、非表示、切り替えします。`leaveConfirmation()` は未保存の変更があるとき、ページを離れる前にマーチャントに確認を求めます。 |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`、`close`、`device`、`location`：現在の POS カートの読み取りと変更、アプリを閉じて POS 画面に戻ること、POS デバイスとロケーションの情報の取得。 |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`（現在のインテントリクエスト。インテントのワークフロー外では `null`）、インテントを呼び出す `invoke()`、インテントを完了する `response`、そして `register()`。 |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` は Web Vitals のパフォーマンスデータを受け取るコールバックを登録します。`null` で登録を解除します。 |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` はマーチャントがサポートボタンをクリックしたときに実行する関数を登録します。`null` で登録を解除します。 |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` はアプリレビューのモーダルを要求します。このモーダルは頻度の制限と資格条件を満たす場合にのみ表示されます。結果には `success`、`code`、`message` があります。 |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` はショップでアプリに付与済み、必須、任意のアクセススコープを返し、`request(scopes)` はマーチャントに任意のスコープの付与を求め、`revoke(scopes)` は付与済みの任意のスコープを取り消します。 |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | ファイル、日付、その他の一般的なデータ型の選択インターフェースを表示します。 |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` はアプリの拡張機能の一覧とそのステータス情報で resolve されます。 |
| `shopifyQL` | `ShopifyQLApi` | `available()` と `ready()`。それ以外は型に説明がありません。 |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | アプリからマーチャントのために Sidekick の会話を開始します。常に定義されていますが、アプリで Sidekick を利用できない場合はメソッドが reject されます。`isEnabled()` でこれを確認します。 |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`、`unregister`、`clear` は、アプリ拡張機能の設定で宣言済みのツールにハンドラー関数を結び付けます。プラットフォームはアプリに代わってそれらを呼び出せます。 |
