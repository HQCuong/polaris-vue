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

`shopify.modal.show(id)` y `shopify.modal.hide(id)` también funcionan con el `id`.

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
