---
title: "useAppBridge() – Shopify App Bridge for Vue 3"
description: "useAppBridge() for Vue 3 returns the Shopify App Bridge shopify global, typed as ShopifyGlobal, as in @shopify/app-bridge-react. For Shopify embedded apps."
---

# useAppBridge() {#use-app-bridge}

The `shopify` global is defined by the App Bridge script. Shopify's [useAppBridge reference](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) describes it as the way to use App Bridge APIs such as `toast` and `resourcePicker`.

`useAppBridge()` returns the `shopify` global, typed as `ShopifyGlobal`:

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

As in `@shopify/app-bridge-react`:

- On the server it returns an object that throws when you read any property. Call the
  APIs from `onMounted()` or an event handler.
- In the browser it throws if `shopify` is not defined, which "likely means the App
  Bridge script tag was not added correctly to this page".

Using the `shopify` global directly, as the embedded-app guide does, works too.

## Examples {#examples}

These examples follow Shopify's documentation and have not yet been tested in a live admin.
Each one calls `useAppBridge()` inside `onMounted()` or an event handler, so it also works
with server-side rendering.

### Pick products with the resource picker {#example-resource-picker}

Use this when the merchant chooses products from the store, here for a bundle that they can
edit again later.

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

- The picker returns `undefined` when the merchant cancels, "rather than an empty array",
  so check for it explicitly
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` preselects products, and the variants of each, for edit workflows.
  `multiple: 5` caps the selection; with `type: 'product'` the merchant can still pick
  several variants of one product. `filter.draft` and `filter.archived` set to `false` hide
  draft and archived products (`ResourcePickerOptions`).
- `action: 'select'` sets the verb in the title: "add" for appending to a list, "select" for
  choosing for a purpose or replacing a selection.

### Pick your app's own records {#example-picker}

Use this when the merchant chooses records that live in your app, such as email templates.
For products, variants and collections, Shopify points to the resource picker instead.

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

- `shopify.picker()` resolves to a picker whose `selected` promise resolves to the chosen
  `id`s, or to `undefined` when the merchant cancels. The `data` values follow the order of
  `headers`, and `type: 'number'` right-aligns a column
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` preselects the current choice, which the merchant can still change.

### Toasts for success, errors and undo {#example-toast}

Use this to confirm an action without interrupting the merchant, and to offer an undo.

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

- `ToastOptions` has `duration` (milliseconds, default 5000), `isError`, `action`,
  `onAction` and `onDismiss`. `show()` returns the toast's ID for `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Shopify's use cases include "action buttons in toasts for quick follow-up actions like
  undoing changes" and non-blocking error messages (same page).
- The longer `duration` gives the merchant time to undo. Calling `hide()` is not required
  otherwise: the toast hides after its duration.

### Loading indicator around a request {#example-loading}

Use this while your app waits for data, so the admin shows that something is happening.

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

- `shopify.loading(true)` shows the loading indicator in the admin header, and
  `shopify.loading(false)` hides it
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` makes sure it is turned off.

### Loading indicator during route changes {#example-loading-route-change}

Use this with Vue Router, so that lazy-loaded pages show the admin's loading indicator.

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

- Call `showLoadingDuringNavigation(router)` once where you create the router. Shopify lists
  "page transitions or route changes" as a use of the Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` also runs for cancelled navigations, and `onError` covers a page that fails
  to load.

### Requests to your backend {#example-authenticated-fetch}

Use this to load data from your own server, with the merchant's session.

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

- App Bridge's fetch interceptor "automatically includes the ID token in the
  `Authorization` header for requests to your app's domain". Call `shopify.idToken()`
  yourself only where the interceptor doesn't apply, such as a WebSocket, which is
  Shopify's own example
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Send ID tokens only to your own backend, and verify them there (same page). See also
  [Talk to your backend](/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Shop and locale from the config {#example-config}

Use this to format numbers in the merchant's admin language or to show which shop the app
is in.

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

- `config` is synchronous: "All properties are synchronous and available immediately
  without awaiting a Promise"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` is the language the merchant chose for the admin, "not the shop's
  customer-facing locale". `shop` is the permanent `.myshopify.com` domain, "not a custom
  domain" (`AppBridgeConfig`).

### An app-level composable {#example-admin-action}

Use this to give every button the same loading indicator and toasts without repeating them.

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

- The composable combines the [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  and the [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  as in the examples above. `pending` drives the button's own `loading` prop.

### Ask for an optional access scope {#example-optional-scopes}

Use this when a feature needs a permission that the app does not ask for at install, such as
creating discounts.

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

- `query()` returns the `granted`, `required` and `optional` scopes. `request()` opens a
  permission grant modal and resolves with `result` (`'granted-all'` or `'declined-all'`)
  and the updated `detail`
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- The scopes you request must be declared as optional in your app configuration. Required
  scopes can't be revoked (`Scopes`).

### Create or edit a resource in the admin {#example-intents}

Use this to let the merchant create or edit a Shopify resource in the admin's own screens,
without building that form in your app.

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

- `invoke()` takes `action:type` and options such as `value` (the GID to edit) and `data`.
  A discount needs `data.type`. It resolves to an activity whose `complete` promise gives
  the response: `code` is `'ok'` when the merchant finished, `'closed'` when they closed
  the workflow, and `'error'` with a `message` on failure
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- To edit a product, Shopify suggests checking `hasOnlyDefaultVariant` first and using
  `shopify/ProductVariant` when the product has variants (same page).

### Ask for a review after a success {#example-review-request}

Use this at the end of a workflow that went well, such as the first campaign sent.

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
  merchant first opens your app". Don't call it from a "Review us" button: rate limits may
  stop the modal, and the button would seem broken
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- The modal shows at most once in 60 days and three times in 365 days, and never on mobile,
  within 24 hours of install, or after the merchant reviewed the app. `code` gives the
  reason, such as `'cooldown-period'` (same page).

### Handle the support button {#example-support-handler}

Use this to open your own help page when the merchant clicks the support button at the top
of the app.

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

- Register the handler once, for example in `App.vue`. `null` unregisters it
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- The app needs a Support link extension that points to a page in your app. "Without this
  extension, the support callback is ignored" (same page).

### Adapt to Shopify Mobile {#example-environment}

Use this to change the layout when the app runs in the Shopify Mobile app, and to keep a
floating button above the host's bottom UI.

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

- `shopify.environment` has `mobile`, `embedded`, `pos` and `intent`, all synchronous
  booleans
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge sets `--shopify-safe-area-inset-bottom` to the height of host UI over the
  bottom of your app. Fixed elements are not moved for you, so add the variable to their
  `bottom` offset, as Shopify's example does (same page).

### Scan a barcode {#example-scanner}

Use this in a stock or receiving workflow on a phone or Shopify POS: scan a barcode and find
the variant.

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

- `scanner.capture()` opens the device camera and resolves to a `ScannerPayload` with the
  barcode in `data`. Shopify's example looks the barcode up with the GraphQL Admin API in
  the same way, and handles a cancelled scan in `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` needs Direct API access; see
  [Talk to your backend](/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Showing the button only on mobile and POS is this example's choice: the Scanner API uses
  the device camera, and Shopify describes it for POS.

### Ask Sidekick about your data {#example-sidekick}

Use this to let the merchant ask Sidekick to explain what your app shows, such as a report.

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

- Check `isEnabled()` before showing the entry point, and call `launch` from a merchant
  action, not on load or on a timer
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Other errors can come after Shopify sent the prompt, so "don't retry those errors
  automatically" (same page).
- App Bridge dispatches `shopify:sidekick:visibilitychange` on `window` when the panel opens
  or closes, but not in the Shopify mobile app (same page).

### Check that a theme app embed is on {#example-app-extensions}

Use this on a setup page, to tell the merchant when your theme app embed is not active yet.

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

- `app.extensions()` lists the app's extensions. For a theme app extension, each activation
  is a block or embed with a `handle` and a `status` of `'active'`, `'available'` or
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- The activation data comes from the store's published theme only (same page).

### Send Web Vitals to your monitoring {#example-web-vitals}

Use this to track your app's real-world performance in your own monitoring service.

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

- `onReport` registers a callback that receives `metrics` such as LCP, CLS and INP, each
  with `name`, `value` and `id`; `null` unregisters it. Shopify's example also sends them
  with `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

The top-level members of `ShopifyGlobal` in `@shopify/app-bridge-types`. Descriptions come from the JSDoc in the types; where a member has none, from the summary on the linked shopify.dev page.

| Member | Type | Description |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | The app's configuration: `apiKey` (the app's client ID, provided with a `<meta name="shopify-api-key">` tag), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` and `shop`. |
| `origin` | `string` | Not described in the types. |
| `ready` | `Promise<void>` | Not described in the types. |
| `setSignals` | `(RealSignal: any) => void` | Registers a signals implementation, for example from `@preact/signals`, so that reactive values returned by App Bridge use the app's own Signal class instead of the built-in shim. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` and `intent`: whether the app runs in the Shopify Mobile app, is embedded in the Shopify admin, runs in Shopify POS, or runs as an intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Displays loading indicators during long-running operations. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Generates ID tokens for server-to-server authentication and API requests. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Information about the logged-in merchant, including their name, email and locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` displays a toast notification in the Shopify admin and returns its ID; `hide(id)` hides it. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Lets merchants search and select Shopify resources such as products, collections or variants. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` opens the device camera to scan a barcode and resolves to a `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` and `toggle(id)` show, hide or toggle a modal by its ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` and `toggle(id)` show, hide or toggle a save bar by its ID; `leaveConfirmation()` asks the merchant to confirm before leaving the page when there are unsaved changes. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` and `location`: read and change the current POS cart, close the app and return to the POS screen, and get information about the POS device and location. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (the current intent request, `null` outside an intent workflow), `invoke()` to invoke an intent, `response` to resolve one, and `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registers a callback that receives Web Vitals performance data; `null` unregisters it. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registers a function that runs when the merchant clicks the support button; `null` unregisters it. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` requests an app review modal, which only displays if rate limits and eligibility conditions are met. The result has `success`, `code` and `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` returns the app's granted, required and optional access scopes on the shop; `request(scopes)` asks the merchant to grant optional scopes; `revoke(scopes)` revokes granted optional scopes. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Displays selection interfaces for files, dates and other common data types. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolves to the app's extensions, with their status information. |
| `shopifyQL` | `ShopifyQLApi` | `available()` and `ready()`. Not otherwise described in the types. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Starts Sidekick conversations for the merchant from your app. It is always defined, but its methods reject when Sidekick is not available to the app; `isEnabled()` checks this. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` and `clear` bind handler functions for tools already declared in app extension configuration, which the platform can call on behalf of the app. |
