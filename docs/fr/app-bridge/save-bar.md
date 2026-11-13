---
title: SaveBar
description: "SaveBar génère ui-save-bar. Comme le décrivent les types de ui-save-bar : \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install) ; pour `open`, consultez [Modal](/fr/app-bridge/modal).

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

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") est défini comme propriété `discardConfirmation` de l'élément.

Pour un formulaire, l'attribut `data-save-bar` du
[guide de l'app intégrée](/fr/guide/shopify-embedded-app#save-bar) n'a besoin d'aucun composant.
