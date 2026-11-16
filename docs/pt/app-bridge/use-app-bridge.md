---
title: "useAppBridge() – Shopify App Bridge para Vue 3"
description: "useAppBridge() para Vue 3 retorna o global shopify do Shopify App Bridge, tipado como ShopifyGlobal, como no @shopify/app-bridge-react. Para apps incorporados da Shopify."
---

# useAppBridge() {#use-app-bridge}

O global `shopify` é definido pelo script do App Bridge. A [referência do useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) da Shopify o descreve como a forma de usar as APIs do App Bridge, como `toast` e `resourcePicker`.

`useAppBridge()` retorna o global `shopify`, tipado como `ShopifyGlobal`:

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

Como no `@shopify/app-bridge-react`:

- No servidor, ele retorna um objeto que lança um erro quando você lê qualquer propriedade.
  Chame as APIs a partir de `onMounted()` ou de um manipulador de evento.
- No navegador, ele lança um erro se `shopify` não estiver definido, o que "likely means the App
  Bridge script tag was not added correctly to this page".

Usar diretamente o global `shopify`, como faz o guia de apps incorporados, também funciona.

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.
Cada um chama `useAppBridge()` dentro de `onMounted()` ou de um handler de evento, então também funciona
com renderização no servidor.

### Escolher produtos com o seletor de recursos {#example-resource-picker}

Use isto quando o lojista escolhe produtos da loja, aqui para um bundle que ele pode
editar de novo depois.

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

- O seletor retorna `undefined` quando o lojista cancela, "em vez de um array vazio",
  então verifique isso explicitamente
  ([Resource Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/resource-picker-api)).
- `selectionIds` pré-seleciona produtos, e as variantes de cada um, para fluxos de edição.
  `multiple: 5` limita a seleção; com `type: 'product'` o lojista ainda pode escolher
  várias variantes de um produto. `filter.draft` e `filter.archived` definidos como `false` ocultam
  produtos em rascunho e arquivados (`ResourcePickerOptions`).
- `action: 'select'` define o verbo no título: "add" para acrescentar a uma lista, "select" para
  escolher com um propósito ou substituir uma seleção.

### Escolher registros do próprio app {#example-picker}

Use isto quando o lojista escolhe registros que ficam no seu app, como templates de e-mail.
Para produtos, variantes e coleções, a Shopify indica o seletor de recursos.

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

- `shopify.picker()` resolve para um seletor cuja promise `selected` resolve para os `id`s
  escolhidos, ou para `undefined` quando o lojista cancela. Os valores de `data` seguem a ordem de
  `headers`, e `type: 'number'` alinha uma coluna à direita
  ([Picker API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/picker-api)).
- `selected: true` pré-seleciona a escolha atual, que o lojista ainda pode mudar.

### Toasts de sucesso, erro e desfazer {#example-toast}

Use isto para confirmar uma ação sem interromper o lojista, e para oferecer um desfazer.

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

- `ToastOptions` tem `duration` (milissegundos, padrão 5000), `isError`, `action`,
  `onAction` e `onDismiss`. `show()` retorna o ID do toast para `hide(id)`
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).
- Os casos de uso da Shopify incluem "botões de ação em toasts para acompanhamentos rápidos, como
  desfazer alterações" e mensagens de erro que não bloqueiam (mesma página).
- A `duration` mais longa dá tempo ao lojista para desfazer. Chamar `hide()` não é necessário
  nos outros casos: o toast se oculta depois da sua duração.

### Indicador de carregamento em torno de uma requisição {#example-loading}

Use isto enquanto o seu app espera por dados, para que o admin mostre que algo está acontecendo.

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

- `shopify.loading(true)` exibe o indicador de carregamento no cabeçalho do admin, e
  `shopify.loading(false)` o oculta
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
  `finally` garante que ele seja desligado.

### Indicador de carregamento durante mudanças de rota {#example-loading-route-change}

Use isto com o Vue Router, para que páginas carregadas sob demanda (lazy) mostrem o indicador de carregamento do admin.

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

- Chame `showLoadingDuringNavigation(router)` uma vez, onde você cria o router. A Shopify lista
  "transições de página ou mudanças de rota" como um uso da Loading API
  ([Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)).
- `afterEach` também é executado em navegações canceladas, e `onError` cobre uma página que falha
  ao carregar.

### Requisições ao seu backend {#example-authenticated-fetch}

Use isto para carregar dados do seu próprio servidor, com a sessão do lojista.

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

- O interceptador de fetch do App Bridge "inclui automaticamente o ID token no
  header `Authorization` das requisições ao domínio do seu app". Chame `shopify.idToken()`
  você mesmo apenas onde o interceptador não se aplica, como um WebSocket, que é
  o exemplo da própria Shopify
  ([ID Token API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/id-token-api)).
- Envie ID tokens apenas ao seu próprio backend, e verifique-os lá (mesma página). Veja também
  [Falar com o seu backend](/pt/guide/shopify-embedded-app#_4-talk-to-your-backend).

### Loja e idioma a partir da config {#example-config}

Use isto para formatar números no idioma do admin do lojista ou para mostrar em qual loja o app
está.

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

- `config` é síncrono: "Todas as propriedades são síncronas e ficam disponíveis imediatamente
  sem aguardar uma Promise"
  ([Config API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/config-api)).
- `locale` é o idioma que o lojista escolheu para o admin, "não o locale da loja voltado
  ao cliente". `shop` é o domínio permanente `.myshopify.com`, "não um domínio
  personalizado" (`AppBridgeConfig`).

### Um composable no nível do app {#example-admin-action}

Use isto para dar a cada botão o mesmo indicador de carregamento e os mesmos toasts sem repeti-los.

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

- O composable combina a [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  e a [Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api),
  como nos exemplos acima. `pending` controla a prop `loading` do próprio botão.

### Pedir um escopo de acesso opcional {#example-optional-scopes}

Use isto quando um recurso precisa de uma permissão que o app não pede na instalação, como
criar descontos.

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

- `query()` retorna os escopos `granted`, `required` e `optional`. `request()` abre um modal
  de concessão de permissão e resolve com `result` (`'granted-all'` ou `'declined-all'`)
  e o `detail` atualizado
  ([Scopes API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/scopes-api)).
- Os escopos que você solicita devem ser declarados como opcionais na configuração do seu app. Os escopos
  obrigatórios não podem ser revogados (`Scopes`).

### Criar ou editar um recurso no admin {#example-intents}

Use isto para deixar o lojista criar ou editar um recurso da Shopify nas próprias telas do admin,
sem construir esse formulário no seu app.

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

- `invoke()` recebe `action:type` e opções como `value` (o GID a editar) e `data`.
  Um desconto precisa de `data.type`. Ele resolve para uma atividade cuja promise `complete` entrega
  a resposta: `code` é `'ok'` quando o lojista concluiu, `'closed'` quando fechou
  o fluxo, e `'error'` com uma `message` em caso de falha
  ([Intents API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/intents-api)).
- Para editar um produto, a Shopify sugere verificar `hasOnlyDefaultVariant` primeiro e usar
  `shopify/ProductVariant` quando o produto tem variantes (mesma página).

### Pedir uma avaliação depois de um sucesso {#example-review-request}

Use isto no fim de um fluxo que deu certo, como a primeira campanha enviada.

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

- Shopify: "É melhor pedir uma avaliação no fim de um fluxo bem-sucedido do que quando um
  lojista abre o seu app pela primeira vez". Não chame isso a partir de um botão "Avalie-nos": os limites de taxa podem
  impedir o modal, e o botão pareceria quebrado
  ([Reviews API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)).
- O modal aparece no máximo uma vez em 60 dias e três vezes em 365 dias, e nunca no celular,
  nas 24 horas após a instalação, nem depois que o lojista avaliou o app. `code` informa o
  motivo, como `'cooldown-period'` (mesma página).

### Tratar o botão de suporte {#example-support-handler}

Use isto para abrir a sua própria página de ajuda quando o lojista clica no botão de suporte no topo
do app.

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

- Registre o handler uma vez, por exemplo em `App.vue`. `null` o cancela
  ([Support API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/support-api)).
- O app precisa de uma extensão de link de suporte que aponte para uma página do seu app. "Sem esta
  extensão, o callback de suporte é ignorado" (mesma página).

### Adaptar-se ao Shopify Mobile {#example-environment}

Use isto para mudar o layout quando o app roda no app Shopify Mobile, e para manter um
botão flutuante acima da UI inferior do host.

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

- `shopify.environment` tem `mobile`, `embedded`, `pos` e `intent`, todos booleanos
  síncronos
  ([Environment API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/environment-api)).
- O App Bridge define `--shopify-safe-area-inset-bottom` com a altura da UI do host sobre a
  parte inferior do seu app. Os elementos fixos não são movidos por você, então adicione a variável ao
  deslocamento `bottom` deles, como faz o exemplo da Shopify (mesma página).

### Ler um código de barras {#example-scanner}

Use isto em um fluxo de estoque ou recebimento em um celular ou no Shopify POS: leia um código de barras e encontre
a variante.

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

- `scanner.capture()` abre a câmera do dispositivo e resolve para um `ScannerPayload` com o
  código de barras em `data`. O exemplo da Shopify consulta o código de barras com a GraphQL Admin API da
  mesma forma, e trata uma leitura cancelada em `catch`
  ([Scanner API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/scanner-api)).
- `shopify:admin/api/graphql.json` precisa de acesso à Direct API; veja
  [Falar com o seu backend](/pt/guide/shopify-embedded-app#_4-talk-to-your-backend).
- Exibir o botão apenas no celular e no POS é uma escolha deste exemplo: a Scanner API usa
  a câmera do dispositivo, e a Shopify a descreve para o POS.

### Perguntar ao Sidekick sobre os seus dados {#example-sidekick}

Use isto para deixar o lojista pedir ao Sidekick que explique o que o seu app mostra, como um relatório.

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

- Verifique `isEnabled()` antes de mostrar o ponto de entrada, e chame `launch` a partir de uma
  ação do lojista, não ao carregar nem em um temporizador
  ([Sidekick API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/sidekick-api)).
- Outros erros podem ocorrer depois que a Shopify enviou o prompt, então "não tente novamente esses erros
  automaticamente" (mesma página).
- O App Bridge dispara `shopify:sidekick:visibilitychange` em `window` quando o painel abre
  ou fecha, mas não no app Shopify Mobile (mesma página).

### Verificar se um app embed do tema está ativo {#example-app-extensions}

Use isto em uma página de configuração, para avisar o lojista quando o app embed do tema ainda não está ativo.

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

- `app.extensions()` lista as extensões do app. Para uma extensão de app de tema, cada ativação
  é um bloco ou embed com um `handle` e um `status` de `'active'`, `'available'` ou
  `'unavailable'`
  ([App API](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api)).
- Os dados de ativação vêm apenas do tema publicado da loja (mesma página).

### Enviar Web Vitals para o seu monitoramento {#example-web-vitals}

Use isto para acompanhar o desempenho real do seu app no seu próprio serviço de monitoramento.

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

- `onReport` registra um callback que recebe `metrics` como LCP, CLS e INP, cada uma
  com `name`, `value` e `id`; `null` o cancela. O exemplo da Shopify também as envia
  com `navigator.sendBeacon`
  ([Web Vitals API](https://shopify.dev/docs/api/app-home/apis/device-and-platform-integration/web-vitals-api)).

## API {#reference}

Os membros de nível superior de `ShopifyGlobal` em `@shopify/app-bridge-types`. As descrições vêm do JSDoc dos tipos; quando um membro não tem, do resumo na página do shopify.dev vinculada.

| Membro | Tipo | Descrição |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | A configuração do app: `apiKey` (o client ID do app, informado com uma tag `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` e `shop`. |
| `origin` | `string` | Não descrito nos tipos. |
| `ready` | `Promise<void>` | Não descrito nos tipos. |
| `setSignals` | `(RealSignal: any) => void` | Registra uma implementação de signals, por exemplo de `@preact/signals`, para que os valores reativos retornados pelo App Bridge usem a classe Signal do próprio app em vez do shim embutido. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` e `intent`: se o app roda no app Shopify Mobile, está incorporado no admin da Shopify, roda no Shopify POS ou roda como intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Exibe indicadores de carregamento durante operações demoradas. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Gera tokens de ID para autenticação servidor a servidor e requisições de API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Informações sobre o lojista conectado, incluindo nome, e-mail e locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` exibe uma notificação toast no admin da Shopify e retorna o ID dela; `hide(id)` a oculta. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permite que lojistas pesquisem e selecionem recursos da Shopify, como produtos, coleções ou variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` abre a câmera do dispositivo para escanear um código de barras e é resolvido com um `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` e `toggle(id)` exibem, ocultam ou alternam um modal pelo ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` e `toggle(id)` exibem, ocultam ou alternam uma barra de salvamento pelo ID; `leaveConfirmation()` pede ao lojista que confirme antes de sair da página quando há alterações não salvas. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` e `location`: ler e alterar o carrinho atual do POS, fechar o app e voltar para a tela do POS, e obter informações sobre o dispositivo e o local do POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (a solicitação de intent atual, `null` fora de um fluxo de intent), `invoke()` para invocar um intent, `response` para resolver um, e `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registra um callback que recebe dados de desempenho do Web Vitals; `null` cancela o registro. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registra uma função que roda quando o lojista clica no botão de suporte; `null` cancela o registro. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` solicita um modal de avaliação do app, que só aparece se os limites de frequência e as condições de elegibilidade forem atendidos. O resultado tem `success`, `code` e `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` retorna os escopos de acesso concedidos, obrigatórios e opcionais do app na loja; `request(scopes)` pede ao lojista que conceda escopos opcionais; `revoke(scopes)` revoga escopos opcionais concedidos. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Exibe interfaces de seleção para arquivos, datas e outros tipos de dados comuns. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` é resolvido com as extensões do app e suas informações de status. |
| `shopifyQL` | `ShopifyQLApi` | `available()` e `ready()`. Fora isso, não descrito nos tipos. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Inicia conversas do Sidekick para o lojista a partir do seu app. Está sempre definido, mas seus métodos são rejeitados quando o Sidekick não está disponível para o app; `isEnabled()` verifica isso. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` e `clear` vinculam funções de tratamento a ferramentas já declaradas na configuração da extensão do app, que a plataforma pode chamar em nome do app. |
