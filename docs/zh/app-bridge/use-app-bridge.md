---
title: "useAppBridge() – 适用于 Vue 3 的 Shopify App Bridge"
description: "Vue 3 中的 useAppBridge() 返回 Shopify App Bridge 的全局 shopify，类型为 ShopifyGlobal，与 @shopify/app-bridge-react 一致。适用于 Shopify 嵌入式应用。"
---

# useAppBridge() {#use-app-bridge}

`shopify` 全局对象由 App Bridge 脚本定义。Shopify 的 [useAppBridge 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)将它描述为使用 `toast`、`resourcePicker` 等 App Bridge API 的途径。

`useAppBridge()` 返回全局 `shopify`，类型为 `ShopifyGlobal`：

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

与 `@shopify/app-bridge-react` 一样：

- 在服务器端，它返回一个对象，读取其任何属性都会抛出错误。请在 `onMounted()` 或事件处理函数中
  调用这些 API。
- 在浏览器中，如果 `shopify` 未定义，它会抛出错误，这"likely means the App
  Bridge script tag was not added correctly to this page"。

像嵌入式应用指南那样直接使用全局 `shopify` 也可以。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。
每个示例都在 `onMounted()` 或事件处理函数中调用 `useAppBridge()`，因此也适用于
服务端渲染。

### 用 resource picker 选择产品 {#example-resource-picker}

当商家从店铺中选择产品时使用，这里是一个之后还可以再次编辑的捆绑包。

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

- 商家取消时，选择器返回 `undefined`，“而不是空数组”，因此要显式检查它
  （[Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)）。
- `selectionIds` 为编辑流程预先选中产品及其变体。`multiple: 5` 限制选择数量；
  使用 `type: 'product'` 时，商家仍可以选择同一产品的多个变体。把 `filter.draft` 和
  `filter.archived` 设为 `false` 会隐藏草稿和已归档的产品（`ResourcePickerOptions`）。
- `action: 'select'` 设置标题中的动词：向列表追加内容时用 “add”，为某个目的而选择
  或替换所选内容时用 “select”。

### 选择你应用自己的记录 {#example-picker}

当商家选择存放在你应用中的记录（例如邮件模板）时使用。
对于产品、变体和产品系列，Shopify 指向的是 resource picker。

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

- `shopify.picker()` 会 resolve 为一个选择器，其 `selected` promise 会 resolve 为
  所选的 `id`，商家取消时则为 `undefined`。`data` 的值按 `headers` 的顺序排列，
  `type: 'number'` 会使一列右对齐
  （[Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)）。
- `selected: true` 预先选中当前的选择，商家仍可以更改。

### 成功、错误和撤销的 toast {#example-toast}

用于在不打断商家的情况下确认某个操作，并提供撤销。

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

- `ToastOptions` 包含 `duration`（毫秒，默认 5000）、`isError`、`action`、
  `onAction` 和 `onDismiss`。`show()` 返回 toast 的 ID，供 `hide(id)` 使用
  （[Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)）。
- Shopify 的用例包括“toast 中用于快速后续操作的操作按钮，例如撤销更改”，
  以及不阻塞的错误消息（同一页面）。
- 较长的 `duration` 给商家留出撤销的时间。其他情况下不必调用 `hide()`：
  toast 会在 `duration` 之后自行隐藏。

### 请求期间的加载指示器 {#example-loading}

在你的应用等待数据时使用，让后台显示正在处理。

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

- `shopify.loading(true)` 在后台页眉中显示加载指示器，`shopify.loading(false)` 将其隐藏
  （[Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)）。
  `finally` 确保它一定会被关闭。

### 路由切换时的加载指示器 {#example-loading-route-change}

与 Vue Router 一起使用，使懒加载的页面显示后台的加载指示器。

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

- 在创建路由器的地方调用一次 `showLoadingDuringNavigation(router)`。Shopify 把
  “页面过渡或路由更改”列为 Loading API 的用途之一
  （[Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)）。
- `afterEach` 在被取消的导航时也会运行，`onError` 则覆盖加载失败的页面。

### 向你的后端发送请求 {#example-authenticated-fetch}

用于带着商家的会话，从你自己的服务器加载数据。

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

- App Bridge 的 fetch 拦截器“会自动在发往你应用域名的请求的 `Authorization` 请求头中
  包含 ID 令牌”。只有在拦截器不适用的地方才需要自己调用 `shopify.idToken()`，
  例如 WebSocket，这也是 Shopify 自己的示例
  （[ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)）。
- 只把 ID 令牌发送给你自己的后端，并在那里验证它们（同一页面）。另请参阅
  [与后端通信](/zh/guide/shopify-embedded-app#_4-talk-to-your-backend)。

### 来自 config 的店铺和语言区域 {#example-config}

用于按商家的后台语言格式化数字，或显示应用所在的店铺。

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

- `config` 是同步的：“所有属性都是同步的，可以立即使用，无需等待 Promise”
  （[Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)）。
- `locale` 是商家为后台选择的语言，“不是店铺面向顾客的语言区域”。`shop` 是永久的
  `.myshopify.com` 域名，“不是自定义域名”（`AppBridgeConfig`）。

### 应用级的 composable {#example-admin-action}

用于让每个按钮使用相同的加载指示器和 toast，而不必重复编写。

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

- 该 composable 结合了 [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  和 [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)，
  与上面的示例相同。`pending` 驱动按钮自己的 `loading` prop。

### 请求可选的访问权限范围 {#example-optional-scopes}

当某个功能需要应用在安装时没有请求的权限（例如创建折扣）时使用。

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

- `query()` 返回 `granted`、`required` 和 `optional` 范围。`request()` 会打开权限授予
  modal，并 resolve 为 `result`（`'granted-all'` 或 `'declined-all'`）以及更新后的
  `detail`
  （[Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)）。
- 你请求的范围必须在应用配置中声明为可选。必需的范围无法撤销（`Scopes`）。

### 在后台中创建或编辑资源 {#example-intents}

用于让商家在后台自己的界面中创建或编辑 Shopify 资源，而无需在你的应用中构建该表单。

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

- `invoke()` 接受 `action:type` 以及 `value`（要编辑的 GID）和 `data` 等选项。
  折扣需要 `data.type`。它会 resolve 为一个 activity，其 `complete` promise 给出响应：
  商家完成时 `code` 为 `'ok'`，商家关闭工作流时为 `'closed'`，失败时为 `'error'`
  并带有 `message`
  （[Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)）。
- 编辑产品时，Shopify 建议先检查 `hasOnlyDefaultVariant`，当产品有多个变体时使用
  `shopify/ProductVariant`（同一页面）。

### 成功之后请求评价 {#example-review-request}

在顺利完成的工作流结束时使用，例如发送了第一次营销活动之后。

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

- Shopify：“在成功的工作流结束时请求评价，比在商家刚打开你的应用时更好”。
  不要从 “Review us” 按钮调用它：速率限制可能会阻止 modal，按钮看起来就像坏了
  （[Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)）。
- 该 modal 在 60 天内最多显示一次，365 天内最多显示三次，并且在移动端、安装后 24 小时内
  或商家已评价该应用之后都不会显示。`code` 给出原因，例如 `'cooldown-period'`（同一页面）。

### 处理支持按钮 {#example-support-handler}

当商家点击应用顶部的支持按钮时，用于打开你自己的帮助页面。

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

- 只注册一次处理函数，例如在 `App.vue` 中。`null` 会取消注册
  （[Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)）。
- 应用需要一个 Support link 扩展，指向你应用中的某个页面。“没有这个扩展，支持回调会被忽略”
  （同一页面）。

### 适配 Shopify Mobile {#example-environment}

用于在应用于 Shopify Mobile 应用中运行时更改布局，并让悬浮按钮保持在宿主底部界面之上。

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

- `shopify.environment` 包含 `mobile`、`embedded`、`pos` 和 `intent`，都是同步的布尔值
  （[Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)）。
- App Bridge 会把 `--shopify-safe-area-inset-bottom` 设为覆盖在你应用底部的宿主界面的高度。
  固定定位的元素不会被自动移动，因此要像 Shopify 的示例那样，把该变量加到它们的 `bottom` 偏移中
  （同一页面）。

### 扫描条形码 {#example-scanner}

在手机或 Shopify POS 上的库存或收货工作流中使用：扫描条形码并查找对应的变体。

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

- `scanner.capture()` 会打开设备相机，并 resolve 为一个 `ScannerPayload`，条形码在
  `data` 中。Shopify 的示例以同样的方式用 GraphQL Admin API 查找条形码，并在 `catch`
  中处理被取消的扫描
  （[Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)）。
- `shopify:admin/api/graphql.json` 需要 Direct API 访问；参见
  [与后端通信](/zh/guide/shopify-embedded-app#_4-talk-to-your-backend)。
- 只在移动端和 POS 上显示按钮是这个示例的选择：Scanner API 使用设备相机，
  而 Shopify 是针对 POS 来描述它的。

### 向 Sidekick 询问你的数据 {#example-sidekick}

用于让商家请 Sidekick 解释你的应用所显示的内容，例如一份报告。

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

- 在显示入口之前先检查 `isEnabled()`，并从商家的操作中调用 `launch`，而不是在加载时或定时器中调用
  （[Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)）。
- 其他错误可能在 Shopify 已收到提示词之后出现，因此“不要自动重试这些错误”（同一页面）。
- 面板打开或关闭时，App Bridge 会在 `window` 上派发 `shopify:sidekick:visibilitychange`，
  但在 Shopify 移动应用中不会（同一页面）。

### 检查主题应用嵌入是否已开启 {#example-app-extensions}

用于设置页面，在你的主题应用嵌入尚未启用时告知商家。

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

- `app.extensions()` 列出应用的扩展。对于主题应用扩展，每个激活项是一个 block 或嵌入，
  带有 `handle` 和 `status`，其值为 `'active'`、`'available'` 或 `'unavailable'`
  （[App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)）。
- 激活数据只来自店铺已发布的主题（同一页面）。

### 把 Web Vitals 发送到你的监控服务 {#example-web-vitals}

用于在你自己的监控服务中跟踪应用的真实性能。

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

- `onReport` 注册一个回调，接收 `metrics`，例如 LCP、CLS 和 INP，每项都有
  `name`、`value` 和 `id`；`null` 会取消注册。Shopify 的示例还会用
  `navigator.sendBeacon` 发送它们
  （[Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)）。

## API {#reference}

`@shopify/app-bridge-types` 中 `ShopifyGlobal` 的顶层成员。说明取自类型中的 JSDoc；没有 JSDoc 的成员，取自所链接的 shopify.dev 页面上的摘要。

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | 应用的配置：`apiKey`（应用的 client ID，通过 `<meta name="shopify-api-key">` 标签提供）、`appOrigins`、`debug`、`disabledFeatures`、`host`、`locale` 和 `shop`。 |
| `origin` | `string` | 类型中没有说明。 |
| `ready` | `Promise<void>` | 类型中没有说明。 |
| `setSignals` | `(RealSignal: any) => void` | 注册一个 signals 实现（例如来自 `@preact/signals`），使 App Bridge 返回的响应式值使用应用自己的 Signal 类，而不是内置的 shim。 |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`、`embedded`、`pos` 和 `intent`：应用是否运行在 Shopify Mobile 应用中、是否嵌入在 Shopify 后台中、是否运行在 Shopify POS 中，或是否作为 intent 运行。 |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 在耗时较长的操作期间显示加载指示器。 |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | 生成用于服务器到服务器身份验证和 API 请求的 ID 令牌。 |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | 当前登录商家的信息，包括姓名、邮箱和语言区域。 |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` 在 Shopify 后台中显示一条 toast 通知并返回其 ID；`hide(id)` 将其隐藏。 |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | 让商家搜索并选择产品、产品系列或变体等 Shopify 资源。 |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` 打开设备摄像头扫描条形码，并 resolve 为一个 `ScannerPayload`。 |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`、`hide(id)` 和 `toggle(id)` 按 ID 显示、隐藏或切换 modal。 |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`、`hide(id)` 和 `toggle(id)` 按 ID 显示、隐藏或切换保存栏；`leaveConfirmation()` 在有未保存的更改时，要求商家在离开页面前确认。 |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`、`close`、`device` 和 `location`：读取和修改当前 POS 购物车，关闭应用并返回 POS 界面，以及获取 POS 设备和地点的信息。 |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`（当前的 intent 请求，不在 intent 工作流程中时为 `null`）、用于调用 intent 的 `invoke()`、用于完成 intent 的 `response`，以及 `register()`。 |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` 注册一个接收 Web Vitals 性能数据的回调；传入 `null` 则取消注册。 |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` 注册一个在商家点击支持按钮时运行的函数；传入 `null` 则取消注册。 |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` 请求显示应用评价 modal，只有满足频率限制和资格条件时才会显示。结果包含 `success`、`code` 和 `message`。 |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` 返回应用在该店铺上已授予、必需和可选的访问权限范围；`request(scopes)` 请求商家授予可选范围；`revoke(scopes)` 撤销已授予的可选范围。 |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | 显示用于选择文件、日期和其他常见数据类型的界面。 |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolve 为应用的扩展列表及其状态信息。 |
| `shopifyQL` | `ShopifyQLApi` | `available()` 和 `ready()`。类型中没有其他说明。 |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | 从应用中为商家发起 Sidekick 对话。它始终有定义，但当应用无法使用 Sidekick 时，其方法会 reject；用 `isEnabled()` 检查这一点。 |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`、`unregister` 和 `clear` 为已在应用扩展配置中声明的工具绑定处理函数，平台可以代表应用调用这些函数。 |
