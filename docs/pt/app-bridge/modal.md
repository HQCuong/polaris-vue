---
title: "Modal (ui-modal) – modal do App Bridge para Vue 3"
description: "Modal renderiza o ui-modal do Shopify App Bridge em Vue 3: vincule v-model:open, receba os events show e hide e adicione uma TitleBar. Importe de polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Um modal é uma sobreposição que impede a interação com o resto do app até ser fechado, como descreve a [referência do Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) da Shopify.

`Modal` renderiza `ui-modal`. Vincule `v-model:open` para abri-lo e fechá-lo:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const open = ref(false)

function confirm(): void {
  open.value = false
  useAppBridge().toast.show('Reset')
}
</script>

<template>
  <button @click="open = true">Reset settings</button>
  <Modal id="reset-modal" v-model:open="open">
    <p>This restores the default values.</p>
    <TitleBar title="Reset settings?">
      <button variant="primary" @click="confirm">Reset</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

O que o componente faz, seguindo o `Modal` do `@shopify/app-bridge-react`:

- `open` chama `show()` ou `hide()` do elemento. Quando o modal abre ou fecha no
  admin, `show` e `hide` são emitidos e `open` é atualizado por meio de `v-model:open`.
  O modal é ocultado quando o componente é desmontado.
- Um `TitleBar` (ou `<ui-title-bar>`) e um `SaveBar` (ou `<ui-save-bar>`) no slot padrão
  continuam sendo filhos diretos de `ui-modal`. Todo o resto é renderizado no `content` do
  elemento, dentro de um único `<div>`.
- `id`, `variant` e `src` são repassados ao elemento.

O guia [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
da Shopify explica como esses modais funcionam:

- Os modais são renderizados pelo admin da Shopify, em um iframe de mesma origem que o seu app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." O JavaScript personalizado não é
  copiado, e você não tem acesso direto ao `document`.
- Com `src`, o modal carrega uma rota do seu app. Os tipos de `ui-modal` dizem que,
  nesse caso, "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". A rota se comunica com o seu app por meio de `postMessage`, como mostrado
  nessa página.

A página acima recomenda o modal com `src` para tudo o que as suas limitações excluem. O
tratamento de eventos do Vue e os elementos `s-*` do Polaris dentro do conteúdo movido ainda não
foram verificados no admin.

## Chamando métodos do elemento {#modal-methods}

O `$el` do componente é o elemento `ui-modal`, tipado como `UIModalElement`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'polaris-vue-elements/app-bridge'

const modal = ref<InstanceType<typeof Modal> | null>(null)

async function toggle(): Promise<void> {
  await modal.value?.$el.toggle()
}
</script>

<template>
  <Modal ref="modal" id="info-modal">
    <p>Details</p>
  </Modal>
</template>
```

A API `shopify.modal` (`ModalApi`) também recebe um `id`, mas os tipos dela e a página da
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
da Shopify a descrevem para o elemento `s-modal` do Polaris. Para `ui-modal`, chame os métodos do elemento como acima.

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.

### Confirmar uma ação destrutiva {#example-confirm-delete}

Use isto quando uma ação de linha exclui algo que o lojista não pode recuperar.

```vue
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  SButton,
  STable,
  STableBody,
  STableCell,
  STableHeader,
  STableHeaderRow,
  STableRow,
} from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([
  { id: 'gid://shopify/Product/1', title: 'Wool sweater' },
  { id: 'gid://shopify/Product/2', title: 'Linen shirt' },
])
const pending = ref<Product | null>(null)
const open = ref(false)
const deleting = ref(false)

const title = computed(() => `Delete ${pending.value?.title ?? 'product'}?`)

async function askToDelete(product: Product): Promise<void> {
  pending.value = product
  // Let Vue render the new title before the modal opens.
  await nextTick()
  open.value = true
}

async function confirmDelete(): Promise<void> {
  const product = pending.value
  if (!product || deleting.value) return
  const shopify = useAppBridge()
  deleting.value = true
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    products.value = products.value.filter((p) => p.id !== product.id)
    open.value = false
    shopify.toast.show(`${product.title} deleted`)
  } catch {
    shopify.toast.show('Could not delete the product', { isError: true })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <STable>
    <STableHeaderRow>
      <STableHeader>Product</STableHeader>
      <STableHeader>Actions</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow v-for="product in products" :key="product.id">
        <STableCell>{{ product.title }}</STableCell>
        <STableCell>
          <SButton tone="critical" @click="askToDelete(product)">Delete</SButton>
        </STableCell>
      </STableRow>
    </STableBody>
  </STable>

  <Modal id="delete-product-modal" v-model:open="open" @hide="pending = null">
    <p>This permanently deletes the product. You can't undo this.</p>
    <TitleBar :title="title">
      <button variant="primary" tone="critical" @click="confirmDelete">Delete</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Um modal atende todas as linhas. A linha define `pending`, e a barra de título informa o nome do produto.
  O corpo do modal permanece estático, porque as atualizações do Vue dentro do conteúdo movido não foram verificadas.
- O "Simple message modal" da Shopify coloca o botão Delete na barra de título com
  `variant="primary"` e `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Os botões da barra de título são filhos diretos de `ui-modal`, então `confirmDelete` é executado na
  sua página. O toast é exibido a partir dali, depois da requisição
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Um formulário curto em um modal {#example-form-modal}

Use isto para coletar um ou dois valores sem sair da página, como uma nota em um pedido.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ orderId: string }>()

const open = ref(false)
const note = ref('')
const saving = ref(false)

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  saving.value = true
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(props.orderId)}/note`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Note saved')
  } catch {
    shopify.toast.show('Could not save the note', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  note.value = ''
}
</script>

<template>
  <SButton @click="open = true">Add note</SButton>
  <Modal id="order-note-modal" v-model:open="open" @hide="reset">
    <form @submit.prevent="save">
      <label>
        Note
        <textarea v-model="note" name="note" rows="4" />
      </label>
    </form>
    <TitleBar title="Add a note">
      <button variant="primary" @click="save">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- O conteúdo é um único `<form>`. Shopify: "Você só pode fornecer um único elemento pai,
  geralmente um `p`, `form` ou um `div`"
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` limpa a nota de qualquer forma que o modal seja fechado, inclusive pelo botão de fechar do admin.
- Não verificado: se o `v-model` no `<textarea>` enxerga o que o lojista digita. O App Bridge
  "só copia os elementos HTML e as folhas de estilo para o frame do modal", e os listeners do Vue são
  JavaScript. Se não funcionar, use um modal com `src`, como no próximo exemplo.
- A versão da Shopify deste formulário também tem `data-save-bar`, que o conecta à barra de salvamento
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Um editor em um modal com src {#example-src-modal}

Use isto para conteúdo que precisa do seu próprio JavaScript, como um editor rico. O modal carrega
uma rota do seu app, e os dois frames conversam com `postMessage`.

::: code-group

```ts [editor-messages.ts]
// Messages between the page and the modal route. Both sides import this file.
export type ToEditor = { type: 'load'; html: string } | { type: 'request-save' }

export type FromEditor = { type: 'ready' } | { type: 'save'; html: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isToEditor(data: unknown): data is ToEditor {
  if (!isRecord(data)) return false
  return data.type === 'request-save' || (data.type === 'load' && typeof data.html === 'string')
}

export function isFromEditor(data: unknown): data is FromEditor {
  if (!isRecord(data)) return false
  return data.type === 'ready' || (data.type === 'save' && typeof data.html === 'string')
}
```

```vue [ProductDescription.vue]
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { isFromEditor, type ToEditor } from './editor-messages'

const props = defineProps<{ productId: string; description: string }>()
const emit = defineEmits<{ saved: [html: string] }>()

const modal = ref<InstanceType<typeof Modal> | null>(null)
const open = ref(false)

function post(message: ToEditor): void {
  // contentWindow is only available while the modal is open.
  modal.value?.$el.contentWindow?.postMessage(message, location.origin)
}

async function save(html: string): Promise<void> {
  const shopify = useAppBridge()
  shopify.loading(true)
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    emit('saved', html)
    open.value = false
    shopify.toast.show('Description saved')
  } catch {
    shopify.toast.show('Could not save the description', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin) return
  if (event.source !== modal.value?.$el.contentWindow) return
  const message: unknown = event.data
  if (!isFromEditor(message)) return
  if (message.type === 'ready') post({ type: 'load', html: props.description })
  else void save(message.html)
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <SButton @click="open = true">Edit description</SButton>
  <Modal
    ref="modal"
    id="description-editor"
    src="/modals/description-editor"
    variant="max"
    v-model:open="open"
  >
    <TitleBar title="Edit description">
      <button variant="primary" @click="post({ type: 'request-save' })">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

```vue [DescriptionEditor.vue]
<script setup lang="ts">
// The route at /modals/description-editor, loaded inside the modal.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { STextArea } from 'polaris-vue-elements'
import { isToEditor, type FromEditor } from './editor-messages'

const html = ref('')
const loaded = ref(false)

function opener(): Window | null {
  // The app page that opened this modal.
  return window.opener as Window | null
}

function post(message: FromEditor): void {
  opener()?.postMessage(message, location.origin)
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin || event.source !== opener()) return
  const message: unknown = event.data
  if (!isToEditor(message)) return
  if (message.type === 'load') {
    html.value = message.html
    loaded.value = true
  } else {
    post({ type: 'save', html: html.value })
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  post({ type: 'ready' })
})
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <STextArea v-model="html" label="Description" :rows="20" :disabled="!loaded" />
</template>
```

:::

- No modal, `window.opener` é a página do seu app. Na página, o `contentWindow` do modal é
  a rota ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  O `contentWindow` "só pode ser acessado quando o modal está aberto" (`UIModalElement`), então a
  rota diz `ready` primeiro e a página responde com o conteúdo.
- O exemplo da Shopify envia com `location.origin` como origem de destino. As verificações de `event.origin`
  e `event.source` foram adicionadas aqui, para que cada lado aceite apenas mensagens do
  outro.
- O botão Save fica na barra de título da página. Ele pede o conteúdo à rota, e
  a página o salva e exibe o toast. "Você não consegue acessar recursos do App Bridge
  como o toast diretamente no seu modal"
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- A rota precisa da tag de script `app-bridge.js` e do seu próprio CSS e JS. Em um app Vite,
  toda rota é servida a partir de `index.html`, que já tem o script.
- `variant="max"` deve ser definido antes de o modal ser exibido. Depois disso, só `small`, `base`
  e `large` podem ser definidos (`UIModalElement`).

### Abrir um modal a partir de outro componente {#example-modal-by-id}

Use isto quando o botão que abre um modal fica em um componente diferente do modal,
como um modal de ajuda aberto a partir de várias linhas de uma tabela.

::: code-group

```ts [useModalById.ts]
/// <reference types="@shopify/app-bridge-types" />

export interface ModalControls {
  show: () => Promise<void>
  hide: () => Promise<void>
}

// Finds the ui-modal element by its id when it is needed, as in Shopify's
// document.getElementById('my-modal').show() example.
export function useModalById(id: string): ModalControls {
  const element = (): UIModalElement | null =>
    document.getElementById(id) as unknown as UIModalElement | null
  return {
    show: async () => {
      await element()?.show()
    },
    hide: async () => {
      await element()?.hide()
    },
  }
}
```

```vue [ShippingHelpModal.vue]
<script setup lang="ts">
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <Modal id="shipping-help">
    <div>
      <p>Rates are calculated at checkout from the package weight.</p>
      <p>Free shipping applies after discounts.</p>
    </div>
    <TitleBar title="How shipping rates work" />
  </Modal>
</template>
```

```vue [RatesTable.vue]
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useModalById } from './useModalById'

const help = useModalById('shipping-help')
</script>

<template>
  <SButton variant="tertiary" icon="question-circle" accessibilityLabel="How rates work" @click="help.show()" />
</template>
```

:::

- Monte `ShippingHelpModal` uma vez, por exemplo no seu layout, e chame `show()` a partir de qualquer
  componente. Os métodos `show()` e `hide()` estão em `UIModalElement`; o
  [exemplo de modal com src](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  da Shopify os chama por meio de `document.getElementById`.
- O modal não tem `v-model:open`, então nada mais precisa saber se ele está aberto.
- A página da [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  da Shopify mostra `shopify.modal.show(id)` com o elemento `s-modal` do Polaris.

### Atualizar a página quando um modal fecha {#example-show-hide-events}

Use isto quando um modal altera dados que a página exibe, como uma importação que adiciona produtos.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
const importing = ref(false)
const count = ref<number | null>(null)

async function loadCount(): Promise<void> {
  const res = await fetch('/api/products/count')
  if (res.ok) count.value = ((await res.json()) as { count: number }).count
}

function onShow(): void {
  importing.value = true
}

async function onHide(): Promise<void> {
  importing.value = false
  await loadCount()
}

onMounted(loadCount)
</script>

<template>
  <SSection heading="Catalog">
    <SStack direction="inline" gap="base" alignItems="center">
      <SText>{{ count ?? '…' }} products</SText>
      <SButton :disabled="importing" @click="open = true">Import products</SButton>
    </SStack>
  </SSection>

  <Modal
    id="import-products"
    src="/modals/import-products"
    v-model:open="open"
    @show="onShow"
    @hide="onHide"
  >
    <TitleBar title="Import products" />
  </Modal>
</template>
```

- `hide` é disparado de qualquer forma que o modal seja fechado, inclusive pelo botão de fechar do admin, então a
  página recarrega seus dados uma única vez, em um só lugar. `show` e `hide` são os eventos que
  `UIModalElement` lista.
- `v-model:open` já acompanha o modal. Use `@show` e `@hide` para efeitos colaterais.

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `open` | `boolean` | Se o modal está sendo exibido. Use `v-model:open` para mantê-lo sincronizado quando o App Bridge fecha o modal. Padrão: `false`. |
| `id` | `string` | Um identificador único para o modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | O tamanho do modal. Padrão: `"base"`. Antes de o modal ser exibido, pode receber qualquer um desses valores; depois, apenas `small`, `base` ou `large`. |
| `src` | `string` | A URL do conteúdo exibido no modal. Com `src`, os filhos que não sejam `ui-title-bar` e `ui-save-bar` são ignorados. |

`open` é uma prop do componente; `id`, `variant` e `src` são atributos de `ui-modal`, repassados ao elemento.

### Events {#events}

| Event | Tipo | Descrição |
| --- | --- | --- |
| `show` | `Event` | O modal foi exibido. |
| `hide` | `Event` | O modal foi ocultado. |
| `update:open` | `boolean` | Emitido depois de `show` ou `hide` quando o novo estado é diferente de `open`, para `v-model:open`. |

### Slots {#slots}

| Slot | Descrição |
| --- | --- |
| `default` | O conteúdo do modal. Um `TitleBar` (ou `<ui-title-bar>`) configura a barra de título do modal. Ele e um `SaveBar` (ou `<ui-save-bar>`) continuam sendo filhos diretos de `ui-modal`; todo o resto é renderizado no `content` do modal. |
