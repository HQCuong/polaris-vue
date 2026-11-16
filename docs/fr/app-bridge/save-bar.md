---
title: "SaveBar (ui-save-bar) – App Bridge pour Vue 3"
description: "SaveBar génère ui-save-bar de Shopify App Bridge en Vue 3, avec v-model:open, les events show et hide et discardConfirmation. Pour les apps Shopify intégrées."
---

# SaveBar {#save-bar}

La barre d'enregistrement indique qu'un formulaire de la page actuelle contient des informations non enregistrées, comme le décrit la [référence SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) de Shopify.

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

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour [`Modal`](/fr/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") est défini comme propriété `discardConfirmation` de l'élément.

Pour un formulaire, l'attribut `data-save-bar` du
[guide de l'app intégrée](/fr/guide/shopify-embedded-app#save-bar) n'a besoin d'aucun composant.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si la barre d'enregistrement est affichée. Utilisez `v-model:open` pour rester synchronisé quand App Bridge masque la barre d'enregistrement. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour la barre d'enregistrement. |
| `discardConfirmation` | `boolean` | Indique s'il faut afficher une boîte de dialogue de confirmation quand on clique sur le bouton d'abandon. `SaveBar` la définit comme propriété `discardConfirmation` de l'élément. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | La barre d'enregistrement a été affichée. |
| `hide` | `Event` | La barre d'enregistrement a été masquée. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Un `<button variant="primary">`, qui est le bouton Enregistrer, et un `<button>` sans variante, qui est le bouton Abandonner. Les types listent aussi `disabled` et `loading` pour ces boutons. |
