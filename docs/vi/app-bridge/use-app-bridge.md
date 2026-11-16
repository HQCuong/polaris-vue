---
title: "useAppBridge() – Shopify App Bridge cho Vue 3"
description: "useAppBridge() cho Vue 3 trả về đối tượng toàn cục shopify của Shopify App Bridge, có type là ShopifyGlobal, giống trong @shopify/app-bridge-react. Dành cho Shopify embedded app."
---

# useAppBridge() {#use-app-bridge}

Global `shopify` được script App Bridge định nghĩa. [Tài liệu useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) của Shopify mô tả nó là cách dùng các API của App Bridge như `toast` và `resourcePicker`.

`useAppBridge()` trả về đối tượng toàn cục `shopify`, có type là `ShopifyGlobal`:

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

Giống như trong `@shopify/app-bridge-react`:

- Trên server, nó trả về một đối tượng sẽ ném lỗi khi bạn đọc bất kỳ thuộc tính nào. Hãy gọi các
  API từ `onMounted()` hoặc một event handler.
- Trong trình duyệt, nó ném lỗi nếu `shopify` chưa được định nghĩa, điều này "likely means the App
  Bridge script tag was not added correctly to this page".

Dùng trực tiếp đối tượng toàn cục `shopify`, như hướng dẫn embedded app đã làm, cũng được.

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.
Mỗi ví dụ gọi `useAppBridge()` bên trong `onMounted()` hoặc một event handler, nên nó cũng hoạt động
với server-side rendering.

### Chọn sản phẩm bằng resource picker {#example-resource-picker}

Dùng cách này khi người bán chọn sản phẩm từ cửa hàng, ở đây cho một bundle mà họ có thể
sửa lại sau.
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
- Picker trả về `undefined` khi người bán hủy, "rather than an empty array" (thay vì một mảng rỗng),
  nên hãy kiểm tra nó một cách tường minh
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` chọn sẵn các sản phẩm, và các variant của từng sản phẩm, cho luồng chỉnh sửa.
  `multiple: 5` giới hạn vùng chọn; với `type: 'product'` người bán vẫn có thể chọn
  nhiều variant của một sản phẩm. `filter.draft` và `filter.archived` đặt thành `false` sẽ ẩn
  sản phẩm nháp và sản phẩm đã lưu trữ (`ResourcePickerOptions`).
- `action: 'select'` đặt động từ trong tiêu đề: "add" để thêm vào một danh sách, "select" để
  chọn cho một mục đích hoặc thay thế một vùng chọn.

### Chọn các bản ghi riêng của app bạn {#example-picker}

Dùng cách này khi người bán chọn các bản ghi nằm trong app của bạn, ví dụ các mẫu email.
Với sản phẩm, variant và collection, Shopify chỉ sang resource picker.
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
- `shopify.picker()` resolve thành một picker có promise `selected` resolve thành các
  `id` đã chọn, hoặc `undefined` khi người bán hủy. Các giá trị `data` theo thứ tự của
  `headers`, và `type: 'number'` căn phải một cột
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` chọn sẵn lựa chọn hiện tại, mà người bán vẫn có thể đổi.

### Toast cho thành công, lỗi và hoàn tác {#example-toast}

Dùng cách này để xác nhận một hành động mà không làm gián đoạn người bán, và để đưa ra tùy chọn hoàn tác.
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
- `ToastOptions` có `duration` (mili giây, mặc định 5000), `isError`, `action`,
  `onAction` và `onDismiss`. `show()` trả về ID của toast để dùng cho `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Các trường hợp dùng của Shopify gồm "action buttons in toasts for quick follow-up actions like
  undoing changes" (nút hành động trong toast cho các thao tác tiếp theo nhanh như hoàn tác thay đổi)
  và thông báo lỗi không chặn (cùng trang).
- `duration` dài hơn cho người bán thời gian để hoàn tác. Không bắt buộc gọi `hide()`
  ở các trường hợp khác: toast tự ẩn sau thời lượng của nó.

### Chỉ báo loading quanh một request {#example-loading}

Dùng cách này khi app của bạn đang đợi dữ liệu, để admin cho thấy có việc đang diễn ra.
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
- `shopify.loading(true)` hiển thị chỉ báo loading trong header của admin, và
  `shopify.loading(false)` ẩn nó
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` đảm bảo nó luôn được tắt.

### Chỉ báo loading khi đổi route {#example-loading-route-change}

Dùng cách này với Vue Router, để các trang được lazy-load hiển thị chỉ báo loading của admin.
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
- Gọi `showLoadingDuringNavigation(router)` một lần ở nơi bạn tạo router. Shopify liệt kê
  "page transitions or route changes" (chuyển trang hoặc đổi route) như một cách dùng Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` cũng chạy với các điều hướng bị hủy, và `onError` xử lý trang không
  tải được.

### Request đến backend của bạn {#example-authenticated-fetch}

Dùng cách này để tải dữ liệu từ server của chính bạn, kèm session của người bán.
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
- Fetch interceptor của App Bridge "automatically includes the ID token in the
  `Authorization` header for requests to your app's domain" (tự động đưa ID token vào
  header `Authorization` cho các request đến domain của app bạn). Chỉ tự gọi `shopify.idToken()`
  ở nơi interceptor không áp dụng, như WebSocket, vốn là
  ví dụ của chính Shopify
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Chỉ gửi ID token đến backend của chính bạn, và xác minh chúng ở đó (cùng trang). Xem thêm
  [Giao tiếp với backend](/vi/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Shop và locale từ config {#example-config}

Dùng cách này để định dạng số theo ngôn ngữ admin của người bán hoặc để hiện app đang ở cửa hàng nào.
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
- `config` là đồng bộ: "All properties are synchronous and available immediately
  without awaiting a Promise" (Mọi thuộc tính đều đồng bộ và có sẵn ngay
  mà không cần await một Promise)
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` là ngôn ngữ người bán chọn cho admin, "not the shop's
  customer-facing locale" (không phải locale hướng đến khách hàng của shop). `shop` là domain `.myshopify.com` vĩnh viễn, "not a custom
  domain" (không phải domain tùy chỉnh) (`AppBridgeConfig`).

### Một composable cấp app {#example-admin-action}

Dùng cách này để cho mọi nút cùng một chỉ báo loading và toast mà không phải lặp lại chúng.

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

- Composable kết hợp [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  và [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  như trong các ví dụ ở trên. `pending` điều khiển prop `loading` của chính nút.

### Xin một access scope tùy chọn {#example-optional-scopes}

Dùng cách này khi một tính năng cần một quyền mà app không xin khi cài đặt, ví dụ
tạo discount.
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
- `query()` trả về các scope `granted`, `required` và `optional`. `request()` mở một
  modal cấp quyền và resolve với `result` (`'granted-all'` hoặc `'declined-all'`)
  cùng `detail` đã cập nhật
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Các scope bạn yêu cầu phải được khai báo là optional trong cấu hình app của bạn. Các scope
  bắt buộc không thể bị thu hồi (`Scopes`).

### Tạo hoặc sửa một resource trong admin {#example-intents}

Dùng cách này để cho người bán tạo hoặc sửa một resource của Shopify trong các màn hình của chính admin,
mà không phải xây form đó trong app của bạn.
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
- `invoke()` nhận `action:type` và các tùy chọn như `value` (GID cần sửa) và `data`.
  Một discount cần `data.type`. Nó resolve thành một activity có promise `complete` trả về
  response: `code` là `'ok'` khi người bán hoàn tất, `'closed'` khi họ đóng
  workflow, và `'error'` kèm `message` khi thất bại
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Để sửa một sản phẩm, Shopify gợi ý kiểm tra `hasOnlyDefaultVariant` trước và dùng
  `shopify/ProductVariant` khi sản phẩm có các variant (cùng trang).

### Xin đánh giá sau một thành công {#example-review-request}

Dùng cách này ở cuối một workflow diễn ra tốt đẹp, ví dụ chiến dịch đầu tiên đã được gửi.
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
- Shopify: "It's better to request a review at the end of a successful workflow than when a
  merchant first opens your app" (Nên xin đánh giá ở cuối một workflow thành công hơn là khi
  người bán vừa mở app của bạn). Đừng gọi nó từ một nút "Review us": rate limit có thể
  chặn modal, và nút đó sẽ có vẻ bị hỏng
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- Modal hiện tối đa một lần trong 60 ngày và ba lần trong 365 ngày, và không bao giờ hiện trên mobile,
  trong vòng 24 giờ sau khi cài đặt, hoặc sau khi người bán đã đánh giá app. `code` cho biết
  lý do, ví dụ `'cooldown-period'` (cùng trang).

### Xử lý nút hỗ trợ {#example-support-handler}

Dùng cách này để mở trang trợ giúp của riêng bạn khi người bán bấm nút hỗ trợ ở đầu
app.
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
- Đăng ký handler một lần, ví dụ trong `App.vue`. `null` hủy đăng ký
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- App cần một Support link extension trỏ đến một trang trong app của bạn. "Without this
  extension, the support callback is ignored" (Không có extension này, callback hỗ trợ bị bỏ qua) (cùng trang).

### Thích ứng với Shopify Mobile {#example-environment}

Dùng cách này để đổi layout khi app chạy trong app Shopify Mobile, và để giữ một
nút nổi phía trên UI dưới cùng của host.
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
- `shopify.environment` có `mobile`, `embedded`, `pos` và `intent`, đều là
  boolean đồng bộ
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge đặt `--shopify-safe-area-inset-bottom` bằng chiều cao của UI host phủ lên
  phần dưới của app bạn. Các element fixed không được tự di chuyển, nên hãy thêm biến đó vào offset
  `bottom` của chúng, như ví dụ của Shopify (cùng trang).

### Quét mã vạch {#example-scanner}

Dùng cách này trong workflow kiểm kho hoặc nhận hàng trên điện thoại hoặc Shopify POS: quét một mã vạch và tìm
variant.
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
- `scanner.capture()` mở camera của thiết bị và resolve thành một `ScannerPayload` có
  mã vạch trong `data`. Ví dụ của Shopify tra cứu mã vạch bằng GraphQL Admin API theo
  cách tương tự, và xử lý một lần quét bị hủy trong `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` cần Direct API access; xem
  [Giao tiếp với backend](/vi/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Chỉ hiện nút trên mobile và POS là lựa chọn của ví dụ này: Scanner API dùng
  camera của thiết bị, và Shopify mô tả nó cho POS.

### Hỏi Sidekick về dữ liệu của bạn {#example-sidekick}

Dùng cách này để cho người bán nhờ Sidekick giải thích những gì app của bạn hiển thị, ví dụ một báo cáo.
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
- Kiểm tra `isEnabled()` trước khi hiện điểm vào, và gọi `launch` từ một
  hành động của người bán, không phải khi tải trang hoặc theo bộ hẹn giờ
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Các lỗi khác có thể xuất hiện sau khi Shopify đã gửi prompt, nên "don't retry those errors
  automatically" (đừng tự động thử lại các lỗi đó) (cùng trang).
- App Bridge phát `shopify:sidekick:visibilitychange` trên `window` khi panel mở
  hoặc đóng, nhưng không phát trong app Shopify mobile (cùng trang).

### Kiểm tra theme app embed đã bật chưa {#example-app-extensions}

Dùng cách này trên một trang thiết lập, để báo cho người bán khi theme app embed của bạn chưa active.
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
- `app.extensions()` liệt kê các extension của app. Với một theme app extension, mỗi activation
  là một block hoặc embed có `handle` và `status` là `'active'`, `'available'` hoặc
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Dữ liệu activation chỉ đến từ theme đã xuất bản của cửa hàng (cùng trang).

### Gửi Web Vitals đến hệ thống giám sát của bạn {#example-web-vitals}

Dùng cách này để theo dõi hiệu năng thực tế của app trong dịch vụ giám sát của riêng bạn.
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
- `onReport` đăng ký một callback nhận `metrics` như LCP, CLS và INP, mỗi cái
  có `name`, `value` và `id`; `null` hủy đăng ký. Ví dụ của Shopify cũng gửi chúng
  bằng `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Các thành viên cấp cao nhất của `ShopifyGlobal` trong `@shopify/app-bridge-types`. Mô tả lấy từ JSDoc trong type; với thành viên không có JSDoc, mô tả lấy từ phần tóm tắt trên trang shopify.dev được liên kết.

| Thành viên | Kiểu | Mô tả |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | Cấu hình của app: `apiKey` (client ID của app, cung cấp bằng thẻ `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` và `shop`. |
| `origin` | `string` | Không được mô tả trong type. |
| `ready` | `Promise<void>` | Không được mô tả trong type. |
| `setSignals` | `(RealSignal: any) => void` | Đăng ký một bản cài đặt signals, ví dụ từ `@preact/signals`, để các giá trị reactive mà App Bridge trả về dùng class Signal của chính app thay cho bản shim có sẵn. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` và `intent`: app có chạy trong app Shopify Mobile, được nhúng trong trang admin Shopify, chạy trong Shopify POS, hoặc chạy như một intent hay không. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Hiển thị chỉ báo đang tải trong các thao tác chạy lâu. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Tạo ID token cho xác thực server-to-server và các request API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Thông tin về người bán đang đăng nhập, gồm tên, email và locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` hiển thị một thông báo toast trong trang admin Shopify và trả về ID của nó; `hide(id)` ẩn nó. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Cho người bán tìm và chọn các tài nguyên Shopify như sản phẩm, collection hoặc biến thể. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` mở camera của thiết bị để quét mã vạch và resolve thành một `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` và `toggle(id)` hiện, ẩn hoặc chuyển đổi một modal theo ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` và `toggle(id)` hiện, ẩn hoặc chuyển đổi một save bar theo ID; `leaveConfirmation()` yêu cầu người bán xác nhận trước khi rời trang khi có thay đổi chưa lưu. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` và `location`: đọc và thay đổi giỏ hàng POS hiện tại, đóng app và quay lại màn hình POS, và lấy thông tin về thiết bị và địa điểm POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (yêu cầu intent hiện tại, là `null` khi không ở trong quy trình intent), `invoke()` để gọi một intent, `response` để hoàn tất một intent, và `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` đăng ký một callback nhận dữ liệu hiệu năng Web Vitals; `null` hủy đăng ký. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` đăng ký một hàm chạy khi người bán nhấn nút hỗ trợ; `null` hủy đăng ký. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` yêu cầu một modal đánh giá app, modal này chỉ hiển thị khi đáp ứng giới hạn tần suất và điều kiện đủ tư cách. Kết quả có `success`, `code` và `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` trả về các access scope đã cấp, bắt buộc và tùy chọn của app trên shop; `request(scopes)` yêu cầu người bán cấp các scope tùy chọn; `revoke(scopes)` thu hồi các scope tùy chọn đã cấp. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Hiển thị giao diện chọn cho file, ngày và các kiểu dữ liệu thông dụng khác. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolve thành danh sách extension của app, kèm thông tin trạng thái. |
| `shopifyQL` | `ShopifyQLApi` | `available()` và `ready()`. Ngoài ra không được mô tả trong type. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Bắt đầu các cuộc trò chuyện Sidekick cho người bán từ app của bạn. Nó luôn được định nghĩa, nhưng các phương thức của nó reject khi app không dùng được Sidekick; `isEnabled()` kiểm tra điều này. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` và `clear` gắn các hàm xử lý cho các tool đã khai báo trong cấu hình app extension, mà nền tảng có thể gọi thay cho app. |
