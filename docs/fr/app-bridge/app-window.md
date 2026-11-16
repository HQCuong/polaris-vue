---
title: "AppWindow (s-app-window) – App Bridge pour Vue 3"
description: "AppWindow génère s-app-window de Shopify App Bridge, une fenêtre modale plein écran dans l'admin Shopify, en Vue 3 : src est requis, ouverture avec v-model:open."
---

# AppWindow {#app-window}

La [référence s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) de Shopify le décrit comme une fenêtre modale plein écran pour les workflows complexes qui ont besoin d'un espace d'écran dédié.

`AppWindow` génère `s-app-window`, que la documentation de `@shopify/app-bridge-types` décrit comme
"a fullscreen modal window in the Shopify admin". `src` est obligatoire : "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour [`Modal`](/fr/app-bridge/modal). Il n'a
pas de slot.

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.

### Un éditeur plein écran {#example-window-editor}

Utilisez ceci pour un éditeur qui a besoin de tout l'écran, ouvert depuis une liste d'enregistrements.

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

- `src` "must point to a route within your app", et "the URL is loaded in an iframe when
  the window opens" (`SAppWindowAttributes`). Changer `src` pendant que la fenêtre est ouverte
  la fait naviguer vers la nouvelle URL (`SAppWindowElement`).
- Les bonnes pratiques de Shopify pour la fenêtre : ne l'ouvrir que depuis une action explicite, définir
  le titre avec `s-page` dans le contenu de la fenêtre, ajouter `data-save-bar` à ses formulaires, et
  ramener le marchand à son point de départ à la fermeture
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- La fenêtre est affichée une fois qu'un enregistrement est choisi, car `src` est obligatoire.
- `@hide="reload"` actualise la liste après chaque fermeture. Shopify cite "updating UI state"
  parmi les usages de l'événement `hide` (`SAppWindowElement`).
- Le formulaire suit l'[exemple data-save-bar](/fr/app-bridge/save-bar#example-data-save-bar).
  Lorsqu'il contient des modifications non enregistrées, le `hide()` de la fenêtre demande au marchand avant de fermer.
- L'éditeur affiche les erreurs dans la page. Shopify ne dit pas quelles API App Bridge, comme
  le toast, fonctionnent à l'intérieur de la fenêtre.
- Shopify ne documente pas comment la route de la fenêtre ferme la fenêtre ou renvoie des données
  à votre page. La page peut atteindre la route via le `contentWindow` de l'élément
  ("use this to communicate with the iframe content via `postMessage()`"), uniquement lorsque la
  fenêtre est ouverte.

### Modifier une sélection en masse {#example-window-bulk-edit}

Utilisez ceci lorsque le marchand sélectionne des lignes et les modifie ensemble dans une vue plein écran.

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

- Shopify cite les éditeurs en masse parmi les usages de `src` (`SAppWindowAttributes`). La route est
  une page ordinaire de votre app, elle lit donc la sélection dans sa chaîne de requête.
- Après la fermeture de la fenêtre, `onHide` efface la sélection et recharge la liste.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si la fenêtre est affichée. Utilisez `v-model:open` pour rester synchronisé quand App Bridge ferme la fenêtre. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour l'élément de fenêtre d'app, utilisé pour connecter des boutons avec `commandFor` ou pour obtenir l'élément avec `document.getElementById()`. |
| `src` | `string` (obligatoire) | L'URL du contenu à afficher dans la fenêtre. Elle doit pointer vers une route de votre app qui rend le contenu de la fenêtre, et elle est chargée dans une iframe à l'ouverture de la fenêtre. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | La fenêtre s'est ouverte. |
| `hide` | `Event` | La fenêtre s'est fermée. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

`AppWindow` n'a pas de slot : `SAppWindowAttributes` ne définit aucun enfant.
