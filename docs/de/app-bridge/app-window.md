---
title: "AppWindow (s-app-window) – App Bridge für Vue 3"
description: "AppWindow rendert s-app-window von Shopify App Bridge, ein modales Vollbildfenster im Shopify-Adminbereich, in Vue 3: src ist erforderlich, geöffnet wird es mit v-model:open."
---

# AppWindow {#app-window}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install); zu `open` siehe [Modal](/de/app-bridge/modal).

Shopifys [s-app-window-Referenz](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) beschreibt es als ein Vollbild-Modalfenster für komplexe Abläufe, die eigenen Platz auf dem Bildschirm brauchen.

`AppWindow` rendert `s-app-window`, das die Dokumentation von `@shopify/app-bridge-types` beschreibt als
"a fullscreen modal window in the Shopify admin". `src` ist erforderlich: "the URL is loaded
in an iframe when the window opens".

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Edit in bulk</button>
  <AppWindow id="bulk-editor" src="/bulk-editor" v-model:open="open" />
</template>
```

`open`, `v-model:open`, `show`/`hide` und das Ausblenden beim Unmount funktionieren wie bei `Modal`. Es hat
keinen Slot.

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `open` | `boolean` | Ob das Fenster angezeigt wird. Verwenden Sie `v-model:open`, um es synchron zu halten, wenn App Bridge das Fenster schließt. Standard: `false`. |
| `id` | `string` | Eine eindeutige Kennung für das App-Fenster-Element, mit der Sie Schaltflächen über `commandFor` verbinden oder das Element mit `document.getElementById()` abrufen. |
| `src` | `string` (erforderlich) | Die URL des Inhalts, der im Fenster angezeigt wird. Sie muss auf eine Route Ihrer App zeigen, die den Fensterinhalt rendert, und wird beim Öffnen des Fensters in einem iframe geladen. |

### Events {#events}

| Event | Typ | Beschreibung |
| --- | --- | --- |
| `show` | `Event` | Das Fenster wurde geöffnet. |
| `hide` | `Event` | Das Fenster wurde geschlossen. |
| `update:open` | `boolean` | Wird nach `show` oder `hide` emittiert, wenn der neue Zustand von `open` abweicht, für `v-model:open`. |

### Slots {#slots}

`AppWindow` hat keine Slots: `SAppWindowAttributes` definiert keine Kinder.
