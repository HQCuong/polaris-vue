---
title: "SaveBar (ui-save-bar) – App Bridge pour Vue 3"
description: "SaveBar génère ui-save-bar de Shopify App Bridge en Vue 3, avec v-model:open, les events show et hide et discardConfirmation. Pour les apps Shopify intégrées."
---

# SaveBar {#save-bar}

La barre d'enregistrement indique qu'un formulaire de la page actuelle contient des informations non enregistrées, comme le décrit la [référence SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) de Shopify.

`SaveBar` génère `ui-save-bar`. Comme le décrivent les types de `ui-save-bar` : "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button" :

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SaveBar } from 'polaris-vue-elements/app-bridge'

const dirty = ref(false)

function save(): void {
  dirty.value = false
}
function discard(): void {
  dirty.value = false
}
</script>

<template>
  <SaveBar id="settings-save-bar" v-model:open="dirty" discard-confirmation>
    <button variant="primary" @click="save">Save</button>
    <button @click="discard">Discard</button>
  </SaveBar>
</template>
```

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour [`Modal`](/fr/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") est défini comme propriété `discardConfirmation` de l'élément.

Pour un formulaire, l'attribut `data-save-bar` du
[guide de l'app intégrée](/fr/guide/shopify-embedded-app#save-bar) n'a besoin d'aucun composant.

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.

### Page de paramètres avec une barre d'enregistrement {#example-settings-form}

Utilisez ceci pour une page de paramètres dont les champs sont un état Vue : la barre d'enregistrement s'affiche tant que l'état
diffère de la dernière version enregistrée.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SCheckbox, SPage, SSection, SStack, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Settings {
  title: string
  enabled: boolean
}

const saved = ref<Settings>({ title: '', enabled: true })
const form = ref<Settings>({ ...saved.value })
const saving = ref(false)

const dirty = computed(
  () => form.value.title !== saved.value.title || form.value.enabled !== saved.value.enabled,
)

onMounted(async () => {
  const res = await fetch('/api/settings')
  if (!res.ok) return
  saved.value = (await res.json()) as Settings
  form.value = { ...saved.value }
})

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  const values = { ...form.value }
  saving.value = true
  shopify.loading(true)
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
    shopify.loading(false)
  }
}

function discard(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Settings">
    <SaveBar id="settings-save-bar" :open="dirty" discard-confirmation>
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="save">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="form.title" label="Title" />
        <SCheckbox v-model="form.enabled" label="Enabled" />
      </SStack>
    </SSection>
  </SPage>
</template>
```

- `dirty` est un `computed`, il est donc lié avec `:open`, pas `v-model:open`. Enregistrer ou
  abandonner rend `dirty` faux, et `SaveBar` masque la barre. L'exemple de Shopify
  masque aussi la barre dans ses gestionnaires d'enregistrement et d'abandon
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Add the `disabled` or `loading` attribute to a button to disable it or show it as loading
  in the save bar" ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` et `''`/`undefined` ajoutent et retirent un attribut `loading` nu ; un simple
  `:loading="false"` produirait `loading="false"`.
- `discard-confirmation` affiche une boîte de dialogue de confirmation lorsque le marchand clique sur Discard.
- Shopify recommande la [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  pendant un enregistrement asynchrone ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Un composable réutilisable pour formulaire modifié {#example-use-dirty-form}

Utilisez ceci lorsque plusieurs pages ont besoin de la même logique d'enregistrement et d'abandon.

::: code-group

```ts [useDirtyForm.ts]
import { computed, ref, type ComputedRef, type Ref } from 'vue'

export interface DirtyForm<T> {
  /** The values that the form edits. */
  values: Ref<T>
  /** True while `values` differs from the last saved values. */
  dirty: ComputedRef<boolean>
  saving: Ref<boolean>
  /** Sets new saved values, for example after loading them. */
  load: (next: T) => void
  /** Restores the last saved values. */
  discard: () => void
  /** Runs `persist` and, if it resolves, makes the values the saved values. */
  save: (persist: (values: T) => Promise<void>) => Promise<void>
}

// Works for JSON values (strings, numbers, booleans, arrays and plain objects).
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function useDirtyForm<T>(initial: T): DirtyForm<T> {
  const saved = ref(clone(initial)) as Ref<T>
  const values = ref(clone(initial)) as Ref<T>
  const saving = ref(false)
  const dirty = computed(() => JSON.stringify(values.value) !== JSON.stringify(saved.value))

  function load(next: T): void {
    saved.value = clone(next)
    values.value = clone(next)
  }

  function discard(): void {
    values.value = clone(saved.value)
  }

  async function save(persist: (values: T) => Promise<void>): Promise<void> {
    if (saving.value) return
    const snapshot = clone(values.value)
    saving.value = true
    try {
      await persist(snapshot)
      saved.value = snapshot
    } finally {
      saving.value = false
    }
  }

  return { values, dirty, saving, load, discard, save }
}
```

```vue [ShippingSettings.vue]
<script setup lang="ts">
import { onMounted } from 'vue'
import { SNumberField, SPage, SSection } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { useDirtyForm } from './useDirtyForm'

// Field values are strings, as s-number-field's value is.
const { values, dirty, saving, load, discard, save } = useDirtyForm({
  freeShippingOver: '50',
  handlingDays: '2',
})

onMounted(async () => {
  const res = await fetch('/api/shipping-settings')
  if (res.ok) load((await res.json()) as typeof values.value)
})

async function onSave(): Promise<void> {
  const shopify = useAppBridge()
  try {
    await save(async (next) => {
      const res = await fetch('/api/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    })
    shopify.toast.show('Shipping settings saved')
  } catch {
    shopify.toast.show('Could not save shipping settings', { isError: true })
  }
}
</script>

<template>
  <SPage heading="Shipping">
    <SaveBar id="shipping-save-bar" :open="dirty">
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="onSave">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Rates">
      <SNumberField v-model="values.freeShippingOver" label="Free shipping over" :min="0" />
      <SNumberField v-model="values.handlingDays" label="Handling days" :min="0" />
    </SSection>
  </SPage>
</template>
```

:::

- Donnez à la `SaveBar` de chaque page son propre `id`.
- Le composable ne contient que l'état Vue. Les parties App Bridge restent dans le composant :
  `SaveBar`, le toast, et les attributs `loading` et `disabled` des boutons.

### Demander avant de quitter avec Vue Router {#example-leave-confirmation}

Utilisez ceci sur une page d'édition que le marchand peut quitter avec des liens de l'app ou `router.push()`.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { SButton, SPage, SSection, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const SAVE_BAR_ID = 'product-save-bar'

const props = defineProps<{ productId: string }>()
const router = useRouter()

const saved = ref({ title: '' })
const title = ref('')
const dirty = computed(() => title.value !== saved.value.title)
const url = computed(() => `/api/products/${encodeURIComponent(props.productId)}`)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as { title: string }
  title.value = saved.value.title
})

async function save(): Promise<void> {
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value }),
  })
  if (res.ok) saved.value = { title: title.value }
}

// The merchant decides: wait for the confirmation, then hide the bar before the
// route changes.
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  const shopify = useAppBridge()
  await shopify.saveBar.leaveConfirmation()
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  return true
})

// The navigation ends the edit: hide the bar first, then navigate.
async function deleteProduct(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch(url.value, { method: 'DELETE' })
  if (!res.ok) {
    shopify.toast.show('Could not delete the product', { isError: true })
    return
  }
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  shopify.toast.show('Product deleted')
  await router.push('/products')
}
</script>

<template>
  <SPage heading="Edit product">
    <SaveBar :id="SAVE_BAR_ID" :open="dirty">
      <button variant="primary" @click="save">Save</button>
      <button @click="title = saved.title">Discard</button>
    </SaveBar>
    <SSection>
      <STextField v-model="title" label="Title" />
      <SButton tone="critical" @click="deleteProduct">Delete product</SButton>
    </SSection>
  </SPage>
</template>
```

- Tant que la barre d'enregistrement est affichée, les liens de l'admin ne s'ouvrent pas. Si votre app change sa propre
  route, la barre d'adresse de l'admin garde la page précédente, et un rechargement l'ouvre. Le
  `push()` de Vue Router compte comme un changement de route
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Les deux cas de Shopify : si le marchand doit décider, attendez
  `shopify.saveBar.leaveConfirmation()` ; si la navigation met fin à l'édition, attendez d'abord
  `shopify.saveBar.hide(id)`. La garde ci-dessus masque aussi la barre une fois que le marchand
  a confirmé, afin que la barre ait disparu avant le changement de route.
- `leaveConfirmation()` "resolves when the merchant confirms or when no save bar is
  visible". Shopify ne dit pas ce qui se passe lorsque le marchand choisit de rester ; la garde
  continue alors d'attendre, et une navigation ultérieure la remplace.
- `SaveBar` masque la barre lorsqu'il est démonté, mais c'est après le changement de route. Shopify :
  "Don't rely on removing the `<ui-save-bar>` element or the form from the page to hide the
  save bar."

### Un formulaire avec data-save-bar {#example-data-save-bar}

Utilisez ceci lorsque les modifications portent sur les champs d'un seul formulaire : App Bridge suit lui-même les champs, et aucune
`SaveBar` n'est nécessaire.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Profile {
  storeName: string
  description: string
}

const saved = ref<Profile>({ storeName: '', description: '' })
const form = ref<Profile>({ ...saved.value })

onMounted(async () => {
  const res = await fetch('/api/profile')
  if (!res.ok) return
  saved.value = (await res.json()) as Profile
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const values = { ...form.value }
  shopify.loading(true)
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Profile saved')
  } catch {
    shopify.toast.show('Could not save the profile', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Store profile">
    <form data-save-bar data-discard-confirmation @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.storeName" label="Store name" name="storeName" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="4" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

- L'événement `submit` se déclenche lorsque le marchand clique sur Save et l'événement `reset` lorsqu'il
  clique sur Discard. `data-discard-confirmation` ajoute une confirmation avant Discard
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge compare chaque champ à sa valeur enregistrée : la valeur avant la
  première modification du marchand. Il ignore les valeurs que votre code définit, donc les valeurs chargées dans `onMounted`
  n'affichent pas la barre. Après `submit`, les valeurs actuelles deviennent les valeurs enregistrées et la
  barre se masque
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Si votre requête échoue ensuite, la barre est déjà masquée, donc le toast d'erreur est le seul
  signal pour le marchand.
- `@reset` recopie les valeurs enregistrées dans l'état Vue. Sans lui, `v-model` conserverait
  les valeurs abandonnées.
- Lequel utiliser : `data-save-bar` pour un formulaire standard, `SaveBar` (`ui-save-bar`) pour un état
  "that isn't tied to a single form". Shopify : "Choose one approach or the other. Don't
  combine `data-save-bar` with programmatic methods on the same page"
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Valeurs définies par votre code {#example-code-set-values}

Utilisez ceci lorsqu'une valeur de formulaire vient du code plutôt que d'une saisie, comme un produit choisi dans
le sélecteur de ressources.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SButton, SClickableChip, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface FeaturedProduct {
  id: string
  title: string
}

const saved = ref<FeaturedProduct | null>(null)
const selected = ref<FeaturedProduct | null>(null)
const hiddenInput = ref<HTMLInputElement | null>(null)

// App Bridge ignores values that code sets, so tell it with a native input event.
watch(
  selected,
  (product) => {
    const input = hiddenInput.value
    const next = product?.id ?? ''
    if (!input || input.value === next) return
    input.value = next
    input.dispatchEvent(new Event('input', { bubbles: true }))
  },
  { flush: 'post' },
)

async function pick(): Promise<void> {
  const picked = await useAppBridge().resourcePicker({ type: 'product', action: 'select' })
  const product = picked?.[0]
  if (product) selected.value = { id: product.id, title: product.title }
}

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch('/api/featured-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: selected.value?.id ?? null }),
  })
  if (res.ok) {
    saved.value = selected.value
    shopify.toast.show('Featured product saved')
  } else {
    shopify.toast.show('Could not save the featured product', { isError: true })
  }
}

function onReset(): void {
  selected.value = saved.value
}
</script>

<template>
  <SPage heading="Storefront">
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <input ref="hiddenInput" type="hidden" name="productId" />
      <SSection heading="Featured product">
        <SClickableChip v-if="selected" removable @remove="selected = null">
          {{ selected.title }}
        </SClickableChip>
        <SButton v-else @click="pick">Select product</SButton>
      </SSection>
    </form>
  </SPage>
</template>
```

- Il s'agit de l'exemple "Controlled inputs" de Shopify en Vue : un champ masqué porte l'état,
  et un événement `input` qui remonte (bubbles) fait revérifier le formulaire par App Bridge
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Lorsque votre code définit des valeurs déjà enregistrées (par exemple "Reset to defaults" qui
  enregistre immédiatement), Shopify indique d'appeler plutôt `requestSubmit()` sur le formulaire : l'événement `submit`
  en fait les valeurs enregistrées
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- Le sélecteur de ressources renvoie `undefined` lorsque le marchand annule, donc `picked?.[0]` vaut
  `undefined` et rien ne change.

### Barre d'enregistrement dans une AppWindow {#example-save-bar-in-app-window}

Utilisez ceci pour un éditeur qui s'ouvre dans une [`AppWindow`](/fr/app-bridge/app-window).

Placez `data-save-bar` sur un formulaire dans la route de la fenêtre, comme dans l'
[exemple d'éditeur plein écran](/fr/app-bridge/app-window#example-window-editor). Shopify : "Don't use
a `<ui-save-bar>` on the parent page and show it from inside the window: that bar belongs to
the parent page, so it appears behind the window and merchants can't see or click Save or
Discard" ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
Le `hide()` de la fenêtre demande au marchand avant de fermer lorsqu'un tel formulaire contient des modifications non enregistrées
(`SAppWindowElement`).

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si la barre d'enregistrement est affichée. Utilisez `v-model:open` pour rester synchronisé quand App Bridge masque la barre d'enregistrement. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour la barre d'enregistrement. |
| `discardConfirmation` | `boolean` | Indique s'il faut afficher une boîte de dialogue de confirmation quand on clique sur le bouton d'abandon. `SaveBar` la définit comme propriété `discardConfirmation` de l'élément. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | La barre d'enregistrement a été affichée. |
| `hide` | `Event` | La barre d'enregistrement a été masquée. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Un `<button variant="primary">`, qui est le bouton Enregistrer, et un `<button>` sans variante, qui est le bouton Abandonner. Les types listent aussi `disabled` et `loading` pour ces boutons. |
