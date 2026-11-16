---
title: "useAppBridge() – Shopify App Bridge para Vue 3"
description: "useAppBridge() para Vue 3 devuelve el global shopify de Shopify App Bridge, tipado como ShopifyGlobal, como en @shopify/app-bridge-react. Para apps integradas de Shopify."
---

# useAppBridge() {#use-app-bridge}

El global `shopify` lo define el script de App Bridge. La [referencia de useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) de Shopify lo describe como la forma de usar las API de App Bridge como `toast` y `resourcePicker`.

`useAppBridge()` devuelve el global `shopify`, tipado como `ShopifyGlobal`:

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

Igual que en `@shopify/app-bridge-react`:

- En el servidor devuelve un objeto que lanza un error al leer cualquier propiedad. Llama a las
  API desde `onMounted()` o desde un manejador de eventos.
- En el navegador lanza un error si `shopify` no está definido, lo que "likely means the App
  Bridge script tag was not added correctly to this page".

También funciona usar directamente el global `shopify`, como hace la guía de apps integradas.

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.
Cada uno llama a `useAppBridge()` dentro de `onMounted()` o de un manejador de eventos, así que también funciona
con renderizado en el servidor.

### Elegir productos con el selector de recursos {#example-resource-picker}

Úsalo cuando el comerciante elige productos de la tienda, aquí para un paquete que puede
editar de nuevo más tarde.

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
- El selector devuelve `undefined` cuando el comerciante cancela, "en lugar de un array vacío",
  así que compruébalo de forma explícita
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` preselecciona productos, y las variantes de cada uno, para flujos de edición.
  `multiple: 5` limita la selección; con `type: 'product'` el comerciante aún puede elegir
  varias variantes de un mismo producto. `filter.draft` y `filter.archived` en `false` ocultan
  los productos en borrador y archivados (`ResourcePickerOptions`).
- `action: 'select'` define el verbo del título: "add" para añadir a una lista, "select" para
  elegir con un propósito o reemplazar una selección.

### Elegir los registros propios de tu app {#example-picker}

Úsalo cuando el comerciante elige registros que viven en tu app, como plantillas de correo.
Para productos, variantes y colecciones, Shopify remite al selector de recursos.

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
- `shopify.picker()` se resuelve en un selector cuya promesa `selected` se resuelve con los `id`
  elegidos, o con `undefined` cuando el comerciante cancela. Los valores de `data` siguen el orden de
  `headers`, y `type: 'number'` alinea una columna a la derecha
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` preselecciona la opción actual, que el comerciante aún puede cambiar.

### Toasts de éxito, error y deshacer {#example-toast}

Úsalo para confirmar una acción sin interrumpir al comerciante, y para ofrecer deshacerla.

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
- `ToastOptions` tiene `duration` (milisegundos, por defecto 5000), `isError`, `action`,
  `onAction` y `onDismiss`. `show()` devuelve el ID del toast para `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Los casos de uso de Shopify incluyen "botones de acción en los toasts para acciones de seguimiento rápidas, como
  deshacer cambios" y mensajes de error que no bloquean (misma página).
- Una `duration` más larga da tiempo al comerciante para deshacer. No hace falta llamar a `hide()`
  en otro caso: el toast se oculta tras su duración.

### Indicador de carga alrededor de una solicitud {#example-loading}

Úsalo mientras tu app espera datos, para que el admin muestre que algo está pasando.

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
- `shopify.loading(true)` muestra el indicador de carga en el encabezado del admin, y
  `shopify.loading(false)` lo oculta
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` garantiza que se desactive.

### Indicador de carga durante los cambios de ruta {#example-loading-route-change}

Úsalo con Vue Router, para que las páginas con carga diferida muestren el indicador de carga del admin.

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
- Llama a `showLoadingDuringNavigation(router)` una sola vez donde creas el router. Shopify lista
  "transiciones de página o cambios de ruta" como un uso de la Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` también se ejecuta en navegaciones canceladas, y `onError` cubre una página que no se
  puede cargar.

### Solicitudes a tu backend {#example-authenticated-fetch}

Úsalo para cargar datos de tu propio servidor, con la sesión del comerciante.

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
- El interceptor de fetch de App Bridge "incluye automáticamente el ID token en el
  encabezado `Authorization` de las solicitudes al dominio de tu app". Llama tú mismo a `shopify.idToken()`
  solo donde el interceptor no se aplica, como un WebSocket, que es el
  ejemplo del propio Shopify
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Envía los ID tokens solo a tu propio backend y verifícalos allí (misma página). Consulta también
  [Comunicarse con tu backend](/es/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Tienda e idioma desde la configuración {#example-config}

Úsalo para formatear números en el idioma del admin del comerciante o para mostrar en qué tienda
está la app.

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
- `config` es síncrono: "Todas las propiedades son síncronas y están disponibles de inmediato
  sin esperar una Promise"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` es el idioma que el comerciante eligió para el admin, "no el idioma de la tienda
  orientado al cliente". `shop` es el dominio permanente `.myshopify.com`, "no un dominio
  personalizado" (`AppBridgeConfig`).

### Un composable a nivel de app {#example-admin-action}

Úsalo para dar a cada botón el mismo indicador de carga y los mismos toasts sin repetirlos.

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

- El composable combina la [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  y la [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  como en los ejemplos anteriores. `pending` controla la prop `loading` del propio botón.

### Pedir un scope de acceso opcional {#example-optional-scopes}

Úsalo cuando una función necesita un permiso que la app no pide al instalarse, como
crear descuentos.

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
- `query()` devuelve los scopes `granted`, `required` y `optional`. `request()` abre un modal de
  concesión de permisos y se resuelve con `result` (`'granted-all'` o `'declined-all'`)
  y el `detail` actualizado
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Los scopes que pidas deben declararse como opcionales en la configuración de tu app. Los scopes
  obligatorios no se pueden revocar (`Scopes`).

### Crear o editar un recurso en el admin {#example-intents}

Úsalo para que el comerciante cree o edite un recurso de Shopify en las pantallas del propio admin,
sin construir ese formulario en tu app.

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
- `invoke()` recibe `action:type` y opciones como `value` (el GID que se edita) y `data`.
  Un descuento necesita `data.type`. Se resuelve en una actividad cuya promesa `complete` da
  la respuesta: `code` es `'ok'` cuando el comerciante terminó, `'closed'` cuando cerró
  el flujo y `'error'` con un `message` si falla
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Para editar un producto, Shopify sugiere comprobar primero `hasOnlyDefaultVariant` y usar
  `shopify/ProductVariant` cuando el producto tiene variantes (misma página).

### Pedir una reseña tras un éxito {#example-review-request}

Úsalo al final de un flujo que salió bien, como la primera campaña enviada.

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
- Shopify: "Es mejor pedir una reseña al final de un flujo exitoso que cuando un
  comerciante abre tu app por primera vez". No lo llames desde un botón "Review us": los límites de frecuencia pueden
  impedir que aparezca el modal, y el botón parecería roto
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- El modal se muestra como máximo una vez cada 60 días y tres veces cada 365 días, y nunca en móvil,
  en las 24 horas posteriores a la instalación ni después de que el comerciante haya reseñado la app. `code` da la
  razón, como `'cooldown-period'` (misma página).

### Gestionar el botón de soporte {#example-support-handler}

Úsalo para abrir tu propia página de ayuda cuando el comerciante hace clic en el botón de soporte de la parte superior
de la app.

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
- Registra el manejador una sola vez, por ejemplo en `App.vue`. `null` lo anula
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- La app necesita una extensión de enlace de soporte que apunte a una página de tu app. "Sin esta
  extensión, el callback de soporte se ignora" (misma página).

### Adaptarse a Shopify Mobile {#example-environment}

Úsalo para cambiar el diseño cuando la app se ejecuta en la app Shopify Mobile, y para mantener un
botón flotante por encima de la interfaz inferior del host.

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
- `shopify.environment` tiene `mobile`, `embedded`, `pos` e `intent`, todos booleanos
  síncronos
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge establece `--shopify-safe-area-inset-bottom` con la altura de la interfaz del host sobre la
  parte inferior de tu app. Los elementos fijos no se mueven por ti, así que añade la variable a su
  desplazamiento `bottom`, como hace el ejemplo de Shopify (misma página).

### Escanear un código de barras {#example-scanner}

Úsalo en un flujo de inventario o recepción en un teléfono o en Shopify POS: escanea un código de barras y encuentra
la variante.

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
- `scanner.capture()` abre la cámara del dispositivo y se resuelve con un `ScannerPayload` con el
  código de barras en `data`. El ejemplo de Shopify busca el código de barras con la GraphQL Admin API del
  mismo modo, y gestiona un escaneo cancelado en `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` necesita acceso directo a la API; consulta
  [Comunicarse con tu backend](/es/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Mostrar el botón solo en móvil y POS es una decisión de este ejemplo: la Scanner API usa
  la cámara del dispositivo, y Shopify la describe para POS.

### Preguntar a Sidekick sobre tus datos {#example-sidekick}

Úsalo para que el comerciante pida a Sidekick que explique lo que muestra tu app, como un informe.

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
- Comprueba `isEnabled()` antes de mostrar el punto de entrada, y llama a `launch` desde una acción del
  comerciante, no al cargar ni con un temporizador
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Otros errores pueden llegar después de que Shopify haya enviado el prompt, así que "no reintentes esos errores
  automáticamente" (misma página).
- App Bridge despacha `shopify:sidekick:visibilitychange` en `window` cuando el panel se abre
  o se cierra, pero no en la app Shopify Mobile (misma página).

### Comprobar que un theme app embed está activado {#example-app-extensions}

Úsalo en una página de configuración, para avisar al comerciante cuando tu theme app embed aún no está activo.

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
- `app.extensions()` lista las extensiones de la app. En una theme app extension, cada activación
  es un bloque o embed con un `handle` y un `status` de `'active'`, `'available'` o
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Los datos de activación provienen solo del tema publicado de la tienda (misma página).

### Enviar Web Vitals a tu monitorización {#example-web-vitals}

Úsalo para medir el rendimiento real de tu app en tu propio servicio de monitorización.

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
- `onReport` registra un callback que recibe `metrics` como LCP, CLS e INP, cada una
  con `name`, `value` e `id`; `null` lo anula. El ejemplo de Shopify también las envía
  con `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Los miembros de nivel superior de `ShopifyGlobal` en `@shopify/app-bridge-types`. Las descripciones vienen del JSDoc de los tipos; cuando un miembro no tiene, del resumen de la página de shopify.dev enlazada.

| Miembro | Tipo | Descripción |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | La configuración de la app: `apiKey` (el client ID de la app, proporcionado con una etiqueta `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` y `shop`. |
| `origin` | `string` | No se describe en los tipos. |
| `ready` | `Promise<void>` | No se describe en los tipos. |
| `setSignals` | `(RealSignal: any) => void` | Registra una implementación de signals, por ejemplo de `@preact/signals`, para que los valores reactivos que devuelve App Bridge usen la clase Signal de la propia app en lugar del shim integrado. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` e `intent`: si la app se ejecuta en la app Shopify Mobile, está incrustada en el admin de Shopify, se ejecuta en Shopify POS o se ejecuta como intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Muestra indicadores de carga durante operaciones largas. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Genera tokens de ID para la autenticación de servidor a servidor y las solicitudes a la API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Información sobre el comerciante que ha iniciado sesión, incluidos su nombre, correo electrónico y locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` muestra una notificación toast en el admin de Shopify y devuelve su ID; `hide(id)` la oculta. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permite a los comerciantes buscar y seleccionar recursos de Shopify como productos, colecciones o variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` abre la cámara del dispositivo para escanear un código de barras y se resuelve en un `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` y `toggle(id)` muestran, ocultan o alternan un modal por su ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` y `toggle(id)` muestran, ocultan o alternan una barra de guardado por su ID; `leaveConfirmation()` pide al comerciante que confirme antes de salir de la página cuando hay cambios sin guardar. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` y `location`: leer y cambiar el carrito POS actual, cerrar la app y volver a la pantalla de POS, y obtener información sobre el dispositivo y la ubicación de POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (la solicitud de intent actual, `null` fuera de un flujo de intent), `invoke()` para invocar un intent, `response` para resolverlo y `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registra un callback que recibe datos de rendimiento de Web Vitals; `null` lo da de baja. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registra una función que se ejecuta cuando el comerciante hace clic en el botón de soporte; `null` la da de baja. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` solicita un modal de reseña de la app, que solo se muestra si se cumplen los límites de frecuencia y las condiciones de elegibilidad. El resultado tiene `success`, `code` y `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` devuelve los scopes de acceso concedidos, obligatorios y opcionales de la app en la tienda; `request(scopes)` pide al comerciante que conceda scopes opcionales; `revoke(scopes)` revoca scopes opcionales concedidos. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Muestra interfaces de selección para archivos, fechas y otros tipos de datos comunes. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` se resuelve en las extensiones de la app, con su información de estado. |
| `shopifyQL` | `ShopifyQLApi` | `available()` y `ready()`. Por lo demás, no se describe en los tipos. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Inicia conversaciones de Sidekick para el comerciante desde tu app. Siempre está definido, pero sus métodos se rechazan cuando Sidekick no está disponible para la app; `isEnabled()` lo comprueba. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` y `clear` vinculan funciones manejadoras a herramientas ya declaradas en la configuración de la extensión de la app, que la plataforma puede llamar en nombre de la app. |
