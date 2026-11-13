---
title: Modal
description: "Modal renderiza ui-modal. Vincule v-model:open para abri-lo e fechá-lo."
---

# Modal {#modal}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

`Modal` renderiza `ui-modal`. Vincule `v-model:open` para abri-lo e fechá-lo:

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

O que o componente faz, seguindo o `Modal` do `@shopify/app-bridge-react`:

- `open` chama `show()` ou `hide()` do elemento. Quando o modal abre ou fecha no
  admin, `show` e `hide` são emitidos e `open` é atualizado por meio de `v-model:open`.
  O modal é ocultado quando o componente é desmontado.
- Um `TitleBar` (ou `<ui-title-bar>`) e um `SaveBar` (ou `<ui-save-bar>`) no slot padrão
  continuam sendo filhos diretos de `ui-modal`. Todo o resto é renderizado no `content` do
  elemento, dentro de um único `<div>`.
- `id`, `variant` e `src` são repassados ao elemento.

O guia [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
da Shopify explica como esses modais funcionam:

- Os modais são renderizados pelo admin da Shopify, em um iframe de mesma origem que o seu app.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." O JavaScript personalizado não é
  copiado, e você não tem acesso direto ao `document`.
- Com `src`, o modal carrega uma rota do seu app. Os tipos de `ui-modal` dizem que,
  nesse caso, "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored". A rota se comunica com o seu app por meio de `postMessage`, como mostrado
  nessa página.

A página acima recomenda o modal com `src` para tudo o que as suas limitações excluem. O
tratamento de eventos do Vue e os elementos `s-*` do Polaris dentro do conteúdo movido ainda não
foram verificados no admin.

## Chamando métodos do elemento {#modal-methods}

O `$el` do componente é o elemento `ui-modal`, tipado como `UIModalElement`:

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

`shopify.modal.show(id)` e `shopify.modal.hide(id)` também funcionam com o `id`.
