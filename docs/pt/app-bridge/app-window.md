---
title: "AppWindow (s-app-window) – App Bridge para Vue 3"
description: "AppWindow renderiza o s-app-window do Shopify App Bridge, uma janela modal em tela cheia no admin da Shopify, em Vue 3: src é obrigatório e ele abre com v-model:open."
---

# AppWindow {#app-window}

Antes de começar, veja [Instalação](/pt/app-bridge/#install); para `open`, veja [Modal](/pt/app-bridge/modal).

A [referência do s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) da Shopify o descreve como uma janela modal em tela cheia para fluxos de trabalho complexos que precisam de espaço de tela dedicado.

`AppWindow` renderiza `s-app-window`, que a documentação de `@shopify/app-bridge-types` descreve como
"a fullscreen modal window in the Shopify admin". `src` é obrigatório: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no `Modal`.
Ele não tem slot.

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `open` | `boolean` | Se a janela está sendo exibida. Use `v-model:open` para mantê-la sincronizada quando o App Bridge fecha a janela. Padrão: `false`. |
| `id` | `string` | Um identificador único para o elemento da janela do app, usado para conectar botões com `commandFor` ou para obter o elemento com `document.getElementById()`. |
| `src` | `string` (obrigatório) | A URL do conteúdo exibido na janela. Deve apontar para uma rota do seu app que renderiza o conteúdo da janela, e é carregada em um iframe quando a janela abre. |

### Events {#events}

| Event | Tipo | Descrição |
| --- | --- | --- |
| `show` | `Event` | A janela foi aberta. |
| `hide` | `Event` | A janela foi fechada. |
| `update:open` | `boolean` | Emitido depois de `show` ou `hide` quando o novo estado é diferente de `open`, para `v-model:open`. |

### Slots {#slots}

`AppWindow` não tem slots: `SAppWindowAttributes` não define filhos.
