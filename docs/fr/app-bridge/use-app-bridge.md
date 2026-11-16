---
title: "useAppBridge() – Shopify App Bridge pour Vue 3"
description: "useAppBridge() pour Vue 3 renvoie l'objet global shopify de Shopify App Bridge, typé ShopifyGlobal, comme dans @shopify/app-bridge-react. Pour les apps Shopify intégrées."
---

# useAppBridge() {#use-app-bridge}

Le global `shopify` est défini par le script App Bridge. La [référence useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) de Shopify le décrit comme le moyen d'utiliser les API App Bridge comme `toast` et `resourcePicker`.

`useAppBridge()` renvoie l'objet global `shopify`, typé `ShopifyGlobal` :

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

Comme dans `@shopify/app-bridge-react` :

- Côté serveur, il renvoie un objet qui lève une erreur dès que vous lisez une propriété. Appelez les
  API depuis `onMounted()` ou un gestionnaire d'événement.
- Dans le navigateur, il lève une erreur si `shopify` n'est pas défini, ce qui "likely means the App
  Bridge script tag was not added correctly to this page".

Utiliser directement l'objet global `shopify`, comme le fait le guide de l'app intégrée, fonctionne aussi.

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.
Chacun appelle `useAppBridge()` dans `onMounted()` ou dans un gestionnaire d'événement, donc il fonctionne aussi
avec le rendu côté serveur.

### Choisir des produits avec le sélecteur de ressources {#example-resource-picker}

Utilisez ceci lorsque le marchand choisit des produits de la boutique, ici pour un lot qu'il peut
modifier de nouveau plus tard.

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

- Le sélecteur renvoie `undefined` lorsque le marchand annule, "rather than an empty array",
  donc vérifiez-le explicitement
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` présélectionne des produits, et les variantes de chacun, pour les workflows de modification.
  `multiple: 5` plafonne la sélection ; avec `type: 'product'`, le marchand peut quand même choisir
  plusieurs variantes d'un même produit. `filter.draft` et `filter.archived` définis à `false` masquent
  les produits en brouillon et archivés (`ResourcePickerOptions`).
- `action: 'select'` définit le verbe dans le titre : "add" pour ajouter à une liste, "select" pour
  choisir dans un but précis ou remplacer une sélection.

### Choisir les enregistrements propres à votre app {#example-picker}

Utilisez ceci lorsque le marchand choisit des enregistrements qui se trouvent dans votre app, comme des modèles d'e-mail.
Pour les produits, variantes et collections, Shopify renvoie plutôt vers le sélecteur de ressources.

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

- `shopify.picker()` se résout en un sélecteur dont la promesse `selected` se résout avec les `id`
  choisis, ou avec `undefined` lorsque le marchand annule. Les valeurs de `data` suivent l'ordre de
  `headers`, et `type: 'number'` aligne une colonne à droite
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` présélectionne le choix actuel, que le marchand peut encore modifier.

### Toasts de succès, d'erreur et d'annulation {#example-toast}

Utilisez ceci pour confirmer une action sans interrompre le marchand, et pour proposer d'annuler.

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

- `ToastOptions` a `duration` (en millisecondes, 5000 par défaut), `isError`, `action`,
  `onAction` et `onDismiss`. `show()` renvoie l'ID du toast pour `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Les cas d'usage de Shopify incluent "action buttons in toasts for quick follow-up actions like
  undoing changes" et des messages d'erreur non bloquants (même page).
- Une `duration` plus longue laisse au marchand le temps d'annuler. Appeler `hide()` n'est pas obligatoire
  autrement : le toast se masque après sa durée.

### Indicateur de chargement autour d'une requête {#example-loading}

Utilisez ceci pendant que votre app attend des données, pour que l'admin montre qu'il se passe quelque chose.

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

- `shopify.loading(true)` affiche l'indicateur de chargement dans l'en-tête de l'admin, et
  `shopify.loading(false)` le masque
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` garantit qu'il est désactivé.

### Indicateur de chargement pendant les changements de route {#example-loading-route-change}

Utilisez ceci avec Vue Router, pour que les pages chargées en différé affichent l'indicateur de chargement de l'admin.

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

- Appelez `showLoadingDuringNavigation(router)` une seule fois là où vous créez le routeur. Shopify cite
  "page transitions or route changes" parmi les usages de la Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` s'exécute aussi pour les navigations annulées, et `onError` couvre une page qui ne
  se charge pas.

### Requêtes vers votre backend {#example-authenticated-fetch}

Utilisez ceci pour charger des données depuis votre propre serveur, avec la session du marchand.

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

- L'intercepteur de fetch d'App Bridge "automatically includes the ID token in the
  `Authorization` header for requests to your app's domain". N'appelez `shopify.idToken()`
  vous-même que là où l'intercepteur ne s'applique pas, comme un WebSocket, qui est
  l'exemple de Shopify
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- N'envoyez les jetons d'ID qu'à votre propre backend, et vérifiez-les là (même page). Voir aussi
  [Communiquer avec votre backend](/fr/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Boutique et langue depuis la config {#example-config}

Utilisez ceci pour formater des nombres dans la langue d'admin du marchand ou pour afficher dans quelle boutique
se trouve l'app.

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

- `config` est synchrone : "All properties are synchronous and available immediately
  without awaiting a Promise"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` est la langue que le marchand a choisie pour l'admin, "not the shop's
  customer-facing locale". `shop` est le domaine permanent `.myshopify.com`, "not a custom
  domain" (`AppBridgeConfig`).

### Un composable au niveau de l'app {#example-admin-action}

Utilisez ceci pour donner à chaque bouton le même indicateur de chargement et les mêmes toasts sans les répéter.

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

- Le composable combine la [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  et la [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  comme dans les exemples ci-dessus. `pending` pilote la prop `loading` propre au bouton.

### Demander un scope d'accès optionnel {#example-optional-scopes}

Utilisez ceci lorsqu'une fonctionnalité a besoin d'une permission que l'app ne demande pas à l'installation, comme
créer des remises.

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

- `query()` renvoie les scopes `granted`, `required` et `optional`. `request()` ouvre un
  modal d'octroi de permission et se résout avec `result` (`'granted-all'` ou `'declined-all'`)
  et le `detail` mis à jour
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Les scopes que vous demandez doivent être déclarés comme optionnels dans la configuration de votre app. Les scopes
  requis ne peuvent pas être révoqués (`Scopes`).

### Créer ou modifier une ressource dans l'admin {#example-intents}

Utilisez ceci pour laisser le marchand créer ou modifier une ressource Shopify dans les écrans propres de l'admin,
sans construire ce formulaire dans votre app.

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

- `invoke()` prend `action:type` et des options comme `value` (le GID à modifier) et `data`.
  Une remise a besoin de `data.type`. Il se résout en une activité dont la promesse `complete` donne
  la réponse : `code` vaut `'ok'` lorsque le marchand a terminé, `'closed'` lorsqu'il a fermé
  le workflow, et `'error'` avec un `message` en cas d'échec
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Pour modifier un produit, Shopify suggère de vérifier d'abord `hasOnlyDefaultVariant` et d'utiliser
  `shopify/ProductVariant` lorsque le produit a des variantes (même page).

### Demander un avis après une réussite {#example-review-request}

Utilisez ceci à la fin d'un workflow qui s'est bien passé, comme la première campagne envoyée.

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

- Shopify : "It's better to request a review at the end of a successful workflow than when a
  merchant first opens your app". Ne l'appelez pas depuis un bouton "Review us" : les limites de fréquence peuvent
  empêcher le modal, et le bouton semblerait cassé
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- Le modal s'affiche au plus une fois en 60 jours et trois fois en 365 jours, et jamais sur mobile,
  dans les 24 heures suivant l'installation, ni après que le marchand a évalué l'app. `code` donne la
  raison, comme `'cooldown-period'` (même page).

### Gérer le bouton d'assistance {#example-support-handler}

Utilisez ceci pour ouvrir votre propre page d'aide lorsque le marchand clique sur le bouton d'assistance en haut
de l'app.

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

- Enregistrez le gestionnaire une seule fois, par exemple dans `App.vue`. `null` le désenregistre
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- L'app a besoin d'une extension de lien d'assistance qui pointe vers une page de votre app. "Without this
  extension, the support callback is ignored" (même page).

### S'adapter à Shopify Mobile {#example-environment}

Utilisez ceci pour changer la mise en page lorsque l'app s'exécute dans l'app Shopify Mobile, et pour garder un
bouton flottant au-dessus de l'interface du bas de l'hôte.

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

- `shopify.environment` a `mobile`, `embedded`, `pos` et `intent`, tous des
  booléens synchrones
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- App Bridge définit `--shopify-safe-area-inset-bottom` à la hauteur de l'interface de l'hôte au-dessus du
  bas de votre app. Les éléments fixes ne sont pas déplacés pour vous, donc ajoutez la variable à leur décalage
  `bottom`, comme le fait l'exemple de Shopify (même page).

### Scanner un code-barres {#example-scanner}

Utilisez ceci dans un workflow de stock ou de réception sur un téléphone ou Shopify POS : scanner un code-barres et trouver
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

- `scanner.capture()` ouvre la caméra de l'appareil et se résout en un `ScannerPayload` avec le
  code-barres dans `data`. L'exemple de Shopify recherche le code-barres avec la GraphQL Admin API de
  la même manière, et gère un scan annulé dans `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` nécessite l'accès Direct API ; voir
  [Communiquer avec votre backend](/fr/guide/shopify-embedded-app#_4-talk-to-your-backend).
- N'afficher le bouton que sur mobile et POS est un choix de cet exemple : la Scanner API utilise
  la caméra de l'appareil, et Shopify la décrit pour POS.

### Demander à Sidekick à propos de vos données {#example-sidekick}

Utilisez ceci pour laisser le marchand demander à Sidekick d'expliquer ce que montre votre app, comme un rapport.

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

- Vérifiez `isEnabled()` avant d'afficher le point d'entrée, et appelez `launch` depuis une action
  du marchand, pas au chargement ni sur un minuteur
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- D'autres erreurs peuvent survenir après que Shopify a envoyé le prompt, donc "don't retry those errors
  automatically" (même page).
- App Bridge déclenche `shopify:sidekick:visibilitychange` sur `window` lorsque le panneau s'ouvre
  ou se ferme, mais pas dans l'app Shopify mobile (même page).

### Vérifier qu'un embed d'app de thème est activé {#example-app-extensions}

Utilisez ceci sur une page de configuration, pour indiquer au marchand quand votre embed d'app de thème n'est pas encore actif.

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

- `app.extensions()` liste les extensions de l'app. Pour une extension d'app de thème, chaque activation
  est un bloc ou un embed avec un `handle` et un `status` valant `'active'`, `'available'` ou
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Les données d'activation proviennent uniquement du thème publié de la boutique (même page).

### Envoyer les Web Vitals à votre monitoring {#example-web-vitals}

Utilisez ceci pour suivre les performances réelles de votre app dans votre propre service de monitoring.

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

- `onReport` enregistre un callback qui reçoit des `metrics` comme LCP, CLS et INP, chacune
  avec `name`, `value` et `id` ; `null` le désenregistre. L'exemple de Shopify les envoie aussi
  avec `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Les membres de premier niveau de `ShopifyGlobal` dans `@shopify/app-bridge-types`. Les descriptions viennent du JSDoc des types ; quand un membre n'en a pas, du résumé de la page shopify.dev liée.

| Membre | Type | Description |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | La configuration de l'app : `apiKey` (l'ID client de l'app, fourni avec une balise `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` et `shop`. |
| `origin` | `string` | Non décrit dans les types. |
| `ready` | `Promise<void>` | Non décrit dans les types. |
| `setSignals` | `(RealSignal: any) => void` | Enregistre une implémentation de signals, par exemple de `@preact/signals`, pour que les valeurs réactives renvoyées par App Bridge utilisent la classe Signal de l'app au lieu du shim intégré. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` et `intent` : si l'app s'exécute dans l'app Shopify Mobile, est intégrée à l'interface d'administration Shopify, s'exécute dans Shopify POS ou s'exécute comme intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Affiche des indicateurs de chargement pendant les opérations longues. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Génère des jetons d'ID pour l'authentification de serveur à serveur et les requêtes API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Des informations sur le marchand connecté, dont son nom, son e-mail et sa locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` affiche une notification toast dans l'interface d'administration Shopify et renvoie son ID ; `hide(id)` la masque. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permet aux marchands de rechercher et sélectionner des ressources Shopify comme des produits, des collections ou des variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` ouvre la caméra de l'appareil pour scanner un code-barres et se résout en un `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` et `toggle(id)` affichent, masquent ou basculent un modal par son ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` et `toggle(id)` affichent, masquent ou basculent une barre d'enregistrement par son ID ; `leaveConfirmation()` demande au marchand de confirmer avant de quitter la page quand il y a des modifications non enregistrées. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` et `location` : lire et modifier le panier POS actuel, fermer l'app et revenir à l'écran POS, et obtenir des informations sur l'appareil et l'emplacement POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (la requête d'intent actuelle, `null` hors d'un workflow d'intent), `invoke()` pour invoquer un intent, `response` pour en résoudre un, et `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` enregistre un callback qui reçoit les données de performance Web Vitals ; `null` le désenregistre. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` enregistre une fonction qui s'exécute quand le marchand clique sur le bouton d'assistance ; `null` la désenregistre. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` demande un modal d'avis sur l'app, qui ne s'affiche que si les limites de fréquence et les conditions d'éligibilité sont respectées. Le résultat a `success`, `code` et `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` renvoie les scopes d'accès accordés, requis et optionnels de l'app sur la boutique ; `request(scopes)` demande au marchand d'accorder des scopes optionnels ; `revoke(scopes)` révoque des scopes optionnels accordés. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Affiche des interfaces de sélection pour les fichiers, les dates et d'autres types de données courants. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` se résout en la liste des extensions de l'app, avec leurs informations d'état. |
| `shopifyQL` | `ShopifyQLApi` | `available()` et `ready()`. Non décrit autrement dans les types. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Démarre des conversations Sidekick pour le marchand depuis votre app. Il est toujours défini, mais ses méthodes sont rejetées quand Sidekick n'est pas disponible pour l'app ; `isEnabled()` le vérifie. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` et `clear` associent des fonctions de traitement à des outils déjà déclarés dans la configuration de l'extension d'app, que la plateforme peut appeler au nom de l'app. |
