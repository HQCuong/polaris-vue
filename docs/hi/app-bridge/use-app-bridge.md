---
title: "useAppBridge() – Vue 3 के लिए Shopify App Bridge"
description: "Vue 3 के लिए useAppBridge() Shopify App Bridge का shopify global लौटाता है, जिसका type ShopifyGlobal है, जैसा @shopify/app-bridge-react में। Shopify embedded apps के लिए।"
---

# useAppBridge() {#use-app-bridge}

`shopify` global को App Bridge script define करता है। Shopify का [useAppBridge reference](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) इसे `toast` और `resourcePicker` जैसी App Bridge APIs इस्तेमाल करने का तरीका बताता है।

`useAppBridge()` `shopify` global लौटाता है, जिसका type `ShopifyGlobal` है:

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

`@shopify/app-bridge-react` की तरह:

- Server पर यह एक ऐसा object लौटाता है जो किसी भी property को पढ़ने पर error throw करता है। APIs को
  `onMounted()` या किसी event handler से call करें।
- Browser में, अगर `shopify` परिभाषित नहीं है तो यह error throw करता है, जिसका मतलब "likely means the App
  Bridge script tag was not added correctly to this page" है।

`shopify` global को सीधे इस्तेमाल करना, जैसा embedded-app guide करती है, भी काम करता है।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।
इनमें से हर एक `useAppBridge()` को `onMounted()` या किसी event handler के अंदर call करता है, इसलिए यह server-side rendering के साथ भी काम करता है।

### Resource picker से products चुनें {#example-resource-picker}

इसे तब इस्तेमाल करें जब merchant store से products चुनता है, यहाँ एक bundle के लिए जिसे वह बाद में दोबारा edit कर सकता है।

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

- Merchant के cancel करने पर picker "rather than an empty array" (खाली array के बजाय) `undefined` लौटाता है, इसलिए उसे स्पष्ट रूप से जाँचें ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api))।
- `selectionIds` edit workflows के लिए products को, और हर product के variants को, पहले से चुन देता है। `multiple: 5` चयन की सीमा तय करता है; `type: 'product'` के साथ merchant फिर भी एक product के कई variants चुन सकता है। `false` पर सेट `filter.draft` और `filter.archived` draft और archived products को छिपाते हैं (`ResourcePickerOptions`)।
- `action: 'select'` title में क्रिया तय करता है: सूची में जोड़ने के लिए "add", किसी उद्देश्य से चुनने या चयन बदलने के लिए "select"।

### अपने app के records चुनें {#example-picker}

इसे तब इस्तेमाल करें जब merchant ऐसे records चुनता है जो आपके app में हैं, जैसे email templates। Products, variants और collections के लिए Shopify इसके बजाय resource picker की ओर इशारा करता है।

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

- `shopify.picker()` एक picker में resolve होता है जिसका `selected` promise चुने गए `id`s में resolve होता है, या merchant के cancel करने पर `undefined` में। `data` की values `headers` के क्रम का अनुसरण करती हैं, और `type: 'number'` किसी column को दाईं ओर align करता है ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api))।
- `selected: true` मौजूदा चुनाव को पहले से चुन देता है, जिसे merchant फिर भी बदल सकता है।

### Success, errors और undo के लिए toasts {#example-toast}

इसे merchant को बाधित किए बिना किसी action की पुष्टि करने, और undo की सुविधा देने के लिए इस्तेमाल करें।

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

- `ToastOptions` में `duration` (milliseconds में, default 5000), `isError`, `action`, `onAction` और `onDismiss` हैं। `show()` toast का ID लौटाता है, जिसे `hide(id)` में इस्तेमाल किया जाता है ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api))।
- Shopify के use cases में "action buttons in toasts for quick follow-up actions like undoing changes" (toasts में action buttons, जैसे बदलाव undo करने जैसी तेज़ follow-up actions के लिए) और non-blocking error messages शामिल हैं (उसी page से)।
- लंबी `duration` merchant को undo करने का समय देती है। `hide()` call करना ज़रूरी नहीं है: toast अपनी duration के बाद छिप जाता है।

### Request के आसपास loading indicator {#example-loading}

इसे तब इस्तेमाल करें जब आपका app data का इंतज़ार कर रहा हो, ताकि admin दिखाए कि कुछ हो रहा है।

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

- `shopify.loading(true)` admin के header में loading indicator दिखाता है, और `shopify.loading(false)` उसे छिपाता है ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api))। `finally` यह पक्का करता है कि वह बंद हो जाए।

### Route बदलने के दौरान loading indicator {#example-loading-route-change}

इसे Vue Router के साथ इस्तेमाल करें, ताकि lazy-loaded pages admin का loading indicator दिखाएँ।

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

- `showLoadingDuringNavigation(router)` को एक बार call करें, जहाँ आप router बनाते हैं। Shopify Loading API के उपयोगों में "page transitions or route changes" (page transitions या route changes) गिनाता है ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api))।
- `afterEach` रद्द हुए navigations पर भी चलता है, और `onError` उस page को कवर करता है जो लोड नहीं हो पाता।

### आपके backend को requests {#example-authenticated-fetch}

इसे अपने server से merchant के session के साथ data लोड करने के लिए इस्तेमाल करें।

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

- App Bridge का fetch interceptor "automatically includes the ID token in the `Authorization` header for requests to your app's domain" (आपके app के domain की requests के लिए `Authorization` header में ID token अपने आप शामिल करता है)। `shopify.idToken()` को ख़ुद वहीं call करें जहाँ interceptor लागू नहीं होता, जैसे WebSocket, जो Shopify का अपना example है ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api))।
- ID tokens केवल अपने backend को भेजें, और वहीं उन्हें verify करें (उसी page से)। यह भी देखें [अपने backend से बात करें](/hi/guide/shopify-embedded-app#_4-talk-to-your-backend)।

### Config से shop और locale {#example-config}

इसे merchant की admin भाषा में numbers format करने, या यह दिखाने के लिए इस्तेमाल करें कि app किस shop में है।

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

- `config` synchronous है: "All properties are synchronous and available immediately without awaiting a Promise" (सभी properties synchronous हैं और Promise का इंतज़ार किए बिना तुरंत उपलब्ध हैं) ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api))।
- `locale` वह भाषा है जो merchant ने admin के लिए चुनी है, "not the shop's customer-facing locale" (shop का customer-facing locale नहीं)। `shop` स्थायी `.myshopify.com` domain है, "not a custom domain" (custom domain नहीं) (`AppBridgeConfig`)।

### App-level composable {#example-admin-action}

इसे हर button को बिना दोहराए एक जैसा loading indicator और toasts देने के लिए इस्तेमाल करें।

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

- Composable [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api) और [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api) को मिलाता है, जैसा ऊपर के examples में है। `pending` button के अपने `loading` prop को चलाता है।

### Optional access scope माँगें {#example-optional-scopes}

इसे तब इस्तेमाल करें जब किसी feature को ऐसी permission चाहिए जो app install पर नहीं माँगता, जैसे discounts बनाना।

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

- `query()` `granted`, `required` और `optional` scopes लौटाता है। `request()` एक permission grant modal खोलता है और `result` (`'granted-all'` या `'declined-all'`) और अपडेट किए गए `detail` के साथ resolve होता है ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api))।
- आप जो scopes माँगते हैं उन्हें आपके app configuration में optional के रूप में declare किया जाना चाहिए। Required scopes वापस नहीं लिए जा सकते (`Scopes`)।

### Admin में resource बनाएँ या edit करें {#example-intents}

इसे merchant को Shopify resource को admin की अपनी screens में बनाने या edit करने देने के लिए इस्तेमाल करें, बिना अपने app में वह form बनाए।

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

- `invoke()` `action:type` और `value` (edit करने वाला GID) और `data` जैसे options लेता है। Discount को `data.type` चाहिए। यह एक activity में resolve होता है जिसका `complete` promise response देता है: `code` `'ok'` होता है जब merchant ने काम पूरा किया, `'closed'` जब उसने workflow बंद कर दिया, और विफलता पर `message` के साथ `'error'` ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api))।
- Product edit करने के लिए, Shopify पहले `hasOnlyDefaultVariant` जाँचने और product में variants होने पर `shopify/ProductVariant` इस्तेमाल करने का सुझाव देता है (उसी page से)।

### Success के बाद review माँगें {#example-review-request}

इसे ऐसे workflow के अंत में इस्तेमाल करें जो अच्छा रहा, जैसे पहला campaign भेजा जाना।

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

- Shopify: "It's better to request a review at the end of a successful workflow than when a merchant first opens your app" (review माँगना तब बेहतर है जब successful workflow ख़त्म हो, बजाय इसके कि merchant पहली बार आपका app खोले)। इसे "Review us" button से call न करें: rate limits modal को रोक सकती हैं, और button टूटा हुआ लगेगा ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api))।
- Modal 60 दिनों में अधिकतम एक बार और 365 दिनों में तीन बार दिखता है, और कभी mobile पर, install के 24 घंटे के भीतर, या merchant के app को review करने के बाद नहीं दिखता। `code` कारण बताता है, जैसे `'cooldown-period'` (उसी page से)।

### Support button को handle करें {#example-support-handler}

इसे तब इस्तेमाल करें जब merchant app के ऊपर support button पर click करे और आप अपना help page खोलना चाहें।

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

- Handler को एक बार register करें, जैसे `App.vue` में। `null` उसे unregister करता है ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api))।
- App को एक Support link extension चाहिए जो आपके app के किसी page की ओर इशारा करे। "Without this extension, the support callback is ignored" (इस extension के बिना support callback को अनदेखा किया जाता है) (उसी page से)।

### Shopify Mobile के अनुसार ढलें {#example-environment}

इसे तब इस्तेमाल करें जब app Shopify Mobile app में चले और आप layout बदलना चाहें, और floating button को host की नीचे की UI के ऊपर रखना चाहें।

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

- `shopify.environment` में `mobile`, `embedded`, `pos` और `intent` हैं, सब synchronous booleans ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api))।
- App Bridge `--shopify-safe-area-inset-bottom` को आपके app के निचले हिस्से पर host UI की ऊँचाई पर सेट करता है। Fixed elements आपके लिए नहीं हिलाए जाते, इसलिए उनके `bottom` offset में यह variable जोड़ें, जैसा Shopify का example करता है (उसी page से)।

### Barcode scan करें {#example-scanner}

इसे phone या Shopify POS पर stock या receiving workflow में इस्तेमाल करें: barcode scan करें और variant ढूँढें।

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

- `scanner.capture()` device का camera खोलता है और `ScannerPayload` में resolve होता है जिसके `data` में barcode होता है। Shopify का example barcode को GraphQL Admin API से इसी तरह खोजता है, और रद्द किए गए scan को `catch` में संभालता है ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api))।
- `shopify:admin/api/graphql.json` को Direct API access चाहिए; देखें [अपने backend से बात करें](/hi/guide/shopify-embedded-app#_4-talk-to-your-backend)।
- Button को केवल mobile और POS पर दिखाना इस example का अपना चुनाव है: Scanner API device के camera का इस्तेमाल करती है, और Shopify उसे POS के लिए बताता है।

### अपने data के बारे में Sidekick से पूछें {#example-sidekick}

इसे merchant को Sidekick से यह समझाने के लिए कहने देने के लिए इस्तेमाल करें कि आपका app क्या दिखाता है, जैसे कोई report।

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

- Entry point दिखाने से पहले `isEnabled()` जाँचें, और `launch` को merchant के किसी action से call करें, load पर या timer पर नहीं ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api))।
- दूसरे errors Shopify के prompt भेजने के बाद आ सकते हैं, इसलिए "don't retry those errors automatically" (उन errors को अपने आप दोबारा try न करें) (उसी page से)।
- जब panel खुलता या बंद होता है, तब App Bridge `window` पर `shopify:sidekick:visibilitychange` dispatch करता है, लेकिन Shopify mobile app में नहीं (उसी page से)।

### जाँचें कि theme app embed चालू है {#example-app-extensions}

इसे setup page पर इस्तेमाल करें, ताकि merchant को बताया जा सके कि आपका theme app embed अभी active नहीं है।

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

- `app.extensions()` app के extensions की सूची देता है। Theme app extension के लिए, हर activation एक block या embed है जिसमें `handle` और `'active'`, `'available'` या `'unavailable'` में से एक `status` होता है ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api))।
- Activation data केवल store की published theme से आता है (उसी page से)।

### Web Vitals को अपनी monitoring में भेजें {#example-web-vitals}

इसे अपने app की real-world performance को अपनी monitoring service में track करने के लिए इस्तेमाल करें।

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

- `onReport` एक callback register करता है जो LCP, CLS और INP जैसे `metrics` पाता है, हर एक में `name`, `value` और `id` होते हैं; `null` उसे unregister करता है। Shopify का example उन्हें `navigator.sendBeacon` से भी भेजता है ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api))।

## API {#reference}

`@shopify/app-bridge-types` में `ShopifyGlobal` के top-level members। विवरण types के JSDoc से लिए गए हैं; जिस member का JSDoc नहीं है, उसका विवरण linked shopify.dev page के summary से लिया गया है।

| Member | Type | विवरण |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | App का configuration: `apiKey` (app का client ID, जो `<meta name="shopify-api-key">` tag से दिया जाता है), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` और `shop`। |
| `origin` | `string` | Types में इसका विवरण नहीं है। |
| `ready` | `Promise<void>` | Types में इसका विवरण नहीं है। |
| `setSignals` | `(RealSignal: any) => void` | एक signals implementation register करता है, जैसे `@preact/signals` से, ताकि App Bridge जो reactive values लौटाता है वे built-in shim की जगह app की अपनी Signal class इस्तेमाल करें। |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` और `intent`: app Shopify Mobile app में चल रहा है या नहीं, Shopify admin में embedded है या नहीं, Shopify POS में चल रहा है या नहीं, या intent के रूप में चल रहा है या नहीं। |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | लंबे operations के दौरान loading indicators दिखाता है। |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Server-to-server authentication और API requests के लिए ID tokens बनाता है। |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Logged-in merchant की जानकारी, जिसमें उनका नाम, email और locale शामिल हैं। |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` Shopify admin में एक toast notification दिखाता है और उसका ID लौटाता है; `hide(id)` उसे छिपाता है। |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Merchants को products, collections या variants जैसे Shopify resources खोजने और चुनने देता है। |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` barcode scan करने के लिए device का camera खोलता है और एक `ScannerPayload` में resolve होता है। |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` और `toggle(id)` किसी modal को उसके ID से दिखाते, छिपाते या toggle करते हैं। |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` और `toggle(id)` किसी save bar को उसके ID से दिखाते, छिपाते या toggle करते हैं; बिना save किए बदलाव होने पर `leaveConfirmation()` page छोड़ने से पहले merchant से पुष्टि माँगता है। |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` और `location`: मौजूदा POS cart पढ़ना और बदलना, app बंद करके POS screen पर लौटना, और POS device और location की जानकारी लेना। |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (मौजूदा intent request, intent workflow के बाहर `null`), intent invoke करने के लिए `invoke()`, intent resolve करने के लिए `response`, और `register()`। |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` एक callback register करता है जिसे Web Vitals performance data मिलता है; `null` उसे unregister करता है। |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` एक function register करता है जो merchant के support button पर click करने पर चलता है; `null` उसे unregister करता है। |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` एक app review modal माँगता है, जो सिर्फ़ तभी दिखता है जब rate limits और eligibility conditions पूरी हों। Result में `success`, `code` और `message` होते हैं। |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` shop पर app के granted, required और optional access scopes लौटाता है; `request(scopes)` merchant से optional scopes देने को कहता है; `revoke(scopes)` दिए गए optional scopes वापस लेता है। |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Files, dates और दूसरे आम data types के लिए selection interfaces दिखाता है। |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` app के extensions और उनकी status जानकारी में resolve होता है। |
| `shopifyQL` | `ShopifyQLApi` | `available()` और `ready()`। इसके अलावा types में इसका विवरण नहीं है। |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | आपके app से merchant के लिए Sidekick conversations शुरू करता है। यह हमेशा defined रहता है, लेकिन app के लिए Sidekick उपलब्ध न होने पर इसके methods reject होते हैं; `isEnabled()` यह जाँचता है। |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` और `clear` उन tools के लिए handler functions जोड़ते हैं जो app extension configuration में पहले से declared हैं, और जिन्हें platform app की ओर से call कर सकता है। |
