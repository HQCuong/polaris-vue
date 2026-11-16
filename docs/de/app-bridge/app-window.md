---
title: "AppWindow (s-app-window) – App Bridge für Vue 3"
description: "AppWindow rendert s-app-window von Shopify App Bridge, ein modales Vollbildfenster im Shopify-Adminbereich, in Vue 3: src ist erforderlich, geöffnet wird es mit v-model:open."
---

# AppWindow {#app-window}

Shopifys [s-app-window-Referenz](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) beschreibt es als ein Vollbild-Modalfenster für komplexe Abläufe, die eigenen Platz auf dem Bildschirm brauchen.

`AppWindow` rendert `s-app-window`, das die Dokumentation von `@shopify/app-bridge-types` beschreibt als
"a fullscreen modal window in the Shopify admin". `src` ist erforderlich: "the URL is loaded
in an iframe when the window opens".

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Edit in bulk</button>
  <AppWindow id="bulk-editor" src="/bulk-editor" v-model:open="open" />
</template>
```

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei [`Modal`](/de/app-bridge/modal). Es hat
keinen Slot.

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.

### Ein Vollbild-Editor {#example-window-editor}

Verwenden Sie dies für einen Editor, der den ganzen Bildschirm braucht und aus einer Liste von Datensätzen geöffnet wird.

::: code-group

```vue [ProductList.vue]
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const editingId = ref<string | null>(null)
const open = ref(false)

// The window loads this route of your app in an iframe.
const src = computed(() =>
  editingId.value ? `/products/${encodeURIComponent(editingId.value)}/editor` : null,
)

function edit(product: Product): void {
  editingId.value = product.id
  open.value = true
}

async function reload(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

onMounted(reload)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="base">
      <SStack v-for="product in products" :key="product.id" direction="inline" gap="base">
        <SText>{{ product.title }}</SText>
        <SButton @click="edit(product)">Open editor</SButton>
      </SStack>
    </SStack>
  </SSection>
  <AppWindow v-if="src" id="product-editor" :src="src" v-model:open="open" @hide="reload" />
</template>
```

```vue [ProductEditor.vue]
<script setup lang="ts">
// The route at /products/:id/editor, loaded inside the window.
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SBanner, SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'

interface ProductDraft {
  title: string
  description: string
}

const route = useRoute()
const url = computed(() => `/api/products/${encodeURIComponent(String(route.params.id))}`)

const saved = ref<ProductDraft>({ title: '', description: '' })
const form = ref<ProductDraft>({ ...saved.value })
const error = ref(false)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as ProductDraft
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const values = { ...form.value }
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  error.value = !res.ok
  if (res.ok) saved.value = values
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage :heading="saved.title || 'Product editor'">
    <SBanner v-if="error" tone="critical">The product could not be saved.</SBanner>
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.title" label="Product title" name="title" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="12" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

:::

- `src` "muss auf eine Route innerhalb Ihrer App zeigen", und "die URL wird in einem iframe geladen, wenn
  das Fenster geöffnet wird" (`SAppWindowAttributes`). Ändert sich `src`, während das Fenster geöffnet ist,
  navigiert es zur neuen URL (`SAppWindowElement`).
- Shopifys Best Practices für das Fenster: Öffnen Sie es nur durch eine ausdrückliche Aktion, setzen Sie
  die Überschrift mit `s-page` im Inhalt des Fensters, fügen Sie `data-save-bar` zu seinen Formularen hinzu
  und führen Sie den Händler beim Schließen dorthin zurück, wo er angefangen hat
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- Das Fenster wird erst gerendert, wenn ein Datensatz gewählt ist, weil `src` erforderlich ist.
- `@hide="reload"` aktualisiert die Liste nach jedem Schließen. Shopify nennt "Aktualisieren des UI-Zustands"
  als Einsatzzweck des Events `hide` (`SAppWindowElement`).
- Das Formular folgt dem [data-save-bar-Beispiel](/de/app-bridge/save-bar#example-data-save-bar).
  Hat es ungespeicherte Änderungen, fragt `hide()` des Fensters den Händler vor dem Schließen.
- Der Editor zeigt Fehler in der Seite an. Shopify sagt nicht, welche App-Bridge-APIs, etwa Toast,
  im Fenster funktionieren.
- Shopify dokumentiert nicht, wie die Route des Fensters das Fenster schließt oder Daten an Ihre Seite
  zurückschickt. Die Seite kann die Route über das `contentWindow` des Elements erreichen
  ("damit lässt sich über `postMessage()` mit dem iframe-Inhalt kommunizieren"), und nur, solange das
  Fenster geöffnet ist.

### Eine Auswahl gesammelt bearbeiten {#example-window-bulk-edit}

Verwenden Sie dies, wenn der Händler Zeilen auswählt und sie gemeinsam in einer Vollbildansicht bearbeitet.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SCheckbox, SSection, SStack } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const selected = ref<string[]>([])
const open = ref(false)

// The selection travels in the URL, which the bulk-edit route reads.
const src = computed(() => `/bulk-edit?ids=${encodeURIComponent(selected.value.join(','))}`)

function toggle(id: string): void {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id]
}

async function load(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

async function onHide(): Promise<void> {
  selected.value = []
  await load()
}

onMounted(load)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="small-200">
      <SCheckbox
        v-for="product in products"
        :key="product.id"
        :label="product.title"
        :checked="selected.includes(product.id)"
        @change="toggle(product.id)"
      />
    </SStack>
    <SButton :disabled="selected.length === 0" @click="open = true">
      Edit {{ selected.length }} selected
    </SButton>
  </SSection>
  <AppWindow id="bulk-editor" :src="src" v-model:open="open" @hide="onHide" />
</template>
```

- Shopify nennt Massenbearbeitungen unter den Einsatzzwecken von `src` (`SAppWindowAttributes`). Die Route ist
  eine gewöhnliche Seite Ihrer App und liest die Auswahl daher aus ihrem Query-String.
- Nachdem das Fenster geschlossen wurde, leert `onHide` die Auswahl und lädt die Liste neu.

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `open` | `boolean` | Ob das Fenster angezeigt wird. Verwenden Sie `v-model:open`, um es synchron zu halten, wenn App Bridge das Fenster schließt. Standard: `false`. |
| `id` | `string` | Eine eindeutige Kennung für das App-Fenster-Element, mit der Sie Schaltflächen über `commandFor` verbinden oder das Element mit `document.getElementById()` abrufen. |
| `src` | `string` (erforderlich) | Die URL des Inhalts, der im Fenster angezeigt wird. Sie muss auf eine Route Ihrer App zeigen, die den Fensterinhalt rendert, und wird beim Öffnen des Fensters in einem iframe geladen. |

### Events {#events}

| Event | Typ | Beschreibung |
| --- | --- | --- |
| `show` | `Event` | Das Fenster wurde geöffnet. |
| `hide` | `Event` | Das Fenster wurde geschlossen. |
| `update:open` | `boolean` | Wird nach `show` oder `hide` emittiert, wenn der neue Zustand von `open` abweicht, für `v-model:open`. |

### Slots {#slots}

`AppWindow` hat keine Slots: `SAppWindowAttributes` definiert keine Kinder.
