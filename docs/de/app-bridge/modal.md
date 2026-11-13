---
title: Modal
description: "Modal rendert ui-modal. Binden Sie v-model:open, um es zu öffnen und zu schließen."
---

# Modal {#modal}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

`Modal` rendert `ui-modal`. Binden Sie `v-model:open`, um es zu öffnen und zu schließen:

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

Was die Komponente tut, nach dem Vorbild von `Modal` in `@shopify/app-bridge-react`:

- `open` ruft `show()` oder `hide()` des Elements auf. Wenn sich das Modal im Adminbereich öffnet oder
  schließt, werden `show` und `hide` emittiert und `open` wird über `v-model:open` aktualisiert.
  Das Modal wird ausgeblendet, wenn die Komponente unmounted wird.
- Eine `TitleBar` (oder `<ui-title-bar>`) und eine `SaveBar` (oder `<ui-save-bar>`) im Default-Slot
  bleiben direkte Kinder von `ui-modal`. Alles andere wird in `content` des Elements gerendert,
  innerhalb eines einzelnen `<div>`.
- `id`, `variant` und `src` werden an das Element weitergegeben.

Shopifys [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
erklärt, wie diese Modals funktionieren:

- Modals werden vom Shopify-Adminbereich in einem iframe gerendert, das denselben Origin wie Ihre App hat.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." Eigenes JavaScript wird nicht
  kopiert, und Sie haben keinen direkten Zugriff auf das `document`.
- Mit `src` lädt das Modal stattdessen eine Route Ihrer App. Die Typen von `ui-modal` besagen, dass dann
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". Die Route kommuniziert über `postMessage` mit Ihrer App, wie auf
  dieser Seite gezeigt.

Die genannte Seite empfiehlt das `src`-Modal für alles, was ihre Einschränkungen ausschließen. Die Vue-
Event-Behandlung und Polaris-`s-*`-Elemente innerhalb des verschobenen Inhalts wurden im Adminbereich noch
nicht verifiziert.

## Element-Methoden aufrufen {#modal-methods}

`$el` der Komponente ist das Element `ui-modal`, typisiert als `UIModalElement`:

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

`shopify.modal.show(id)` und `shopify.modal.hide(id)` funktionieren ebenfalls mit der `id`.
