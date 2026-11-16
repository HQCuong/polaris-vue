---
title: "SaveBar (ui-save-bar) – App Bridge para Vue 3"
description: "SaveBar renderiza ui-save-bar de Shopify App Bridge en Vue 3, con v-model:open, los events show y hide y discardConfirmation. Para apps integradas de Shopify."
---

# SaveBar {#save-bar}

La barra de guardado indica que un formulario de la página actual tiene información sin guardar, como lo describe la [referencia de SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) de Shopify.

`SaveBar` renderiza `ui-save-bar`. Como describen los tipos de `ui-save-bar`, "the button with
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

`open`, `v-model:open`, `show`/`hide` y el ocultado al desmontar funcionan igual que en [`Modal`](/es/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") se establece como la propiedad `discardConfirmation` del elemento.

Para un formulario, el atributo `data-save-bar` de la
[guía de apps integradas](/es/guide/shopify-embedded-app#save-bar) no necesita ningún componente.

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.

### Página de ajustes con barra de guardado {#example-settings-form}

Úsalo en una página de ajustes cuyos campos son estado de Vue: la barra de guardado se muestra mientras el estado
difiere de lo último que se guardó.

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
- `dirty` es un `computed`, así que se enlaza con `:open`, no con `v-model:open`. Al guardar o
  descartar, `dirty` pasa a falso y `SaveBar` oculta la barra. El propio ejemplo de Shopify también
  oculta la barra en sus manejadores de guardar y descartar
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Añade el atributo `disabled` o `loading` a un botón para deshabilitarlo o mostrarlo como cargando
  en la barra de guardado" ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` y `''`/`undefined` añaden y quitan un atributo `loading` simple; un
  `:loading="false"` normal renderizaría `loading="false"`.
- `discard-confirmation` muestra un diálogo de confirmación cuando el comerciante hace clic en Discard.
- Shopify recomienda la [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  durante un guardado asíncrono ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Un composable reutilizable para formularios modificados {#example-use-dirty-form}

Úsalo cuando varias páginas necesitan la misma lógica de guardar y descartar.

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

- Dale a la `SaveBar` de cada página su propio `id`.
- El composable solo contiene estado de Vue. Las partes de App Bridge se quedan en el componente:
  `SaveBar`, el toast y los atributos `loading` y `disabled` de los botones.

### Preguntar antes de salir con Vue Router {#example-leave-confirmation}

Úsalo en una página de edición que el comerciante puede abandonar con enlaces de la app o con `router.push()`.

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
- Mientras se muestra la barra de guardado, los enlaces del admin no se abren. Si tu app cambia su propia
  ruta, la barra de direcciones del admin conserva la página anterior, y al recargar se abre esa. El
  `push()` de Vue Router cuenta como cambio de ruta
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Los dos casos de Shopify: si el comerciante debe decidir, espera a
  `shopify.saveBar.leaveConfirmation()`; si la navegación termina la edición, espera primero a
  `shopify.saveBar.hide(id)`. El guard de arriba también oculta la barra después de que el comerciante
  confirme, para que la barra desaparezca antes de que cambie la ruta.
- `leaveConfirmation()` "se resuelve cuando el comerciante confirma o cuando no hay ninguna barra de guardado
  visible". Shopify no dice qué pasa cuando el comerciante decide quedarse; el guard
  sigue esperando entonces, y una navegación posterior lo reemplaza.
- `SaveBar` oculta la barra al desmontarse, pero eso ocurre después del cambio de ruta. Shopify:
  "No confíes en quitar el elemento `<ui-save-bar>` o el formulario de la página para ocultar la
  barra de guardado."

### Un formulario con data-save-bar {#example-data-save-bar}

Úsalo cuando las ediciones son campos de un solo formulario: App Bridge hace el seguimiento de los campos por sí mismo y no hace falta
`SaveBar`.

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
- El evento `submit` se dispara cuando el comerciante hace clic en Save y el evento `reset` cuando
  hace clic en Discard. `data-discard-confirmation` añade una confirmación antes de Discard
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge compara cada campo con su valor guardado: el valor anterior a la primera
  edición del comerciante. Ignora los valores que establece tu código, así que los valores cargados en `onMounted`
  no muestran la barra. Tras `submit`, los valores actuales pasan a ser los valores guardados y la
  barra se oculta
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Si tu solicitud falla después, la barra ya está oculta, así que el toast de error es la
  única señal para el comerciante.
- `@reset` copia los valores guardados de vuelta al estado de Vue. Sin él, `v-model` conservaría
  los valores descartados.
- Cuál usar: `data-save-bar` para un formulario estándar, `SaveBar` (`ui-save-bar`) para estado
  "que no está ligado a un solo formulario". Shopify: "Elige un enfoque u otro. No
  combines `data-save-bar` con métodos programáticos en la misma página"
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Valores que establece tu código {#example-code-set-values}

Úsalo cuando el valor de un formulario viene del código en lugar de escribirse, como un producto elegido en
el selector de recursos.

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
- Este es el ejemplo "Controlled inputs" de Shopify en Vue: un input oculto lleva el estado
  y un evento `input` que burbujea hace que App Bridge vuelva a comprobar el formulario
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Cuando tu código establece valores que ya están guardados (por ejemplo "Reset to defaults", que
  guarda al instante), Shopify dice que llames en su lugar a `requestSubmit()` del formulario: el evento `submit`
  los convierte en los valores guardados
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- El selector de recursos devuelve `undefined` cuando el comerciante cancela, así que `picked?.[0]` es
  `undefined` y no cambia nada.

### Barra de guardado en un AppWindow {#example-save-bar-in-app-window}

Úsalo para un editor que se abre en un [`AppWindow`](/es/app-bridge/app-window).

Pon `data-save-bar` en un formulario de la ruta de la ventana, como en el
[ejemplo del editor a pantalla completa](/es/app-bridge/app-window#example-window-editor). Shopify: "No uses
un `<ui-save-bar>` en la página padre para mostrarlo desde dentro de la ventana: esa barra pertenece a la
página padre, así que aparece detrás de la ventana y los comerciantes no pueden ver ni hacer clic en Save ni
Discard" ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
El `hide()` de la ventana pregunta al comerciante antes de cerrar cuando un formulario así tiene cambios sin guardar
(`SAppWindowElement`).

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `open` | `boolean` | Si la barra de guardado se muestra. Usa `v-model:open` para mantenerla sincronizada cuando App Bridge oculta la barra de guardado. Por defecto: `false`. |
| `id` | `string` | Un identificador único para la barra de guardado. |
| `discardConfirmation` | `boolean` | Si se muestra un diálogo de confirmación al hacer clic en el botón de descartar. `SaveBar` lo establece como la propiedad `discardConfirmation` del elemento. |

### Events {#events}

| Event | Tipo | Descripción |
| --- | --- | --- |
| `show` | `Event` | La barra de guardado se mostró. |
| `hide` | `Event` | La barra de guardado se ocultó. |
| `update:open` | `boolean` | Se emite después de `show` o `hide` cuando el nuevo estado difiere de `open`, para `v-model:open`. |

### Slots {#slots}

| Slot | Descripción |
| --- | --- |
| `default` | Un `<button variant="primary">`, que es el botón Guardar, y un `<button>` sin variante, que es el botón Descartar. Los tipos también indican `disabled` y `loading` para estos botones. |
