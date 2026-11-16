---
title: "useAppBridge() – Shopify App Bridge für Vue 3"
description: "useAppBridge() für Vue 3 gibt das globale shopify von Shopify App Bridge zurück, typisiert als ShopifyGlobal, wie in @shopify/app-bridge-react. Für eingebettete Shopify-Apps."
---

# useAppBridge() {#use-app-bridge}

Das globale Objekt `shopify` wird vom App-Bridge-Skript definiert. Shopifys [useAppBridge-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) beschreibt es als den Weg, App-Bridge-APIs wie `toast` und `resourcePicker` zu verwenden.

`useAppBridge()` gibt das globale Objekt `shopify` zurück, typisiert als `ShopifyGlobal`:

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

Wie in `@shopify/app-bridge-react`:

- Auf dem Server gibt es ein Objekt zurück, das beim Lesen jeder Eigenschaft einen Fehler wirft. Rufen Sie die
  APIs aus `onMounted()` oder einem Event-Handler auf.
- Im Browser wirft es einen Fehler, wenn `shopify` nicht definiert ist, was "likely means the App
  Bridge script tag was not added correctly to this page".

Das globale `shopify` direkt zu verwenden, wie es die Anleitung zu eingebetteten Apps tut, funktioniert ebenfalls.

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.
Jedes ruft `useAppBridge()` innerhalb von `onMounted()` oder eines Event-Handlers auf und funktioniert daher auch
mit Server-Side-Rendering.

### Produkte mit dem Resource Picker wählen {#example-resource-picker}

Verwenden Sie dies, wenn der Händler Produkte aus dem Shop auswählt, hier für ein Bundle, das er
später erneut bearbeiten kann.

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

- Der Picker gibt `undefined` zurück, wenn der Händler abbricht, "anstatt eines leeren Arrays",
  prüfen Sie dies daher ausdrücklich
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` wählt Produkte und jeweils deren Varianten für Bearbeitungsabläufe vor.
  `multiple: 5` begrenzt die Auswahl; mit `type: 'product'` kann der Händler weiterhin
  mehrere Varianten eines Produkts wählen. `filter.draft` und `filter.archived` auf `false` blenden
  Entwürfe und archivierte Produkte aus (`ResourcePickerOptions`).
- `action: 'select'` legt das Verb im Titel fest: "add" (hinzufügen) zum Anhängen an eine Liste, "select" (auswählen) zum
  Auswählen für einen Zweck oder zum Ersetzen einer Auswahl.

### Eigene Datensätze Ihrer App wählen {#example-picker}

Verwenden Sie dies, wenn der Händler Datensätze wählt, die in Ihrer App liegen, etwa E-Mail-Vorlagen.
Für Produkte, Varianten und Kollektionen verweist Shopify stattdessen auf den Resource Picker.

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

- `shopify.picker()` liefert einen Picker, dessen Promise `selected` mit den gewählten
  `id`s aufgelöst wird oder mit `undefined`, wenn der Händler abbricht. Die Werte in `data` folgen der Reihenfolge von
  `headers`, und `type: 'number'` richtet eine Spalte rechtsbündig aus
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` wählt die aktuelle Auswahl vor, die der Händler weiterhin ändern kann.

### Toasts für Erfolg, Fehler und Rückgängig {#example-toast}

Verwenden Sie dies, um eine Aktion zu bestätigen, ohne den Händler zu unterbrechen, und um ein Rückgängig anzubieten.

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

- `ToastOptions` hat `duration` (Millisekunden, Standard 5000), `isError`, `action`,
  `onAction` und `onDismiss`. `show()` gibt die ID des Toasts für `hide(id)` zurück
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Zu Shopifys Einsatzzwecken gehören "Aktions-Buttons in Toasts für schnelle Folgeaktionen wie das
  Rückgängigmachen von Änderungen" und nicht blockierende Fehlermeldungen (gleiche Seite).
- Die längere `duration` gibt dem Händler Zeit zum Rückgängigmachen. Ein Aufruf von `hide()` ist sonst
  nicht nötig: Der Toast verschwindet nach seiner Dauer von selbst.

### Ladeanzeige um eine Anfrage {#example-loading}

Verwenden Sie dies, während Ihre App auf Daten wartet, damit der Adminbereich zeigt, dass etwas passiert.

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

- `shopify.loading(true)` zeigt die Ladeanzeige im Header des Adminbereichs, und
  `shopify.loading(false)` blendet sie aus
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` stellt sicher, dass sie wieder ausgeschaltet wird.

### Ladeanzeige bei Routenwechseln {#example-loading-route-change}

Verwenden Sie dies mit Vue Router, damit lazy geladene Seiten die Ladeanzeige des Adminbereichs zeigen.

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

- Rufen Sie `showLoadingDuringNavigation(router)` einmal dort auf, wo Sie den Router erstellen. Shopify nennt
  "Seitenübergänge oder Routenwechsel" als Einsatzzweck der Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` läuft auch bei abgebrochenen Navigationen, und `onError` deckt eine Seite ab, die nicht
  geladen werden kann.

### Anfragen an Ihr Backend {#example-authenticated-fetch}

Verwenden Sie dies, um Daten von Ihrem eigenen Server mit der Sitzung des Händlers zu laden.

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

- Der Fetch-Interceptor von App Bridge "fügt das ID-Token bei Anfragen an die Domain Ihrer App automatisch in den
  Header `Authorization` ein". Rufen Sie `shopify.idToken()` nur dort selbst auf, wo der Interceptor nicht greift,
  etwa bei einem WebSocket, was Shopifys eigenes Beispiel ist
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Senden Sie ID-Tokens nur an Ihr eigenes Backend und verifizieren Sie sie dort (gleiche Seite). Siehe auch
  [Mit dem Backend kommunizieren](/de/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Shop und Sprache aus der Konfiguration {#example-config}

Verwenden Sie dies, um Zahlen in der Admin-Sprache des Händlers zu formatieren oder anzuzeigen, in welchem Shop die App
läuft.

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

- `config` ist synchron: "Alle Eigenschaften sind synchron und sofort verfügbar,
  ohne auf ein Promise zu warten"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` ist die Sprache, die der Händler für den Adminbereich gewählt hat, "nicht die Sprache des Shops für
  Kunden". `shop` ist die permanente `.myshopify.com`-Domain, "nicht eine eigene
  Domain" (`AppBridgeConfig`).

### Ein Composable auf App-Ebene {#example-admin-action}

Verwenden Sie dies, um jedem Button dieselbe Ladeanzeige und dieselben Toasts zu geben, ohne sie zu wiederholen.

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

- Das Composable kombiniert die [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  und die [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  wie in den Beispielen oben. `pending` steuert die eigene Prop `loading` des Buttons.

### Einen optionalen Zugriffsbereich anfordern {#example-optional-scopes}

Verwenden Sie dies, wenn eine Funktion eine Berechtigung braucht, die die App bei der Installation nicht anfordert, etwa
zum Erstellen von Rabatten.

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

- `query()` gibt die Scopes `granted`, `required` und `optional` zurück. `request()` öffnet ein Modal zur
  Berechtigungserteilung und liefert `result` (`'granted-all'` oder `'declined-all'`)
  sowie das aktualisierte `detail`
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Die angeforderten Scopes müssen in Ihrer App-Konfiguration als optional deklariert sein. Erforderliche
  Scopes können nicht widerrufen werden (`Scopes`).

### Eine Ressource im Adminbereich erstellen oder bearbeiten {#example-intents}

Verwenden Sie dies, damit der Händler eine Shopify-Ressource in den eigenen Oberflächen des Adminbereichs erstellen oder bearbeiten kann,
ohne dieses Formular in Ihrer App zu bauen.

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

- `invoke()` nimmt `action:type` und Optionen wie `value` (die GID der zu bearbeitenden Ressource) und `data` entgegen.
  Ein Rabatt braucht `data.type`. Es liefert eine Aktivität, deren Promise `complete` die Antwort gibt:
  `code` ist `'ok'`, wenn der Händler fertig ist, `'closed'`, wenn er den Ablauf geschlossen hat,
  und `'error'` mit einer `message` bei einem Fehler
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Zum Bearbeiten eines Produkts empfiehlt Shopify, zuerst `hasOnlyDefaultVariant` zu prüfen und
  `shopify/ProductVariant` zu verwenden, wenn das Produkt Varianten hat (gleiche Seite).

### Nach einem Erfolg um eine Bewertung bitten {#example-review-request}

Verwenden Sie dies am Ende eines Ablaufs, der gut verlaufen ist, etwa nach der ersten versendeten Kampagne.

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

- Shopify: "Es ist besser, am Ende eines erfolgreichen Ablaufs um eine Bewertung zu bitten, als wenn ein
  Händler Ihre App zum ersten Mal öffnet". Rufen Sie es nicht aus einem Button "Bewerten Sie uns" auf: Ratenbegrenzungen können das
  Modal verhindern, und der Button würde defekt wirken
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- Das Modal erscheint höchstens einmal in 60 Tagen und dreimal in 365 Tagen, und nie auf Mobilgeräten,
  innerhalb von 24 Stunden nach der Installation oder nachdem der Händler die App bewertet hat. `code` nennt den
  Grund, etwa `'cooldown-period'` (gleiche Seite).

### Den Support-Button behandeln {#example-support-handler}

Verwenden Sie dies, um Ihre eigene Hilfeseite zu öffnen, wenn der Händler auf den Support-Button am oberen Rand
der App klickt.

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

- Registrieren Sie den Handler einmal, zum Beispiel in `App.vue`. `null` hebt die Registrierung auf
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- Die App braucht eine Support-Link-Extension, die auf eine Seite in Ihrer App zeigt. "Ohne diese
  Extension wird der Support-Callback ignoriert" (gleiche Seite).

### An Shopify Mobile anpassen {#example-environment}

Verwenden Sie dies, um das Layout zu ändern, wenn die App in der Shopify-Mobile-App läuft, und um einen
schwebenden Button über der unteren Oberfläche des Hosts zu halten.

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

- `shopify.environment` hat `mobile`, `embedded`, `pos` und `intent`, alles synchrone
  Booleans
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge setzt `--shopify-safe-area-inset-bottom` auf die Höhe der Host-Oberfläche über dem
  unteren Rand Ihrer App. Fixierte Elemente werden nicht für Sie verschoben, fügen Sie die Variable daher ihrem
  Abstand `bottom` hinzu, wie es Shopifys Beispiel tut (gleiche Seite).

### Einen Barcode scannen {#example-scanner}

Verwenden Sie dies in einem Lager- oder Wareneingangs-Ablauf auf einem Smartphone oder Shopify POS: einen Barcode scannen und die
Variante finden.

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

- `scanner.capture()` öffnet die Gerätekamera und liefert einen `ScannerPayload` mit dem
  Barcode in `data`. Shopifys Beispiel schlägt den Barcode auf dieselbe Weise mit der GraphQL Admin API nach
  und behandelt einen abgebrochenen Scan in `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` braucht Direct API Access; siehe
  [Mit dem Backend kommunizieren](/de/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Den Button nur auf Mobilgeräten und in POS anzuzeigen, ist eine Entscheidung dieses Beispiels: Die Scanner API nutzt
  die Gerätekamera, und Shopify beschreibt sie für POS.

### Sidekick zu Ihren Daten fragen {#example-sidekick}

Verwenden Sie dies, damit der Händler Sidekick bitten kann, zu erklären, was Ihre App anzeigt, etwa einen Bericht.

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

- Prüfen Sie `isEnabled()`, bevor Sie den Einstiegspunkt anzeigen, und rufen Sie `launch` aus einer
  Aktion des Händlers auf, nicht beim Laden oder per Timer
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Andere Fehler können auftreten, nachdem Shopify den Prompt gesendet hat, daher: "Wiederholen Sie diese Fehler nicht
  automatisch" (gleiche Seite).
- App Bridge löst `shopify:sidekick:visibilitychange` auf `window` aus, wenn das Panel geöffnet
  oder geschlossen wird, aber nicht in der Shopify-Mobile-App (gleiche Seite).

### Prüfen, ob ein Theme-App-Embed aktiv ist {#example-app-extensions}

Verwenden Sie dies auf einer Einrichtungsseite, um dem Händler zu sagen, wenn Ihr Theme-App-Embed noch nicht aktiv ist.

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

- `app.extensions()` listet die Extensions der App auf. Bei einer Theme-App-Extension ist jede Aktivierung
  ein Block oder Embed mit einem `handle` und einem `status` von `'active'`, `'available'` oder
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Die Aktivierungsdaten stammen nur aus dem veröffentlichten Theme des Shops (gleiche Seite).

### Web Vitals an Ihr Monitoring senden {#example-web-vitals}

Verwenden Sie dies, um die reale Performance Ihrer App in Ihrem eigenen Monitoring-Dienst zu verfolgen.

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

- `onReport` registriert einen Callback, der `metrics` wie LCP, CLS und INP erhält, jeweils
  mit `name`, `value` und `id`; `null` hebt die Registrierung auf. Shopifys Beispiel sendet sie außerdem
  mit `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Die Mitglieder der obersten Ebene von `ShopifyGlobal` in `@shopify/app-bridge-types`. Die Beschreibungen stammen aus dem JSDoc der Typen; wo ein Mitglied keines hat, aus der Zusammenfassung auf der verlinkten shopify.dev-Seite.

| Mitglied | Typ | Beschreibung |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | Die Konfiguration der App: `apiKey` (die Client-ID der App, angegeben mit einem `<meta name="shopify-api-key">`-Tag), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` und `shop`. |
| `origin` | `string` | In den Typen nicht beschrieben. |
| `ready` | `Promise<void>` | In den Typen nicht beschrieben. |
| `setSignals` | `(RealSignal: any) => void` | Registriert eine Signals-Implementierung, zum Beispiel aus `@preact/signals`, damit reaktive Werte, die App Bridge zurückgibt, die eigene Signal-Klasse der App statt des eingebauten Shims verwenden. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` und `intent`: ob die App in der Shopify-Mobile-App läuft, im Shopify-Adminbereich eingebettet ist, in Shopify POS läuft oder als Intent läuft. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Zeigt Ladeindikatoren während lang laufender Vorgänge an. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Erzeugt ID-Tokens für die Server-zu-Server-Authentifizierung und API-Anfragen. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Informationen über den angemeldeten Händler, darunter Name, E-Mail-Adresse und Locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` zeigt eine Toast-Benachrichtigung im Shopify-Adminbereich an und gibt ihre ID zurück; `hide(id)` blendet sie aus. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Lässt Händler Shopify-Ressourcen wie Produkte, Kollektionen oder Varianten suchen und auswählen. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` öffnet die Kamera des Geräts, um einen Barcode zu scannen, und wird mit einem `ScannerPayload` aufgelöst. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` und `toggle(id)` zeigen, verbergen oder wechseln ein Modal anhand seiner ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` und `toggle(id)` zeigen, verbergen oder wechseln eine Speicherleiste anhand ihrer ID; `leaveConfirmation()` bittet den Händler bei ungespeicherten Änderungen um Bestätigung, bevor er die Seite verlässt. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` und `location`: den aktuellen POS-Warenkorb lesen und ändern, die App schließen und zum POS-Bildschirm zurückkehren sowie Informationen über das POS-Gerät und den Standort abrufen. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (die aktuelle Intent-Anfrage, `null` außerhalb eines Intent-Ablaufs), `invoke()` zum Aufrufen eines Intents, `response` zum Abschließen eines Intents und `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registriert einen Callback, der Web-Vitals-Leistungsdaten erhält; `null` hebt die Registrierung auf. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registriert eine Funktion, die ausgeführt wird, wenn der Händler auf die Support-Schaltfläche klickt; `null` hebt die Registrierung auf. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` fordert ein Modal zur App-Bewertung an, das nur angezeigt wird, wenn Ratenlimits und Teilnahmebedingungen erfüllt sind. Das Ergebnis hat `success`, `code` und `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` gibt die gewährten, erforderlichen und optionalen Zugriffsbereiche der App im Shop zurück; `request(scopes)` bittet den Händler, optionale Bereiche zu gewähren; `revoke(scopes)` widerruft gewährte optionale Bereiche. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Zeigt Auswahloberflächen für Dateien, Daten und andere gängige Datentypen an. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` wird mit den Erweiterungen der App und ihren Statusinformationen aufgelöst. |
| `shopifyQL` | `ShopifyQLApi` | `available()` und `ready()`. Sonst in den Typen nicht beschrieben. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Startet Sidekick-Unterhaltungen für den Händler aus Ihrer App. Es ist immer definiert, aber seine Methoden werden abgelehnt (reject), wenn Sidekick für die App nicht verfügbar ist; `isEnabled()` prüft das. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` und `clear` binden Handler-Funktionen an Tools, die bereits in der Konfiguration der App-Erweiterung deklariert sind und die die Plattform im Namen der App aufrufen kann. |
