---
title: "useAppBridge() – Vue 3용 Shopify App Bridge"
description: "Vue 3용 useAppBridge()는 @shopify/app-bridge-react와 마찬가지로 Shopify App Bridge의 전역 shopify를 ShopifyGlobal 타입으로 반환합니다. Shopify 임베디드 앱용입니다."
---

# useAppBridge() {#use-app-bridge}

`shopify` 전역 객체는 App Bridge 스크립트가 정의합니다. Shopify의 [useAppBridge 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)는 이를 `toast`, `resourcePicker` 같은 App Bridge API를 사용하는 방법으로 설명합니다.

`useAppBridge()`는 전역 `shopify`를 반환하며, 타입은 `ShopifyGlobal`입니다.

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

`@shopify/app-bridge-react`와 마찬가지로 다음과 같이 동작합니다.

- 서버에서는 어떤 속성을 읽든 오류를 던지는 객체를 반환합니다. API는 `onMounted()`나
  이벤트 핸들러에서 호출하세요.
- 브라우저에서는 `shopify`가 정의되어 있지 않으면 오류를 던지며, 이는 "likely means the App
  Bridge script tag was not added correctly to this page"입니다.

임베디드 앱 가이드처럼 전역 `shopify`를 직접 사용해도 됩니다.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.
각 예제는 `useAppBridge()`를 `onMounted()` 또는 이벤트 핸들러 안에서 호출하므로 서버 사이드 렌더링에서도
동작합니다.

### 리소스 선택기로 상품 선택하기 {#example-resource-picker}

판매자가 스토어에서 상품을 고를 때 사용합니다. 여기서는 나중에 다시 편집할 수 있는 번들입니다.

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

- 판매자가 취소하면 선택기는 "빈 배열이 아니라" `undefined`를 반환하므로 명시적으로 확인하세요
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds`는 편집 워크플로를 위해 상품과 각 상품의 variant를 미리 선택합니다. `multiple: 5`는
  선택 개수를 제한하며, `type: 'product'`에서도 판매자는 한 상품의 variant 여러 개를 고를 수
  있습니다. `filter.draft`와 `filter.archived`를 `false`로 설정하면 초안 및 보관된 상품이 숨겨집니다
  (`ResourcePickerOptions`).
- `action: 'select'`는 제목의 동사를 정합니다. 목록에 추가할 때는 "add", 목적에 맞게 고르거나 선택을
  교체할 때는 "select"입니다.

### 앱 자체 레코드 선택하기 {#example-picker}

이메일 템플릿처럼 앱에 있는 레코드를 판매자가 고를 때 사용합니다. 상품, variant, 컬렉션에는
Shopify가 리소스 선택기를 안내합니다.

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

- `shopify.picker()`는 선택기로 resolve되며, 그 `selected` promise는 선택한 `id`로 resolve되거나
  판매자가 취소하면 `undefined`로 resolve됩니다. `data` 값은 `headers`의 순서를 따르고,
  `type: 'number'`는 열을 오른쪽 정렬합니다
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true`는 현재 선택을 미리 선택하며, 판매자는 이를 여전히 바꿀 수 있습니다.

### 성공, 오류, 실행 취소를 위한 토스트 {#example-toast}

판매자를 방해하지 않고 작업을 확인하고, 실행 취소를 제공할 때 사용합니다.

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

- `ToastOptions`에는 `duration`(밀리초, 기본값 5000), `isError`, `action`, `onAction`, `onDismiss`가
  있습니다. `show()`는 `hide(id)`에 쓸 토스트의 ID를 반환합니다
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Shopify가 드는 사용 사례에는 "변경 취소 같은 빠른 후속 작업을 위한 토스트의 작업 버튼"과 차단하지
  않는 오류 메시지가 있습니다(같은 페이지).
- 더 긴 `duration`은 판매자에게 실행 취소할 시간을 줍니다. 그 외에는 `hide()`를 호출할 필요가
  없습니다. 토스트는 지속 시간이 지나면 숨겨집니다.

### 요청 중 로딩 표시기 {#example-loading}

앱이 데이터를 기다리는 동안 관리자에 작업이 진행 중임을 보여 줄 때 사용합니다.

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

- `shopify.loading(true)`는 관리자 헤더에 로딩 표시기를 표시하고, `shopify.loading(false)`는 숨깁니다
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally`가 반드시 꺼지도록 합니다.

### 라우트 변경 중 로딩 표시기 {#example-loading-route-change}

Vue Router와 함께 사용해, 지연 로드되는 페이지에서 관리자의 로딩 표시기를 표시합니다.

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

- `showLoadingDuringNavigation(router)`는 라우터를 만드는 곳에서 한 번만 호출하세요. Shopify는
  "페이지 전환 또는 라우트 변경"을 Loading API의 용도로 듭니다
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach`는 취소된 탐색에서도 실행되며, `onError`는 로드에 실패한 페이지를 처리합니다.

### 백엔드로 보내는 요청 {#example-authenticated-fetch}

판매자의 세션과 함께 자체 서버에서 데이터를 불러올 때 사용합니다.

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

- App Bridge의 fetch 인터셉터는 "앱 도메인으로 가는 요청의 `Authorization` 헤더에 ID 토큰을 자동으로
  포함합니다". 인터셉터가 적용되지 않는 곳, 예를 들어 Shopify의 예제인 WebSocket에서만 직접
  `shopify.idToken()`을 호출하세요
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- ID 토큰은 자체 백엔드로만 보내고 그곳에서 검증하세요(같은 페이지).
  [백엔드와 통신하기](/ko/guide/shopify-embedded-app#_4-talk-to-your-backend)도 참고하세요.

### config에서 가져오는 스토어와 로케일 {#example-config}

판매자의 관리자 언어로 숫자를 서식화하거나, 앱이 어느 스토어에서 실행 중인지 표시할 때 사용합니다.

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

- `config`는 동기식입니다. "모든 속성은 동기식이며 Promise를 기다리지 않고 즉시 사용할 수 있습니다"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale`은 판매자가 관리자에 선택한 언어이며, "스토어의 고객용 로케일이 아닙니다". `shop`은 영구적인
  `.myshopify.com` 도메인이며, "커스텀 도메인이 아닙니다"(`AppBridgeConfig`).

### 앱 수준 컴포저블 {#example-admin-action}

모든 버튼에 같은 로딩 표시기와 토스트를 반복 없이 적용할 때 사용합니다.

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

- 이 컴포저블은 위의 예제처럼 [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)와
  [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)를
  결합합니다. `pending`은 버튼 자체의 `loading` prop을 제어합니다.

### 선택적 액세스 범위 요청하기 {#example-optional-scopes}

설치할 때 앱이 요청하지 않은 권한이 기능에 필요할 때 사용합니다. 예를 들어 할인 생성이 있습니다.

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

- `query()`는 `granted`, `required`, `optional` 범위를 반환합니다. `request()`는 권한 부여 모달을 열고
  `result`(`'granted-all'` 또는 `'declined-all'`)와 업데이트된 `detail`로 resolve됩니다
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- 요청하는 범위는 앱 구성에서 선택적으로 선언되어 있어야 합니다. 필수 범위는 취소할 수
  없습니다(`Scopes`).

### 관리자에서 리소스 생성 또는 편집하기 {#example-intents}

앱에서 폼을 만들지 않고, 판매자가 관리자 자체 화면에서 Shopify 리소스를 생성하거나 편집하게 할 때
사용합니다.

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

- `invoke()`는 `action:type`과 `value`(편집할 GID), `data` 같은 옵션을 받습니다. 할인에는
  `data.type`이 필요합니다. 이 호출은 activity로 resolve되며, 그 `complete` promise가 응답을
  제공합니다. `code`는 판매자가 완료하면 `'ok'`, 워크플로를 닫으면 `'closed'`, 실패하면 `message`가 있는
  `'error'`입니다
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- 상품을 편집하려면 Shopify는 먼저 `hasOnlyDefaultVariant`를 확인하고, 상품에 variant가 있으면
  `shopify/ProductVariant`를 사용하라고 안내합니다(같은 페이지).

### 성공 후 리뷰 요청하기 {#example-review-request}

첫 캠페인을 보낸 것처럼, 잘 끝난 워크플로의 마지막에 사용합니다.

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

- Shopify: "판매자가 앱을 처음 열 때보다 성공적인 워크플로의 끝에 리뷰를 요청하는 것이 낫습니다".
  "Review us" 버튼에서는 호출하지 마세요. 요청 한도 때문에 모달이 표시되지 않을 수 있어 버튼이 고장난
  것처럼 보입니다
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- 모달은 60일에 한 번, 365일에 세 번까지만 표시되며, 모바일에서, 설치 후 24시간 이내에, 판매자가 이미
  앱을 리뷰한 뒤에는 표시되지 않습니다. `code`는 `'cooldown-period'` 같은 이유를 알려 줍니다(같은 페이지).

### 지원 버튼 처리하기 {#example-support-handler}

판매자가 앱 상단의 지원 버튼을 클릭할 때 자체 도움말 페이지를 열려면 사용합니다.

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

- 핸들러는 예를 들어 `App.vue`에서 한 번만 등록하세요. `null`은 등록을 해제합니다
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- 앱에는 앱 내 페이지를 가리키는 Support link extension이 필요합니다. "이 extension이 없으면 지원
  콜백은 무시됩니다"(같은 페이지).

### Shopify Mobile에 맞추기 {#example-environment}

앱이 Shopify Mobile 앱에서 실행될 때 레이아웃을 바꾸고, 플로팅 버튼을 호스트의 하단 UI 위에
유지할 때 사용합니다.

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

- `shopify.environment`에는 `mobile`, `embedded`, `pos`, `intent`가 있으며, 모두 동기식 불리언입니다
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge는 `--shopify-safe-area-inset-bottom`을 앱 하단을 덮는 호스트 UI의 높이로 설정합니다.
  고정 요소는 자동으로 이동하지 않으므로, Shopify의 예제처럼 변수를 `bottom` 오프셋에
  더하세요(같은 페이지).

### 바코드 스캔하기 {#example-scanner}

휴대폰이나 Shopify POS의 재고 또는 입고 워크플로에서 바코드를 스캔해 variant를 찾을 때 사용합니다.

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

- `scanner.capture()`는 기기 카메라를 열고, `data`에 바코드가 담긴 `ScannerPayload`로 resolve됩니다.
  Shopify의 예제도 GraphQL Admin API로 같은 방식으로 바코드를 조회하고, 취소된 스캔은 `catch`에서
  처리합니다
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json`에는 Direct API 액세스가 필요합니다.
  [백엔드와 통신하기](/ko/guide/shopify-embedded-app#_4-talk-to-your-backend)를 참고하세요.
- 버튼을 모바일과 POS에서만 표시하는 것은 이 예제의 선택입니다. Scanner API는 기기 카메라를 사용하며,
  Shopify는 이를 POS용으로 설명합니다.

### 내 데이터에 대해 Sidekick에게 묻기 {#example-sidekick}

보고서처럼 앱이 보여 주는 내용을 판매자가 Sidekick에게 설명해 달라고 요청하게 할 때 사용합니다.

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

- 진입점을 표시하기 전에 `isEnabled()`를 확인하고, `launch`는 로드 시점이나 타이머가 아니라 판매자의
  동작에서 호출하세요
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- 다른 오류는 Shopify가 프롬프트를 보낸 뒤에 발생할 수 있으므로 "해당 오류는 자동으로 재시도하지
  마세요"(같은 페이지).
- App Bridge는 패널이 열리거나 닫힐 때 `window`에 `shopify:sidekick:visibilitychange`를
  디스패치하지만, Shopify 모바일 앱에서는 그렇지 않습니다(같은 페이지).

### 테마 앱 임베드가 켜져 있는지 확인하기 {#example-app-extensions}

설정 페이지에서 테마 앱 임베드가 아직 활성화되지 않았음을 판매자에게 알릴 때 사용합니다.

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

- `app.extensions()`는 앱의 extension을 나열합니다. 테마 앱 extension의 각 활성화는 `handle`과
  `'active'`, `'available'`, `'unavailable'` 중 하나인 `status`를 가진 블록 또는 임베드입니다
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- 활성화 데이터는 스토어의 게시된 테마에서만 가져옵니다(같은 페이지).

### Web Vitals를 모니터링으로 보내기 {#example-web-vitals}

앱의 실제 성능을 자체 모니터링 서비스에서 추적할 때 사용합니다.

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

- `onReport`는 LCP, CLS, INP 같은 `metrics`를 받는 콜백을 등록하며, 각 metric에는 `name`, `value`,
  `id`가 있습니다. `null`은 등록을 해제합니다. Shopify의 예제는 이를 `navigator.sendBeacon`으로도
  전송합니다
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

`@shopify/app-bridge-types`에 있는 `ShopifyGlobal`의 최상위 멤버입니다. 설명은 타입의 JSDoc에서 가져왔고, JSDoc이 없는 멤버는 링크된 shopify.dev 페이지의 요약에서 가져왔습니다.

| 멤버 | 타입 | 설명 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | 앱의 구성: `apiKey`(`<meta name="shopify-api-key">` 태그로 제공하는 앱의 클라이언트 ID), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale`, `shop`. |
| `origin` | `string` | 타입에 설명이 없습니다. |
| `ready` | `Promise<void>` | 타입에 설명이 없습니다. |
| `setSignals` | `(RealSignal: any) => void` | 시그널 구현(예: `@preact/signals`)을 등록하여, App Bridge가 반환하는 반응형 값이 내장 shim 대신 앱 자체의 Signal 클래스를 사용하게 합니다. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos`, `intent`: 앱이 Shopify Mobile 앱에서 실행되는지, Shopify 관리자에 임베드되어 있는지, Shopify POS에서 실행되는지, 인텐트로 실행되는지를 나타냅니다. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 오래 걸리는 작업 중에 로딩 표시기를 표시합니다. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | 서버 간 인증과 API 요청을 위한 ID 토큰을 생성합니다. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | 로그인한 판매자의 이름, 이메일, 로케일 등의 정보입니다. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)`는 Shopify 관리자에 토스트 알림을 표시하고 그 ID를 반환하며, `hide(id)`는 이를 숨깁니다. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | 판매자가 제품, 컬렉션, 변형 같은 Shopify 리소스를 검색하고 선택할 수 있게 합니다. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()`는 바코드를 스캔하기 위해 기기 카메라를 열고 `ScannerPayload`로 resolve됩니다. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)`, `toggle(id)`는 ID로 모달을 표시하거나 숨기거나 전환합니다. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)`, `toggle(id)`는 ID로 저장 바를 표시하거나 숨기거나 전환하며, `leaveConfirmation()`은 저장되지 않은 변경 사항이 있을 때 페이지를 떠나기 전에 판매자에게 확인을 요청합니다. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device`, `location`: 현재 POS 장바구니를 읽고 변경하고, 앱을 닫고 POS 화면으로 돌아가고, POS 기기와 위치 정보를 가져옵니다. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`(현재 인텐트 요청, 인텐트 워크플로 밖에서는 `null`), 인텐트를 호출하는 `invoke()`, 인텐트를 완료하는 `response`, 그리고 `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)`는 Web Vitals 성능 데이터를 받는 콜백을 등록하며, `null`은 등록을 해제합니다. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)`는 판매자가 지원 버튼을 클릭할 때 실행할 함수를 등록하며, `null`은 등록을 해제합니다. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()`는 앱 리뷰 모달을 요청하며, 이 모달은 빈도 제한과 자격 조건을 충족할 때만 표시됩니다. 결과에는 `success`, `code`, `message`가 있습니다. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()`는 상점에서 앱에 부여된, 필수 및 선택적 액세스 범위를 반환하고, `request(scopes)`는 판매자에게 선택적 범위를 부여해 달라고 요청하며, `revoke(scopes)`는 부여된 선택적 범위를 취소합니다. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | 파일, 날짜 및 기타 일반적인 데이터 유형에 대한 선택 인터페이스를 표시합니다. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()`는 앱의 확장 목록과 그 상태 정보로 resolve됩니다. |
| `shopifyQL` | `ShopifyQLApi` | `available()`과 `ready()`. 그 밖의 내용은 타입에 설명이 없습니다. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | 앱에서 판매자를 위한 Sidekick 대화를 시작합니다. 항상 정의되어 있지만, 앱에서 Sidekick을 사용할 수 없으면 메서드가 reject되며, `isEnabled()`로 이를 확인합니다. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister`, `clear`는 앱 확장 구성에 이미 선언된 도구에 핸들러 함수를 연결하며, 플랫폼이 앱을 대신해 이를 호출할 수 있습니다. |
