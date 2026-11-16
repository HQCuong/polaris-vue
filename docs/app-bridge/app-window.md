---
title: "AppWindow (s-app-window) – App Bridge for Vue 3"
description: "AppWindow renders the Shopify App Bridge s-app-window, a fullscreen modal window in the Shopify admin, in Vue 3: src is required, open it with v-model:open."
---

# AppWindow {#app-window}

Before you start, see [Install](/app-bridge/#install); for `open`, see [Modal](/app-bridge/modal).

Shopify's [s-app-window reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) describes it as a fullscreen modal window for complex workflows that need dedicated screen space.

`AppWindow` renders `s-app-window`, which the `@shopify/app-bridge-types` docs describe as
"a fullscreen modal window in the Shopify admin". `src` is required: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` and hiding on unmount work as for `Modal`. It has
no slot.

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the window is shown. Use `v-model:open` to keep it in sync when App Bridge closes the window. Default: `false`. |
| `id` | `string` | A unique identifier for the app window element, used to connect buttons with `commandFor` or to get the element with `document.getElementById()`. |
| `src` | `string` (required) | The URL of the content to show in the window. It must point to a route of your app that renders the window content, and it is loaded in an iframe when the window opens. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | The window opened. |
| `hide` | `Event` | The window closed. |
| `update:open` | `boolean` | Emitted after `show` or `hide` when the new state differs from `open`, for `v-model:open`. |

### Slots {#slots}

`AppWindow` has no slots: `SAppWindowAttributes` defines no children.
