---
title: "Modal (ui-modal) – modal App Bridge pour Vue 3"
description: "Modal génère ui-modal de Shopify App Bridge en Vue 3 : liez v-model:open, recevez les events show et hide, ajoutez une TitleBar. À importer depuis polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Un modal est une surcouche qui empêche toute interaction avec le reste de l'app jusqu'à sa fermeture, comme le décrit la [référence Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) de Shopify.

`Modal` génère `ui-modal`. Liez `v-model:open` pour l'ouvrir et le fermer :

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

Ce que fait le composant, d'après `Modal` dans `@shopify/app-bridge-react` :

- `open` appelle `show()` ou `hide()` sur l'élément. Quand le modal s'ouvre ou se ferme dans
  l'interface d'administration, `show` et `hide` sont émis et `open` est mis à jour via `v-model:open`.
  Le modal est masqué lorsque le composant est démonté.
- Un `TitleBar` (ou `<ui-title-bar>`) et un `SaveBar` (ou `<ui-save-bar>`) dans le slot par défaut
  restent des enfants directs de `ui-modal`. Tout le reste est rendu dans le
  `content` de l'élément, à l'intérieur d'un seul `<div>`.
- `id`, `variant` et `src` sont transmis à l'élément.

La page [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
de Shopify explique le fonctionnement de ces modals :

- Les modals sont rendus par l'interface d'administration Shopify, dans une iframe de même origine que votre app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Le JavaScript personnalisé n'est pas
  copié, et vous n'avez pas d'accès direct au `document`.
- Avec `src`, le modal charge à la place une route de votre app. Les types de `ui-modal` indiquent qu'alors
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". La route communique avec votre app via `postMessage`, comme le montre
  cette page.

La page ci-dessus recommande le modal `src` pour tout ce que ses limitations excluent. La gestion
des événements Vue et les éléments Polaris `s-*` dans le contenu déplacé n'ont pas encore été
vérifiés dans l'interface d'administration.

## Appeler les méthodes de l'élément {#modal-methods}

Le `$el` du composant est l'élément `ui-modal`, typé `UIModalElement` :

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

`shopify.modal.show(id)` et `shopify.modal.hide(id)` fonctionnent aussi avec l'`id`.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si le modal est affiché. Utilisez `v-model:open` pour rester synchronisé quand App Bridge ferme le modal. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour le modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | La taille du modal. Par défaut : `"base"`. Avant l'affichage du modal, n'importe laquelle de ces valeurs peut être définie ; ensuite, seulement `small`, `base` ou `large`. |
| `src` | `string` | L'URL du contenu à afficher dans le modal. Avec `src`, les enfants autres que `ui-title-bar` et `ui-save-bar` sont ignorés. |

`open` est une prop du composant ; `id`, `variant` et `src` sont des attributs de `ui-modal`, transmis à l'élément.

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | Le modal a été affiché. |
| `hide` | `Event` | Le modal a été masqué. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Le contenu du modal. Un `TitleBar` (ou `<ui-title-bar>`) configure la barre de titre du modal. Lui et un `SaveBar` (ou `<ui-save-bar>`) restent des enfants directs de `ui-modal` ; tout le reste est rendu dans le `content` du modal. |
