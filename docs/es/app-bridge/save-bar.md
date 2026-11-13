---
title: SaveBar
description: "SaveBar renderiza ui-save-bar. Como describen los tipos de ui-save-bar, \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install); para `open`, consulta [Modal](/es/app-bridge/modal).

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
