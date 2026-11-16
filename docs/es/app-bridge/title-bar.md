---
title: "TitleBar (ui-title-bar) – App Bridge para Vue 3"
description: "TitleBar renderiza ui-title-bar de Shopify App Bridge en Vue 3, con title como atributo; en un Modal define el encabezado y el pie. Para apps integradas de Shopify."
---

# TitleBar {#title-bar}

La barra de título aparece en la parte superior de tu app en el admin de Shopify; la [referencia de TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) de Shopify describe cómo personalizarla.

`TitleBar` renderiza `ui-title-bar`, con `title` como atributo. En un `Modal` define el
encabezado y el pie del modal. Sus hijos son elementos `<button>` y `<a>`; los tipos de
`ui-title-bar` permiten `variant="primary"` o `variant="breadcrumb"`,
`tone="critical"` y grupos `<section label="...">`. Para la barra de título de la página, Shopify
documenta ahora [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que es [`SPage`](/es/components/s-page).

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.

### Título y acciones en un modal {#example-title-bar-in-modal}

Úsalo para dar a un modal su encabezado y sus botones de pie, aquí para una acción en lote cuyo
título cuenta la selección.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ selectedIds: string[] }>()

const open = ref(false)
const publishing = ref(false)
const title = computed(() => {
  const n = props.selectedIds.length
  return `Publish ${n} ${n === 1 ? 'product' : 'products'}?`
})

async function publish(): Promise<void> {
  if (publishing.value) return
  const shopify = useAppBridge()
  publishing.value = true
  try {
    const res = await fetch('/api/products/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: props.selectedIds }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Products published')
  } catch {
    shopify.toast.show('Could not publish the products', { isError: true })
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton :disabled="selectedIds.length === 0" @click="open = true">Publish</SButton>
  <Modal id="publish-modal" v-model:open="open">
    <p>The products become visible on your online store.</p>
    <TitleBar :title="title">
      <button variant="primary" @click="publish">Publish</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```
- En un modal, `TitleBar` define el encabezado y el pie del modal. Como en el ejemplo "Simple form" de Shopify,
  el botón principal tiene `variant="primary"` y Cancel no tiene variante
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Los manejadores de clic de los botones se ejecutan en tu página, así que `publish` puede mostrar el toast.
- Para una acción destructiva, añade `tone="critical"` al botón principal, como en el
  [ejemplo de confirmación de eliminación](/es/app-bridge/modal#example-confirm-delete).
- El título se calcula a partir de la selección antes de que se abra el modal. No se ha verificado si App Bridge
  detecta un título que cambia mientras el modal está abierto.

### La barra de título de la página con s-page {#example-page-title-bar}

Úsalo para la barra de título de una página. Shopify ahora la configura con `s-page`, no con
`ui-title-bar`.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBadge, SButton, SLink, SMenu, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  title: string
  status: 'ACTIVE' | 'DRAFT'
}

const props = defineProps<{ productId: string }>()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}`)
  if (res.ok) product.value = (await res.json()) as Product
})

function save(): void {
  useAppBridge().toast.show('Product saved')
}
</script>

<template>
  <SPage :heading="product?.title ?? 'Product'">
    <template #breadcrumb-actions>
      <SLink href="/products">Products</SLink>
    </template>
    <template #accessory>
      <SBadge v-if="product?.status === 'DRAFT'" tone="warning">Draft</SBadge>
    </template>
    <template #primary-action>
      <SButton variant="primary" @click="save">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton commandFor="product-more-actions">More actions</SButton>
    </template>
    <SMenu id="product-more-actions">
      <SButton>Duplicate</SButton>
      <SButton tone="critical">Delete</SButton>
    </SMenu>
    <SSection heading="Details">…</SSection>
  </SPage>
</template>
```
- La página de la barra de título de Shopify documenta los slots `breadcrumb-actions`, `accessory`,
  `primary-action` y `secondary-actions` de `s-page`, un menú que se abre con
  `commandFor` y "solo una acción principal" por página
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` sigue al registro cargado, así que la barra de título nombra el producto.
- Los tipos de `ui-title-bar` también permiten botones y enlaces con `variant="breadcrumb"` y
  grupos `<section label="...">`. Las páginas actuales de Shopify no describen su aspecto, así que
  esta página no tiene ejemplo de ellos.

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `title` | `string` | El título de la barra de título. También se puede establecer con `document.title`. `TitleBar` siempre lo establece como atributo. |

`TitleBar` no emite eventos.

### Slots {#slots}

| Slot | Descripción |
| --- | --- |
| `default` | Elementos `<button>` y `<a>`, y grupos `<section>` de ellos, como se indica abajo. |

Los tipos de `ui-title-bar` describen estos hijos:

| Hijo | Atributos |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Los tipos señalan que los elementos anchor no son compatibles con Remix, donde se puede usar en su lugar el componente `<Link>` de Remix. |
| `<section>` | `label`: `string`. Sus hijos son elementos `<a>` y `<button>`. |

En estos tipos, `<button>` y `<a>` también aceptan `id`, `name`, `class`, `href`, `rel`, `target` y `onclick`.
