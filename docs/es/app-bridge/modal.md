---
title: "Modal (ui-modal) – modal de App Bridge para Vue 3"
description: "Modal renderiza ui-modal de Shopify App Bridge en Vue 3: enlaza v-model:open, recibe los events show y hide y añade una TitleBar. Se importa de polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Un modal es una superposición que impide interactuar con el resto de la app hasta que se cierra, como lo describe la [referencia de Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) de Shopify.

`Modal` renderiza `ui-modal`. Enlaza `v-model:open` para abrirlo y cerrarlo:

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

Qué hace el componente, siguiendo a `Modal` de `@shopify/app-bridge-react`:

- `open` llama a `show()` o `hide()` del elemento. Cuando el modal se abre o se cierra en el
  admin, se emiten `show` y `hide` y `open` se actualiza mediante `v-model:open`.
  El modal se oculta cuando el componente se desmonta.
- Un `TitleBar` (o `<ui-title-bar>`) y un `SaveBar` (o `<ui-save-bar>`) en el slot por defecto
  siguen siendo hijos directos de `ui-modal`. Todo lo demás se renderiza en el `content` del
  elemento, dentro de un único `<div>`.
- `id`, `variant` y `src` se pasan al elemento.

[Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app) de
Shopify explica cómo funcionan estos modales:

- El admin de Shopify renderiza los modales, en un iframe del mismo origen que tu app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." El JavaScript personalizado no se
  copia y no tienes acceso directo al `document`.
- Con `src`, el modal carga una ruta de tu app en su lugar. Los tipos de `ui-modal` dicen que
  entonces "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". La ruta se comunica con tu app mediante `postMessage`, como se muestra en
  esa página.

La página anterior recomienda el modal con `src` para todo lo que sus limitaciones descartan. El
manejo de eventos de Vue y los elementos `s-*` de Polaris dentro del contenido movido aún no se
han verificado en el admin.

## Llamar a los métodos del elemento {#modal-methods}

El `$el` del componente es el elemento `ui-modal`, tipado como `UIModalElement`:

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

La API `shopify.modal` (`ModalApi`) también recibe un `id`, pero sus tipos y la página de la
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api) de Shopify
la describen para el elemento `s-modal` de Polaris. Para `ui-modal`, llama a los métodos del elemento como se indicó arriba.

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.

### Confirmar una acción destructiva {#example-confirm-delete}

Úsalo cuando la acción de una fila elimina algo que el comerciante no puede recuperar.

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
- Un solo modal sirve para todas las filas. La fila establece `pending` y la barra de título nombra el producto.
  El cuerpo del modal se mantiene estático, porque las actualizaciones de Vue dentro del contenido movido no están verificadas.
- El "Simple message modal" de Shopify pone el botón Delete en la barra de título con
  `variant="primary"` y `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Los botones de la barra de título son hijos directos de `ui-modal`, así que `confirmDelete` se ejecuta en tu
  página. El toast se muestra desde ahí, después de la solicitud
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Un formulario corto en un modal {#example-form-modal}

Úsalo para recoger uno o dos valores sin salir de la página, como una nota en un pedido.

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
- El contenido es un único `<form>`. Shopify: "Solo puedes proporcionar un único elemento padre,
  normalmente un `p`, `form` o un `div`"
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` borra la nota se cierre como se cierre el modal, incluso desde el botón de cierre del admin.
- No verificado: si `v-model` en el `<textarea>` ve lo que escribe el comerciante. App Bridge
  "solo copia los elementos HTML y las hojas de estilo en el marco del modal", y los listeners de Vue son
  JavaScript. Si no funciona, usa un modal con `src`, como en el siguiente ejemplo.
- La versión de Shopify de este formulario también tiene `data-save-bar`, que lo conecta con la barra de guardado
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Un editor en un modal con src {#example-src-modal}

Úsalo para contenido que necesita tu propio JavaScript, como un editor enriquecido. El modal carga
una ruta de tu app y los dos marcos se comunican con `postMessage`.

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

- En el modal, `window.opener` es la página de tu app. En la página, el `contentWindow` del modal es
  la ruta ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  `contentWindow` "solo se puede acceder cuando el modal está abierto" (`UIModalElement`), así que la
  ruta dice `ready` primero y la página responde con el contenido.
- El ejemplo de Shopify envía con `location.origin` como origen de destino. Aquí se añaden las comprobaciones de `event.origin`
  y `event.source`, para que cada lado solo acepte mensajes del
  otro.
- El botón Save está en la barra de título de la página. Pide el contenido a la ruta, y
  la página lo guarda y muestra el toast. "No puedes acceder directamente a funciones de App Bridge
  como el toast desde tu modal"
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- La ruta necesita la etiqueta de script `app-bridge.js` y tu propio CSS y JS. En una app con Vite,
  todas las rutas se sirven desde `index.html`, que ya tiene el script.
- `variant="max"` debe establecerse antes de mostrar el modal. Después, solo se pueden establecer `small`, `base`
  y `large` (`UIModalElement`).

### Abrir un modal desde otro componente {#example-modal-by-id}

Úsalo cuando el botón que abre un modal está en un componente distinto del modal,
como un modal de ayuda que se abre desde varias filas de una tabla.

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

- Monta `ShippingHelpModal` una sola vez, por ejemplo en tu layout, y llama a `show()` desde cualquier
  componente. Los métodos `show()` y `hide()` están en `UIModalElement`; el
  [ejemplo de modal con src](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route) de Shopify
  los llama mediante `document.getElementById`.
- El modal no tiene `v-model:open`, así que nada más necesita saber si está abierto.
- La página de la [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  de Shopify muestra `shopify.modal.show(id)` con el elemento `s-modal` de Polaris.

### Actualizar la página cuando se cierra un modal {#example-show-hide-events}

Úsalo cuando un modal cambia datos que muestra la página, como una importación que añade productos.

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
- `hide` se dispara se cierre como se cierre el modal, incluso desde el botón de cierre del admin, así que la
  página recarga sus datos una sola vez, en un solo lugar. `show` y `hide` son los eventos que
  lista `UIModalElement`.
- `v-model:open` ya sigue al modal. Usa `@show` y `@hide` para los efectos secundarios.

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `open` | `boolean` | Si el modal se muestra. Usa `v-model:open` para mantenerlo sincronizado cuando App Bridge cierra el modal. Por defecto: `false`. |
| `id` | `string` | Un identificador único para el modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | El tamaño del modal. Por defecto: `"base"`. Antes de mostrar el modal, se puede establecer cualquiera de estos valores; después, solo `small`, `base` o `large`. |
| `src` | `string` | La URL del contenido que se muestra en el modal. Con `src`, se ignoran los hijos que no sean `ui-title-bar` y `ui-save-bar`. |

`open` es una prop del componente; `id`, `variant` y `src` son atributos de `ui-modal` que se pasan al elemento.

### Events {#events}

| Event | Tipo | Descripción |
| --- | --- | --- |
| `show` | `Event` | El modal se mostró. |
| `hide` | `Event` | El modal se ocultó. |
| `update:open` | `boolean` | Se emite después de `show` o `hide` cuando el nuevo estado difiere de `open`, para `v-model:open`. |

### Slots {#slots}

| Slot | Descripción |
| --- | --- |
| `default` | El contenido del modal. Un `TitleBar` (o `<ui-title-bar>`) configura la barra de título del modal. Este y un `SaveBar` (o `<ui-save-bar>`) siguen siendo hijos directos de `ui-modal`; todo lo demás se renderiza en el `content` del modal. |
