---
title: "AppWindow (s-app-window) – App Bridge para Vue 3"
description: "AppWindow renderiza s-app-window de Shopify App Bridge, una ventana modal a pantalla completa en el admin de Shopify, en Vue 3: src es obligatorio y se abre con v-model:open."
---

# AppWindow {#app-window}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install); para `open`, consulta [Modal](/es/app-bridge/modal).

La [referencia de s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) de Shopify lo describe como una ventana modal a pantalla completa para flujos de trabajo complejos que necesitan un espacio de pantalla dedicado.

`AppWindow` renderiza `s-app-window`, que la documentación de `@shopify/app-bridge-types` describe como
"a fullscreen modal window in the Shopify admin". `src` es obligatorio: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` y el ocultado al desmontar funcionan igual que en `Modal`.
No tiene slot.

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `open` | `boolean` | Si la ventana se muestra. Usa `v-model:open` para mantenerla sincronizada cuando App Bridge cierra la ventana. Por defecto: `false`. |
| `id` | `string` | Un identificador único para el elemento de ventana de la app, que se usa para conectar botones con `commandFor` o para obtener el elemento con `document.getElementById()`. |
| `src` | `string` (obligatorio) | La URL del contenido que se muestra en la ventana. Debe apuntar a una ruta de tu app que renderice el contenido de la ventana, y se carga en un iframe cuando la ventana se abre. |

### Events {#events}

| Event | Tipo | Descripción |
| --- | --- | --- |
| `show` | `Event` | La ventana se abrió. |
| `hide` | `Event` | La ventana se cerró. |
| `update:open` | `boolean` | Se emite después de `show` o `hide` cuando el nuevo estado difiere de `open`, para `v-model:open`. |

### Slots {#slots}

`AppWindow` no tiene slots: `SAppWindowAttributes` no define hijos.
