---
title: "Modal (ui-modal) – modal App Bridge pour Vue 3"
description: "Modal génère ui-modal de Shopify App Bridge en Vue 3 : liez v-model:open, recevez les events show et hide, ajoutez une TitleBar. À importer depuis polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Un modal est une surcouche qui empêche toute interaction avec le reste de l'app jusqu'à sa fermeture, comme le décrit la [référence Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) de Shopify.

`Modal` génère `ui-modal`. Liez `v-model:open` pour l'ouvrir et le fermer :

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

Ce que fait le composant, d'après `Modal` dans `@shopify/app-bridge-react` :

- `open` appelle `show()` ou `hide()` sur l'élément. Quand le modal s'ouvre ou se ferme dans
  l'interface d'administration, `show` et `hide` sont émis et `open` est mis à jour via `v-model:open`.
  Le modal est masqué lorsque le composant est démonté.
- Un `TitleBar` (ou `<ui-title-bar>`) et un `SaveBar` (ou `<ui-save-bar>`) dans le slot par défaut
  restent des enfants directs de `ui-modal`. Tout le reste est rendu dans le
  `content` de l'élément, à l'intérieur d'un seul `<div>`.
- `id`, `variant` et `src` sont transmis à l'élément.

La page [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
de Shopify explique le fonctionnement de ces modals :

- Les modals sont rendus par l'interface d'administration Shopify, dans une iframe de même origine que votre app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Le JavaScript personnalisé n'est pas
  copié, et vous n'avez pas d'accès direct au `document`.
- Avec `src`, le modal charge à la place une route de votre app. Les types de `ui-modal` indiquent qu'alors
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". La route communique avec votre app via `postMessage`, comme le montre
  cette page.

La page ci-dessus recommande le modal `src` pour tout ce que ses limitations excluent. La gestion
des événements Vue et les éléments Polaris `s-*` dans le contenu déplacé n'ont pas encore été
vérifiés dans l'interface d'administration.

## Appeler les méthodes de l'élément {#modal-methods}

Le `$el` du composant est l'élément `ui-modal`, typé `UIModalElement` :

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

L'API `shopify.modal` (`ModalApi`) accepte aussi un `id`, mais ses types et la page [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
de Shopify la décrivent pour l'élément Polaris `s-modal`. Pour `ui-modal`, appelez les méthodes de l'élément comme ci-dessus.

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.

### Confirmer une action destructive {#example-confirm-delete}

Utilisez ceci lorsqu'une action de ligne supprime quelque chose que le marchand ne peut pas récupérer.

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

- Un seul modal sert toutes les lignes. La ligne définit `pending`, et la barre de titre nomme le produit.
  Le corps du modal reste statique, car les mises à jour Vue dans le contenu déplacé ne sont pas vérifiées.
- Le "Simple message modal" de Shopify place le bouton Delete dans la barre de titre avec
  `variant="primary"` et `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Les boutons de la barre de titre sont des enfants directs de `ui-modal`, donc `confirmDelete` s'exécute dans votre
  page. Le toast est affiché depuis cette page, après la requête
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Un court formulaire dans un modal {#example-form-modal}

Utilisez ceci pour recueillir une ou deux valeurs sans quitter la page, comme une note sur une commande.

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

- Le contenu est un unique `<form>`. Shopify : "You can only provide a single parent element,
  commonly a `p`, `form`, or a `div`"
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` efface la note quelle que soit la manière dont le modal se ferme, y compris depuis le bouton de fermeture de l'admin.
- Non vérifié : si `v-model` sur le `<textarea>` voit la saisie du marchand. App Bridge
  "only copies the HTML elements and stylesheets into the modal frame", et les écouteurs de Vue sont
  du JavaScript. Si cela ne fonctionne pas, utilisez un modal `src`, comme dans l'exemple suivant.
- La version de Shopify de ce formulaire a aussi `data-save-bar`, qui le relie à la barre d'enregistrement
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Un éditeur dans un modal src {#example-src-modal}

Utilisez ceci pour un contenu qui a besoin de votre propre JavaScript, comme un éditeur riche. Le modal charge
une route de votre app, et les deux frames communiquent avec `postMessage`.

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

- Dans le modal, `window.opener` est la page de votre app. Dans la page, le `contentWindow` du modal est
  la route ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  `contentWindow` "can only be accessed when the modal is open" (`UIModalElement`), donc la
  route envoie d'abord `ready` et la page répond avec le contenu.
- L'exemple de Shopify envoie avec `location.origin` comme origine cible. Les vérifications de `event.origin`
  et `event.source` sont ajoutées ici, pour que chaque côté n'accepte que les messages de
  l'autre.
- Le bouton Save se trouve dans la barre de titre de la page. Il demande son contenu à la route, et
  la page l'enregistre et affiche le toast. "You're not able to access App Bridge features
  such as toast directly in your modal"
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- La route a besoin de la balise de script `app-bridge.js` ainsi que de son propre CSS et JS. Dans une app Vite,
  chaque route est servie depuis `index.html`, qui contient déjà le script.
- `variant="max"` doit être défini avant l'affichage du modal. Ensuite, seuls `small`, `base`
  et `large` peuvent être définis (`UIModalElement`).

### Ouvrir un modal depuis un autre composant {#example-modal-by-id}

Utilisez ceci lorsque le bouton qui ouvre un modal se trouve dans un autre composant que le modal,
par exemple une modale d'aide ouverte depuis plusieurs lignes d'un tableau.

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

- Montez `ShippingHelpModal` une seule fois, par exemple dans votre layout, et appelez `show()` depuis n'importe quel
  composant. Les méthodes `show()` et `hide()` sont sur `UIModalElement` ; l'
  [exemple de modal src](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route) de Shopify
  les appelle via `document.getElementById`.
- Le modal n'a pas de `v-model:open`, donc rien d'autre n'a besoin de savoir s'il est ouvert.
- La page [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  de Shopify montre `shopify.modal.show(id)` avec l'élément Polaris `s-modal`.

### Actualiser la page à la fermeture d'un modal {#example-show-hide-events}

Utilisez ceci lorsqu'un modal modifie des données que la page affiche, comme un import qui ajoute des produits.

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

- `hide` se déclenche quelle que soit la manière dont le modal se ferme, y compris par le bouton de fermeture de l'admin, donc la
  page recharge ses données une seule fois, à un seul endroit. `show` et `hide` sont les événements que
  liste `UIModalElement`.
- `v-model:open` suit déjà le modal. Utilisez `@show` et `@hide` pour les effets de bord.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si le modal est affiché. Utilisez `v-model:open` pour rester synchronisé quand App Bridge ferme le modal. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour le modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | La taille du modal. Par défaut : `"base"`. Avant l'affichage du modal, n'importe laquelle de ces valeurs peut être définie ; ensuite, seulement `small`, `base` ou `large`. |
| `src` | `string` | L'URL du contenu à afficher dans le modal. Avec `src`, les enfants autres que `ui-title-bar` et `ui-save-bar` sont ignorés. |

`open` est une prop du composant ; `id`, `variant` et `src` sont des attributs de `ui-modal`, transmis à l'élément.

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | Le modal a été affiché. |
| `hide` | `Event` | Le modal a été masqué. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Le contenu du modal. Un `TitleBar` (ou `<ui-title-bar>`) configure la barre de titre du modal. Lui et un `SaveBar` (ou `<ui-save-bar>`) restent des enfants directs de `ui-modal` ; tout le reste est rendu dans le `content` du modal. |
