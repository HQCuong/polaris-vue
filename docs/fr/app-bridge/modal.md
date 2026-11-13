---
title: Modal
description: "Modal génère ui-modal. Liez v-model:open pour l'ouvrir et le fermer."
---

# Modal {#modal}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

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
