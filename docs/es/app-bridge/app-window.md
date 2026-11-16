---
title: "AppWindow (s-app-window) – App Bridge para Vue 3"
description: "AppWindow renderiza s-app-window de Shopify App Bridge, una ventana modal a pantalla completa en el admin de Shopify, en Vue 3: src es obligatorio y se abre con v-model:open."
---

# AppWindow {#app-window}

La [referencia de s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) de Shopify lo describe como una ventana modal a pantalla completa para flujos de trabajo complejos que necesitan un espacio de pantalla dedicado.

`AppWindow` renderiza `s-app-window`, que la documentación de `@shopify/app-bridge-types` describe como
"a fullscreen modal window in the Shopify admin". `src` es obligatorio: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` y el ocultado al desmontar funcionan igual que en [`Modal`](/es/app-bridge/modal).
No tiene slot.

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.

### Un editor a pantalla completa {#example-window-editor}

Úsalo para un editor que necesita toda la pantalla, abierto desde una lista de registros.

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

- `src` "debe apuntar a una ruta dentro de tu app", y "la URL se carga en un iframe cuando
  se abre la ventana" (`SAppWindowAttributes`). Cambiar `src` mientras la ventana está abierta
  la navega a la nueva URL (`SAppWindowElement`).
- Las buenas prácticas de Shopify para la ventana: ábrela solo desde una acción explícita, define el
  encabezado con `s-page` en el contenido de la ventana, añade `data-save-bar` a sus formularios y
  devuelve al comerciante al punto de partida al cerrar
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- La ventana se renderiza una vez elegido un registro, porque `src` es obligatorio.
- `@hide="reload"` actualiza la lista en cada cierre. Shopify lista "updating UI state"
  (actualizar el estado de la interfaz) como un uso del evento `hide` (`SAppWindowElement`).
- El formulario sigue el [ejemplo de data-save-bar](/es/app-bridge/save-bar#example-data-save-bar).
  Cuando tiene cambios sin guardar, el `hide()` de la ventana pregunta al comerciante antes de cerrar.
- El editor muestra los errores en la página. Shopify no dice qué APIs de App Bridge, como
  el toast, funcionan dentro de la ventana.
- Shopify no documenta cómo la ruta de la ventana cierra la ventana o envía datos de vuelta
  a tu página. La página puede llegar a la ruta mediante el `contentWindow` del elemento
  ("úsalo para comunicarte con el contenido del iframe mediante `postMessage()`"), solo mientras la
  ventana está abierta.

### Edición en lote de una selección {#example-window-bulk-edit}

Úsalo cuando el comerciante selecciona filas y las edita juntas en una vista a pantalla completa.

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
- Shopify menciona los editores en lote entre los usos de `src` (`SAppWindowAttributes`). La ruta es
  una página normal de tu app, así que lee la selección de su query string.
- Cuando se cierra la ventana, `onHide` borra la selección y recarga la lista.

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `open` | `boolean` | Si la ventana se muestra. Usa `v-model:open` para mantenerla sincronizada cuando App Bridge cierra la ventana. Por defecto: `false`. |
| `id` | `string` | Un identificador único para el elemento de ventana de la app, que se usa para conectar botones con `commandFor` o para obtener el elemento con `document.getElementById()`. |
| `src` | `string` (obligatorio) | La URL del contenido que se muestra en la ventana. Debe apuntar a una ruta de tu app que renderice el contenido de la ventana, y se carga en un iframe cuando la ventana se abre. |

### Events {#events}

| Event | Tipo | Descripción |
| --- | --- | --- |
| `show` | `Event` | La ventana se abrió. |
| `hide` | `Event` | La ventana se cerró. |
| `update:open` | `boolean` | Se emite después de `show` o `hide` cuando el nuevo estado difiere de `open`, para `v-model:open`. |

### Slots {#slots}

`AppWindow` no tiene slots: `SAppWindowAttributes` no define hijos.
