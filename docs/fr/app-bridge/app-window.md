---
title: "AppWindow (s-app-window) – App Bridge pour Vue 3"
description: "AppWindow génère s-app-window de Shopify App Bridge, une fenêtre modale plein écran dans l'admin Shopify, en Vue 3 : src est requis, ouverture avec v-model:open."
---

# AppWindow {#app-window}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install) ; pour `open`, consultez [Modal](/fr/app-bridge/modal).

La [référence s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) de Shopify le décrit comme une fenêtre modale plein écran pour les workflows complexes qui ont besoin d'un espace d'écran dédié.

`AppWindow` génère `s-app-window`, que la documentation de `@shopify/app-bridge-types` décrit comme
"a fullscreen modal window in the Shopify admin". `src` est obligatoire : "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` et le masquage au démontage fonctionnent comme pour `Modal`. Il n'a
pas de slot.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Indique si la fenêtre est affichée. Utilisez `v-model:open` pour rester synchronisé quand App Bridge ferme la fenêtre. Par défaut : `false`. |
| `id` | `string` | Un identifiant unique pour l'élément de fenêtre d'app, utilisé pour connecter des boutons avec `commandFor` ou pour obtenir l'élément avec `document.getElementById()`. |
| `src` | `string` (obligatoire) | L'URL du contenu à afficher dans la fenêtre. Elle doit pointer vers une route de votre app qui rend le contenu de la fenêtre, et elle est chargée dans une iframe à l'ouverture de la fenêtre. |

### Events {#events}

| Event | Type | Description |
| --- | --- | --- |
| `show` | `Event` | La fenêtre s'est ouverte. |
| `hide` | `Event` | La fenêtre s'est fermée. |
| `update:open` | `boolean` | Émis après `show` ou `hide` quand le nouvel état diffère de `open`, pour `v-model:open`. |

### Slots {#slots}

`AppWindow` n'a pas de slot : `SAppWindowAttributes` ne définit aucun enfant.
