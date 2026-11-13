---
title: SaveBar
description: "SaveBar renderiza ui-save-bar. Como descrevem os tipos de ui-save-bar, \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Antes de começar, veja [Instalação](/pt/app-bridge/#install); para `open`, veja [Modal](/pt/app-bridge/modal).

`SaveBar` renderiza `ui-save-bar`. Como descrevem os tipos de `ui-save-bar`, "the button with
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

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") é definido como a propriedade `discardConfirmation` do elemento.

Para um formulário, o atributo `data-save-bar` do
[guia de apps incorporados](/pt/guide/shopify-embedded-app#save-bar) não precisa de componente.
