---
title: SaveBar
description: "SaveBar rendert ui-save-bar. Wie die Typen von ui-save-bar beschreiben: \"the button with variant primary is the Save button and the button without a variant is the Discard button\"."
---

# SaveBar {#save-bar}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install); zu `open` siehe [Modal](/de/app-bridge/modal).

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

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") wird als Property `discardConfirmation` des Elements gesetzt.

Für ein Formular braucht das Attribut `data-save-bar` aus der
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#save-bar) keine Komponente.
