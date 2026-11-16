---
title: "Modal (ui-modal) – App Bridge modal für Vue 3"
description: "Modal rendert ui-modal von Shopify App Bridge in Vue 3: Binden Sie v-model:open, nutzen Sie die Events show und hide und eine TitleBar. Aus polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Ein Modal ist ein Overlay, das die Interaktion mit dem Rest der App verhindert, bis es geschlossen wird, wie Shopifys [Modal-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) es beschreibt.

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

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `open` | `boolean` | Ob das Modal angezeigt wird. Verwenden Sie `v-model:open`, um es synchron zu halten, wenn App Bridge das Modal schließt. Standard: `false`. |
| `id` | `string` | Eine eindeutige Kennung für das Modal. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | Die Größe des Modals. Standard: `"base"`. Bevor das Modal angezeigt wird, kann jeder dieser Werte gesetzt werden; danach nur noch `small`, `base` oder `large`. |
| `src` | `string` | Die URL des Inhalts, der im Modal angezeigt wird. Mit `src` werden andere Kinder als `ui-title-bar` und `ui-save-bar` ignoriert. |

`open` ist ein Prop der Komponente; `id`, `variant` und `src` sind Attribute von `ui-modal`, die an das Element weitergegeben werden.

### Events {#events}

| Event | Typ | Beschreibung |
| --- | --- | --- |
| `show` | `Event` | Das Modal wurde angezeigt. |
| `hide` | `Event` | Das Modal wurde ausgeblendet. |
| `update:open` | `boolean` | Wird nach `show` oder `hide` emittiert, wenn der neue Zustand von `open` abweicht, für `v-model:open`. |

### Slots {#slots}

| Slot | Beschreibung |
| --- | --- |
| `default` | Der Inhalt des Modals. Eine `TitleBar` (oder `<ui-title-bar>`) konfiguriert die Titelleiste des Modals. Sie und eine `SaveBar` (oder `<ui-save-bar>`) bleiben direkte Kinder von `ui-modal`; alles andere wird in `content` des Modals gerendert. |
