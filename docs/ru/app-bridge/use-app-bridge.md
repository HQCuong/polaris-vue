---
title: "useAppBridge() – Shopify App Bridge для Vue 3"
description: "useAppBridge() для Vue 3 возвращает глобальный объект shopify из Shopify App Bridge, типизированный как ShopifyGlobal, как в @shopify/app-bridge-react. Для встроенных приложений Shopify."
---

# useAppBridge() {#use-app-bridge}

Глобальный объект `shopify` определяется скриптом App Bridge. [Справочник useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) Shopify описывает его как способ использовать API App Bridge, такие как `toast` и `resourcePicker`.

`useAppBridge()` возвращает глобальный объект `shopify`, типизированный как `ShopifyGlobal`:

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

Как и в `@shopify/app-bridge-react`:

- На сервере он возвращает объект, который выбрасывает ошибку при чтении любого свойства. Вызывайте
  API из `onMounted()` или обработчика события.
- В браузере он выбрасывает ошибку, если `shopify` не определён, что «скорее всего, означает, что тег скрипта App Bridge не был правильно добавлен на эту страницу».

Можно также использовать глобальный объект `shopify` напрямую, как это делает руководство по встроенному приложению.

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.
Каждый из них вызывает `useAppBridge()` внутри `onMounted()` или обработчика события, поэтому он работает
и при серверном рендеринге.

### Выбор товаров через resource picker {#example-resource-picker}

Используйте это, когда продавец выбирает товары магазина, здесь для комплекта, который он может
позже отредактировать снова.

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

- Если продавец отменяет выбор, выбор ресурсов возвращает `undefined`, «а не пустой массив»,
  поэтому проверяйте это явно
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` заранее выбирает товары и их варианты для сценариев редактирования.
  `multiple: 5` ограничивает выбор; при `type: 'product'` продавец всё равно может выбрать
  несколько вариантов одного товара. `filter.draft` и `filter.archived` со значением `false` скрывают
  черновики и архивные товары (`ResourcePickerOptions`).
- `action: 'select'` задаёт глагол в заголовке: «add» — для добавления в список, «select» — для
  выбора для какой-то цели или замены выбора.

### Выбор собственных записей приложения {#example-picker}

Используйте это, когда продавец выбирает записи, которые хранятся в вашем приложении, например шаблоны писем.
Для товаров, вариантов и коллекций Shopify отсылает к resource picker.

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

- `shopify.picker()` возвращает picker, у которого промис `selected` разрешается списком выбранных
  `id` или значением `undefined`, если продавец отменил выбор. Значения `data` идут в порядке
  `headers`, а `type: 'number'` выравнивает столбец по правому краю
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` заранее выбирает текущий вариант, который продавец всё равно может изменить.

### Toast-уведомления об успехе, ошибках и отмене {#example-toast}

Используйте это, чтобы подтвердить действие, не прерывая продавца, и предложить отмену.

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

- У `ToastOptions` есть `duration` (миллисекунды, по умолчанию 5000), `isError`, `action`,
  `onAction` и `onDismiss`. `show()` возвращает ID toast-уведомления для `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Среди сценариев использования у Shopify: «кнопки действий в toast-уведомлениях для быстрых последующих действий, например отмены изменений»
  и неблокирующие сообщения об ошибках (там же).
- Большая `duration` даёт продавцу время на отмену. Вызывать `hide()` в остальных случаях
  не обязательно: toast-уведомление скрывается по истечении этого времени.

### Индикатор загрузки вокруг запроса {#example-loading}

Используйте это, пока приложение ждёт данные, чтобы админка показывала, что идёт работа.

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

- `shopify.loading(true)` показывает индикатор загрузки в шапке админки, а
  `shopify.loading(false)` скрывает его
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` гарантирует, что он будет выключен.

### Индикатор загрузки при смене маршрута {#example-loading-route-change}

Используйте это с Vue Router, чтобы для страниц с отложенной загрузкой админка показывала индикатор загрузки.

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

- Вызовите `showLoadingDuringNavigation(router)` один раз там, где вы создаёте роутер. Shopify указывает
  «переходы между страницами или смену маршрута» среди применений Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` срабатывает и для отменённых переходов, а `onError` обрабатывает страницу, которая не
  загрузилась.

### Запросы к вашему бэкенду {#example-authenticated-fetch}

Используйте это, чтобы загружать данные со своего сервера с сессией продавца.

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

- Перехватчик fetch в App Bridge «автоматически добавляет ID-токен в заголовок `Authorization` для запросов к домену вашего приложения». Вызывайте `shopify.idToken()`
  сами только там, где перехватчик не применяется, например для WebSocket, что и является
  примером Shopify
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Отправляйте ID-токены только на свой бэкенд и проверяйте их там (там же). См. также
  [Обращение к бэкенду](/ru/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Магазин и язык из конфигурации {#example-config}

Используйте это, чтобы форматировать числа на языке админки продавца или показывать, в каком магазине
работает приложение.

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

- `config` синхронный: «Все свойства синхронные и доступны сразу, без ожидания Promise»
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` — это язык, который продавец выбрал для админки, «а не язык магазина для покупателей». `shop` — постоянный домен `.myshopify.com`, «а не пользовательский домен» (`AppBridgeConfig`).

### Композабл уровня приложения {#example-admin-action}

Используйте это, чтобы дать каждой кнопке один и тот же индикатор загрузки и toast-уведомления без повторения кода.

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

- Композабл объединяет [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  и [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  как в примерах выше. `pending` управляет собственным пропсом `loading` кнопки.

### Запрос необязательного права доступа {#example-optional-scopes}

Используйте это, когда функции нужно разрешение, которое приложение не запрашивает при установке, например
для создания скидок.

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

- `query()` возвращает `granted`, `required` и `optional` права доступа. `request()` открывает
  модальное окно предоставления разрешения и возвращает `result` (`'granted-all'` или `'declined-all'`)
  и обновлённый `detail`
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Запрашиваемые права должны быть объявлены необязательными в конфигурации приложения. Обязательные
  права отозвать нельзя (`Scopes`).

### Создание или редактирование ресурса в админке {#example-intents}

Используйте это, чтобы продавец создавал или редактировал ресурс Shopify в собственных экранах админки,
без создания такой формы в вашем приложении.

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

- `invoke()` принимает `action:type` и параметры, такие как `value` (GID для редактирования) и `data`.
  Для скидки нужен `data.type`. Он возвращает activity, чей промис `complete` выдаёт
  ответ: `code` равен `'ok'`, если продавец завершил, `'closed'`, если он закрыл
  процесс, и `'error'` с `message` при сбое
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Чтобы отредактировать товар, Shopify советует сначала проверить `hasOnlyDefaultVariant` и использовать
  `shopify/ProductVariant`, если у товара есть варианты (там же).

### Запрос отзыва после успеха {#example-review-request}

Используйте это в конце успешно завершённого процесса, например после отправки первой кампании.

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

- Shopify: «Лучше запрашивать отзыв в конце успешного процесса, чем когда продавец впервые открывает приложение». Не вызывайте это из кнопки «Review us»: ограничения по частоте могут
  не дать показать модальное окно, и кнопка будет казаться сломанной
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- Модальное окно показывается не чаще одного раза в 60 дней и трёх раз в 365 дней и никогда не показывается в мобильной версии,
  в течение 24 часов после установки или после того, как продавец оставил отзыв о приложении. `code` указывает
  причину, например `'cooldown-period'` (там же).

### Обработка кнопки поддержки {#example-support-handler}

Используйте это, чтобы открывать вашу страницу помощи, когда продавец нажимает кнопку поддержки в верхней части
приложения.

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

- Зарегистрируйте обработчик один раз, например в `App.vue`. `null` снимает регистрацию
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- Приложению нужно расширение Support link, указывающее на страницу в вашем приложении. «Без этого расширения колбэк поддержки игнорируется» (там же).

### Адаптация под Shopify Mobile {#example-environment}

Используйте это, чтобы менять разметку, когда приложение работает в мобильном приложении Shopify, и держать
плавающую кнопку над нижним интерфейсом хоста.

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

- У `shopify.environment` есть `mobile`, `embedded`, `pos` и `intent`, все они синхронные
  булевы значения
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge задаёт `--shopify-safe-area-inset-bottom` равным высоте интерфейса хоста над
  нижней частью приложения. Фиксированные элементы автоматически не сдвигаются, поэтому добавьте переменную в их
  отступ `bottom`, как в примере Shopify (там же).

### Сканирование штрихкода {#example-scanner}

Используйте это в процессе учёта или приёмки товара на телефоне или в Shopify POS: отсканируйте штрихкод и найдите
вариант.

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

- `scanner.capture()` открывает камеру устройства и возвращает `ScannerPayload` со
  штрихкодом в `data`. Пример Shopify так же ищет штрихкод через GraphQL Admin API
  и обрабатывает отменённое сканирование в `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` требует Direct API access; см.
  [Обращение к бэкенду](/ru/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Показ кнопки только на мобильных устройствах и в POS — выбор этого примера: Scanner API использует
  камеру устройства, и Shopify описывает его для POS.

### Вопрос Sidekick о ваших данных {#example-sidekick}

Используйте это, чтобы продавец мог попросить Sidekick объяснить то, что показывает ваше приложение, например отчёт.

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

- Проверьте `isEnabled()` перед показом точки входа и вызывайте `launch` из действия
  продавца, а не при загрузке или по таймеру
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Другие ошибки могут возникнуть после того, как Shopify отправил запрос, поэтому «не повторяйте эти запросы автоматически» (там же).
- App Bridge отправляет `shopify:sidekick:visibilitychange` в `window`, когда панель открывается
  или закрывается, но не в мобильном приложении Shopify (там же).

### Проверка, включено ли встраивание theme app embed {#example-app-extensions}

Используйте это на странице настройки, чтобы сообщить продавцу, что ваш theme app embed ещё не активен.

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

- `app.extensions()` перечисляет расширения приложения. Для theme app extension каждая активация
  — это блок или embed с `handle` и `status` со значением `'active'`, `'available'` или
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Данные об активации берутся только из опубликованной темы магазина (там же).

### Отправка Web Vitals в ваш мониторинг {#example-web-vitals}

Используйте это, чтобы отслеживать реальную производительность приложения в вашем сервисе мониторинга.

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

- `onReport` регистрирует колбэк, который получает `metrics`, такие как LCP, CLS и INP, каждая
  с `name`, `value` и `id`; `null` снимает регистрацию. Пример Shopify также отправляет их
  через `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Члены верхнего уровня `ShopifyGlobal` в `@shopify/app-bridge-types`. Описания взяты из JSDoc в типах; если у члена его нет — из краткого описания на связанной странице shopify.dev.

| Член | Тип | Описание |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | Конфигурация приложения: `apiKey` (client ID приложения, передаётся тегом `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` и `shop`. |
| `origin` | `string` | В типах не описан. |
| `ready` | `Promise<void>` | В типах не описан. |
| `setSignals` | `(RealSignal: any) => void` | Регистрирует реализацию signals, например из `@preact/signals`, чтобы реактивные значения, возвращаемые App Bridge, использовали собственный класс Signal приложения вместо встроенной заглушки. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` и `intent`: работает ли приложение в мобильном приложении Shopify, встроено ли в админку Shopify, работает ли в Shopify POS или как intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Показывает индикаторы загрузки во время длительных операций. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Создаёт ID-токены для аутентификации между серверами и запросов к API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Сведения о вошедшем продавце, включая его имя, email и язык. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` показывает toast-уведомление в админке Shopify и возвращает его ID; `hide(id)` скрывает его. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Позволяет продавцам искать и выбирать ресурсы Shopify, такие как товары, коллекции или варианты. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` открывает камеру устройства для сканирования штрихкода и возвращает `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` и `toggle(id)` показывают, скрывают или переключают модальное окно по его ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` и `toggle(id)` показывают, скрывают или переключают панель сохранения по её ID; `leaveConfirmation()` просит продавца подтвердить уход со страницы при наличии несохранённых изменений. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` и `location`: чтение и изменение текущей корзины POS, закрытие приложения с возвратом на экран POS и получение сведений об устройстве и точке продаж POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (текущий запрос intent, `null` вне процесса intent), `invoke()` для вызова intent, `response` для ответа на него и `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` регистрирует колбэк, получающий данные о производительности Web Vitals; `null` снимает регистрацию. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` регистрирует функцию, которая выполняется, когда продавец нажимает кнопку поддержки; `null` снимает регистрацию. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` запрашивает модальное окно отзыва о приложении, которое показывается только при соблюдении ограничений по частоте и условий допуска. Результат содержит `success`, `code` и `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` возвращает выданные, обязательные и необязательные права доступа приложения в магазине; `request(scopes)` просит продавца выдать необязательные права; `revoke(scopes)` отзывает выданные необязательные права. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Показывает интерфейсы выбора файлов, дат и других распространённых типов данных. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` возвращает расширения приложения с информацией об их статусе. |
| `shopifyQL` | `ShopifyQLApi` | `available()` и `ready()`. В типах больше не описан. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Запускает диалоги Sidekick для продавца из вашего приложения. Он определён всегда, но его методы отклоняются, если Sidekick недоступен приложению; это проверяет `isEnabled()`. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` и `clear` привязывают функции-обработчики для инструментов, уже объявленных в конфигурации расширения приложения, которые платформа может вызывать от имени приложения. |
