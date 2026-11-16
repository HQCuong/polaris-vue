---
title: "Modal (ui-modal) – App Bridge modal für Vue 3"
description: "Modal rendert ui-modal von Shopify App Bridge in Vue 3: Binden Sie v-model:open, nutzen Sie die Events show und hide und eine TitleBar. Aus polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Ein Modal ist ein Overlay, das die Interaktion mit dem Rest der App verhindert, bis es geschlossen wird, wie Shopifys [Modal-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) es beschreibt.

`Modal` rendert `ui-modal`. Binden Sie `v-model:open`, um es zu öffnen und zu schließen:

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

Was die Komponente tut, nach dem Vorbild von `Modal` in `@shopify/app-bridge-react`:

- `open` ruft `show()` oder `hide()` des Elements auf. Wenn sich das Modal im Adminbereich öffnet oder
  schließt, werden `show` und `hide` emittiert und `open` wird über `v-model:open` aktualisiert.
  Das Modal wird ausgeblendet, wenn die Komponente unmounted wird.
- Eine `TitleBar` (oder `<ui-title-bar>`) und eine `SaveBar` (oder `<ui-save-bar>`) im Default-Slot
  bleiben direkte Kinder von `ui-modal`. Alles andere wird in `content` des Elements gerendert,
  innerhalb eines einzelnen `<div>`.
- `id`, `variant` und `src` werden an das Element weitergegeben.

Shopifys [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
erklärt, wie diese Modals funktionieren:

- Modals werden vom Shopify-Adminbereich in einem iframe gerendert, das denselben Origin wie Ihre App hat.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Eigenes JavaScript wird nicht
  kopiert, und Sie haben keinen direkten Zugriff auf das `document`.
- Mit `src` lädt das Modal stattdessen eine Route Ihrer App. Die Typen von `ui-modal` besagen, dass dann
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". Die Route kommuniziert über `postMessage` mit Ihrer App, wie auf
  dieser Seite gezeigt.

Die genannte Seite empfiehlt das `src`-Modal für alles, was ihre Einschränkungen ausschließen. Die Vue-
Event-Behandlung und Polaris-`s-*`-Elemente innerhalb des verschobenen Inhalts wurden im Adminbereich noch
nicht verifiziert.

## Element-Methoden aufrufen {#modal-methods}

`$el` der Komponente ist das Element `ui-modal`, typisiert als `UIModalElement`:

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

Die API `shopify.modal` (`ModalApi`) nimmt ebenfalls eine `id` entgegen, aber ihre Typen und Shopifys Seite zur
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
beschreiben sie für das Polaris-Element `s-modal`. Für `ui-modal` rufen Sie die Element-Methoden wie oben auf.

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.

### Eine destruktive Aktion bestätigen {#example-confirm-delete}

Verwenden Sie dies, wenn eine Zeilenaktion etwas löscht, das der Händler nicht wiederherstellen kann.

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

- Ein Modal bedient jede Zeile. Die Zeile setzt `pending`, und die Titelleiste nennt das Produkt.
  Der Modal-Inhalt bleibt statisch, weil Vue-Aktualisierungen im verschobenen Inhalt nicht verifiziert sind.
- Shopifys "Simple message modal" legt den Löschen-Button mit `variant="primary"` und `tone="critical"`
  in die Titelleiste
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Die Buttons der Titelleiste sind direkte Kinder von `ui-modal`, daher läuft `confirmDelete` in Ihrer
  Seite. Der Toast wird von dort aus nach der Anfrage angezeigt
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Ein kurzes Formular in einem Modal {#example-form-modal}

Verwenden Sie dies, um einen oder zwei Werte zu erfassen, ohne die Seite zu verlassen, etwa eine Notiz zu einer Bestellung.

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

- Der Inhalt ist ein einzelnes `<form>`. Shopify: "Sie dürfen nur ein einziges übergeordnetes Element angeben,
  üblicherweise ein `p`, `form` oder `div`"
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` leert die Notiz, egal wie das Modal geschlossen wird, auch über die Schließen-Schaltfläche des Adminbereichs.
- Nicht verifiziert: ob `v-model` auf der `<textarea>` die Eingaben des Händlers mitbekommt. App Bridge
  "kopiert nur die HTML-Elemente und Stylesheets in den Modal-Frame", und die Listener von Vue sind
  JavaScript. Funktioniert es nicht, verwenden Sie ein `src`-Modal, wie im nächsten Beispiel.
- Shopifys Version dieses Formulars hat zusätzlich `data-save-bar`, das es mit der Speicherleiste verbindet
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Ein Editor in einem src-Modal {#example-src-modal}

Verwenden Sie dies für Inhalte, die Ihr eigenes JavaScript brauchen, etwa einen Rich-Text-Editor. Das Modal lädt
eine Route Ihrer App, und die beiden Frames kommunizieren per `postMessage`.

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

- Im Modal ist `window.opener` Ihre App-Seite. In der Seite ist das `contentWindow` des Modals
  die Route ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  Auf `contentWindow` kann "nur zugegriffen werden, wenn das Modal geöffnet ist" (`UIModalElement`), daher
  meldet die Route zuerst `ready`, und die Seite antwortet mit dem Inhalt.
- Shopifys Beispiel sendet mit `location.origin` als Ziel-Origin. Die Prüfungen von `event.origin`
  und `event.source` wurden hier ergänzt, damit jede Seite nur Nachrichten der
  anderen annimmt.
- Der Speichern-Button liegt in der Titelleiste der Seite. Er fordert den Inhalt von der Route an, und
  die Seite speichert ihn und zeigt den Toast. "Sie können in Ihrem Modal nicht direkt auf App-Bridge-Funktionen
  wie Toast zugreifen"
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- Die Route braucht das Script-Tag `app-bridge.js` sowie ein eigenes CSS und JS. In einer Vite-App
  wird jede Route aus `index.html` ausgeliefert, das das Script bereits enthält.
- `variant="max"` muss gesetzt sein, bevor das Modal angezeigt wird. Danach lassen sich nur noch `small`, `base`
  und `large` setzen (`UIModalElement`).

### Ein Modal aus einer anderen Komponente öffnen {#example-modal-by-id}

Verwenden Sie dies, wenn der Button, der ein Modal öffnet, in einer anderen Komponente liegt als das Modal,
etwa ein Hilfe-Modal, das aus mehreren Tabellenzeilen geöffnet wird.

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

- Binden Sie `ShippingHelpModal` einmal ein, zum Beispiel in Ihrem Layout, und rufen Sie `show()` aus einer
  beliebigen Komponente auf. Die Methoden `show()` und `hide()` gehören zu `UIModalElement`; Shopifys
  [src-Modal-Beispiel](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  ruft sie über `document.getElementById` auf.
- Das Modal hat kein `v-model:open`, daher muss sonst niemand wissen, ob es geöffnet ist.
- Shopifys Seite zur [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  zeigt `shopify.modal.show(id)` mit dem Polaris-Element `s-modal`.

### Die Seite aktualisieren, wenn ein Modal schließt {#example-show-hide-events}

Verwenden Sie dies, wenn ein Modal Daten ändert, die die Seite anzeigt, etwa ein Import, der Produkte hinzufügt.

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

- `hide` wird bei jeder Art des Schließens ausgelöst, auch über die Schließen-Schaltfläche des Adminbereichs, daher
  lädt die Seite ihre Daten genau einmal, an einer Stelle, neu. `show` und `hide` sind die Events, die
  `UIModalElement` auflistet.
- `v-model:open` folgt dem Modal bereits. Verwenden Sie `@show` und `@hide` für Seiteneffekte.

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `open` | `boolean` | Ob das Modal angezeigt wird. Verwenden Sie `v-model:open`, um es synchron zu halten, wenn App Bridge das Modal schließt. Standard: `false`. |
| `id` | `string` | Eine eindeutige Kennung für das Modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | Die Größe des Modals. Standard: `"base"`. Bevor das Modal angezeigt wird, kann jeder dieser Werte gesetzt werden; danach nur noch `small`, `base` oder `large`. |
| `src` | `string` | Die URL des Inhalts, der im Modal angezeigt wird. Mit `src` werden andere Kinder als `ui-title-bar` und `ui-save-bar` ignoriert. |

`open` ist ein Prop der Komponente; `id`, `variant` und `src` sind Attribute von `ui-modal`, die an das Element weitergegeben werden.

### Events {#events}

| Event | Typ | Beschreibung |
| --- | --- | --- |
| `show` | `Event` | Das Modal wurde angezeigt. |
| `hide` | `Event` | Das Modal wurde ausgeblendet. |
| `update:open` | `boolean` | Wird nach `show` oder `hide` emittiert, wenn der neue Zustand von `open` abweicht, für `v-model:open`. |

### Slots {#slots}

| Slot | Beschreibung |
| --- | --- |
| `default` | Der Inhalt des Modals. Eine `TitleBar` (oder `<ui-title-bar>`) konfiguriert die Titelleiste des Modals. Sie und eine `SaveBar` (oder `<ui-save-bar>`) bleiben direkte Kinder von `ui-modal`; alles andere wird in `content` des Modals gerendert. |
