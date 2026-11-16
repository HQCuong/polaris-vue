---
title: "SaveBar (ui-save-bar) – App Bridge für Vue 3"
description: "SaveBar rendert ui-save-bar von Shopify App Bridge in Vue 3, mit v-model:open, den Events show und hide und discardConfirmation. Für eingebettete Shopify-Apps."
---

# SaveBar {#save-bar}

Die Speicherleiste zeigt an, dass ein Formular auf der aktuellen Seite ungespeicherte Informationen enthält, wie Shopifys [SaveBar-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) es beschreibt.

`SaveBar` rendert `ui-save-bar`. Wie die Typen von `ui-save-bar` beschreiben: "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button":

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

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei [`Modal`](/de/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") wird als Property `discardConfirmation` des Elements gesetzt.

Für ein Formular braucht das Attribut `data-save-bar` aus der
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#save-bar) keine Komponente.

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.

### Einstellungsseite mit Speicherleiste {#example-settings-form}

Verwenden Sie dies für eine Einstellungsseite, deren Felder Vue-Zustand sind: Die Speicherleiste wird angezeigt, solange sich der Zustand
vom zuletzt gespeicherten unterscheidet.

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

- `dirty` ist ein `computed` und wird daher mit `:open` gebunden, nicht mit `v-model:open`. Speichern oder
  Verwerfen macht `dirty` false, und `SaveBar` blendet die Leiste aus. Auch Shopifys eigenes Beispiel
  blendet die Leiste in seinen Handlern für Speichern und Verwerfen aus
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Fügen Sie einem Button das Attribut `disabled` oder `loading` hinzu, um ihn in der Speicherleiste zu deaktivieren
  oder als ladend darzustellen" ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` und `''`/`undefined` fügen ein bloßes Attribut `loading` hinzu und entfernen es; ein einfaches
  `:loading="false"` würde `loading="false"` rendern.
- `discard-confirmation` zeigt einen Bestätigungsdialog, wenn der Händler auf Verwerfen klickt.
- Shopify empfiehlt die [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  während eines asynchronen Speicherns ([Best Practices zur Speicherleiste](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Ein wiederverwendbares Composable für ungespeicherte Formulare {#example-use-dirty-form}

Verwenden Sie dies, wenn mehrere Seiten dieselbe Speichern- und Verwerfen-Logik brauchen.

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

- Geben Sie der `SaveBar` jeder Seite eine eigene `id`.
- Das Composable enthält nur Vue-Zustand. Die App-Bridge-Teile bleiben in der Komponente:
  `SaveBar`, der Toast sowie die Attribute `loading` und `disabled` der Buttons.

### Vor dem Verlassen mit Vue Router nachfragen {#example-leave-confirmation}

Verwenden Sie dies auf einer Bearbeitungsseite, die der Händler über In-App-Links oder `router.push()` verlassen kann.

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

- Solange die Speicherleiste angezeigt wird, öffnen Links im Adminbereich nicht. Wechselt Ihre App ihre eigene
  Route, behält die Adressleiste des Adminbereichs die vorherige Seite, und ein Neuladen öffnet sie. Das
  `push()` von Vue Router zählt als Routenwechsel
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Shopifys zwei Fälle: Soll der Händler entscheiden, warten Sie auf
  `shopify.saveBar.leaveConfirmation()`; beendet die Navigation die Bearbeitung, warten Sie zuerst auf
  `shopify.saveBar.hide(id)`. Der Guard oben blendet die Leiste außerdem aus, nachdem der Händler
  bestätigt hat, damit die Leiste verschwunden ist, bevor die Route wechselt.
- `leaveConfirmation()` "wird aufgelöst, wenn der Händler bestätigt oder wenn keine Speicherleiste
  sichtbar ist". Shopify sagt nicht, was passiert, wenn der Händler sich fürs Bleiben entscheidet; der Guard
  wartet dann weiter, und eine spätere Navigation ersetzt ihn.
- `SaveBar` blendet die Leiste beim Unmount aus, aber das geschieht nach dem Routenwechsel. Shopify:
  "Verlassen Sie sich nicht darauf, das Element `<ui-save-bar>` oder das Formular von der Seite zu entfernen, um die
  Speicherleiste auszublenden."

### Ein Formular mit data-save-bar {#example-data-save-bar}

Verwenden Sie dies, wenn die Änderungen Felder eines einzigen Formulars sind: App Bridge verfolgt die Felder selbst, und es
braucht keine `SaveBar`.

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

- Das Event `submit` wird ausgelöst, wenn der Händler auf Speichern klickt, und das Event `reset`, wenn er
  auf Verwerfen klickt. `data-discard-confirmation` fügt vor dem Verwerfen eine Bestätigung hinzu
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge vergleicht jedes Feld mit seinem gespeicherten Wert: dem Wert vor der ersten Änderung
  des Händlers. Werte, die Ihr Code setzt, ignoriert es, daher lösen die in `onMounted` geladenen Werte
  die Leiste nicht aus. Nach `submit` werden die aktuellen Werte zu den gespeicherten Werten, und die
  Leiste wird ausgeblendet
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Schlägt Ihre Anfrage danach fehl, ist die Leiste schon ausgeblendet, sodass der Fehler-Toast das
  einzige Signal für den Händler ist.
- `@reset` kopiert die gespeicherten Werte zurück in den Vue-Zustand. Ohne es würde `v-model`
  die verworfenen Werte behalten.
- Was Sie wann verwenden: `data-save-bar` für ein Standardformular, `SaveBar` (`ui-save-bar`) für Zustand,
  "der nicht an ein einzelnes Formular gebunden ist". Shopify: "Wählen Sie den einen oder den anderen Ansatz. Kombinieren Sie
  `data-save-bar` nicht mit programmatischen Methoden auf derselben Seite"
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Werte, die Ihr Code setzt {#example-code-set-values}

Verwenden Sie dies, wenn ein Formularwert aus dem Code statt aus einer Eingabe stammt, etwa ein Produkt, das im
Resource Picker gewählt wurde.

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

- Das ist Shopifys Beispiel "Controlled inputs" in Vue: Ein verstecktes Input trägt den Zustand,
  und ein aufsteigendes `input`-Event lässt App Bridge das Formular erneut prüfen
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Setzt Ihr Code Werte, die bereits gespeichert sind (zum Beispiel "Auf Standard zurücksetzen", das
  sofort speichert), sagt Shopify, rufen Sie stattdessen `requestSubmit()` des Formulars auf: Das Event `submit`
  macht sie zu den gespeicherten Werten
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- Der Resource Picker gibt `undefined` zurück, wenn der Händler abbricht, daher ist `picked?.[0]`
  `undefined`, und es ändert sich nichts.

### Speicherleiste in einem AppWindow {#example-save-bar-in-app-window}

Verwenden Sie dies für einen Editor, der in einem [`AppWindow`](/de/app-bridge/app-window) geöffnet wird.

Setzen Sie `data-save-bar` auf ein Formular in der Route des Fensters, wie im
[Vollbild-Editor-Beispiel](/de/app-bridge/app-window#example-window-editor). Shopify: "Verwenden Sie keine
`<ui-save-bar>` auf der übergeordneten Seite, um sie aus dem Fenster heraus anzuzeigen: Diese Leiste gehört zur
übergeordneten Seite, erscheint also hinter dem Fenster, und Händler können Speichern oder
Verwerfen weder sehen noch anklicken" ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
`hide()` des Fensters fragt den Händler vor dem Schließen, wenn ein solches Formular ungespeicherte Änderungen hat
(`SAppWindowElement`).

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `open` | `boolean` | Ob die Speicherleiste angezeigt wird. Verwenden Sie `v-model:open`, um sie synchron zu halten, wenn App Bridge die Speicherleiste ausblendet. Standard: `false`. |
| `id` | `string` | Eine eindeutige Kennung für die Speicherleiste. |
| `discardConfirmation` | `boolean` | Ob ein Bestätigungsdialog angezeigt wird, wenn auf die Verwerfen-Schaltfläche geklickt wird. `SaveBar` setzt dies als Property `discardConfirmation` des Elements. |

### Events {#events}

| Event | Typ | Beschreibung |
| --- | --- | --- |
| `show` | `Event` | Die Speicherleiste wurde angezeigt. |
| `hide` | `Event` | Die Speicherleiste wurde ausgeblendet. |
| `update:open` | `boolean` | Wird nach `show` oder `hide` emittiert, wenn der neue Zustand von `open` abweicht, für `v-model:open`. |

### Slots {#slots}

| Slot | Beschreibung |
| --- | --- |
| `default` | Ein `<button variant="primary">`, die Speichern-Schaltfläche, und ein `<button>` ohne Variante, die Verwerfen-Schaltfläche. Die Typen nennen für diese Schaltflächen außerdem `disabled` und `loading`. |
