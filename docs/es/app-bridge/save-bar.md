---
title: "SaveBar (ui-save-bar) – App Bridge para Vue 3"
description: "SaveBar renderiza ui-save-bar de Shopify App Bridge en Vue 3, con v-model:open, los events show y hide y discardConfirmation. Para apps integradas de Shopify."
---

# SaveBar {#save-bar}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install); para `open`, consulta [Modal](/es/app-bridge/modal).

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

`open`, `v-model:open`, `show`/`hide` y el ocultado al desmontar funcionan igual que en `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") se establece como la propiedad `discardConfirmation` del elemento.

Para un formulario, el atributo `data-save-bar` de la
[guía de apps integradas](/es/guide/shopify-embedded-app#save-bar) no necesita ningún componente.

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
