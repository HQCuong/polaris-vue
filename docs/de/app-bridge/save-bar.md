---
title: "SaveBar (ui-save-bar) – App Bridge für Vue 3"
description: "SaveBar rendert ui-save-bar von Shopify App Bridge in Vue 3, mit v-model:open, den Events show und hide und discardConfirmation. Für eingebettete Shopify-Apps."
---

# SaveBar {#save-bar}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install); zu `open` siehe [Modal](/de/app-bridge/modal).

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

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") wird als Property `discardConfirmation` des Elements gesetzt.

Für ein Formular braucht das Attribut `data-save-bar` aus der
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#save-bar) keine Komponente.

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
