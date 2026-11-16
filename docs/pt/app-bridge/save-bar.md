---
title: "SaveBar (ui-save-bar) – App Bridge para Vue 3"
description: "SaveBar renderiza o ui-save-bar do Shopify App Bridge em Vue 3, com v-model:open, os events show e hide e discardConfirmation. Para apps incorporados da Shopify."
---

# SaveBar {#save-bar}

Antes de começar, veja [Instalação](/pt/app-bridge/#install); para `open`, veja [Modal](/pt/app-bridge/modal).

A barra de salvamento indica que um formulário na página atual tem informações não salvas, como descreve a [referência do SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) da Shopify.

`SaveBar` renderiza `ui-save-bar`. Como descrevem os tipos de `ui-save-bar`, "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button":

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SaveBar } from 'polaris-vue-elements/app-bridge'

const dirty = ref(false)

function save(): void {
  dirty.value = false
}
function discard(): void {
  dirty.value = false
}
</script>

<template>
  <SaveBar id="settings-save-bar" v-model:open="dirty" discard-confirmation>
    <button variant="primary" @click="save">Save</button>
    <button @click="discard">Discard</button>
  </SaveBar>
</template>
```

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no `Modal`.
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") é definido como a propriedade `discardConfirmation` do elemento.

Para um formulário, o atributo `data-save-bar` do
[guia de apps incorporados](/pt/guide/shopify-embedded-app#save-bar) não precisa de componente.

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `open` | `boolean` | Se a barra de salvamento está sendo exibida. Use `v-model:open` para mantê-la sincronizada quando o App Bridge oculta a barra de salvamento. Padrão: `false`. |
| `id` | `string` | Um identificador único para a barra de salvamento. |
| `discardConfirmation` | `boolean` | Se deve exibir um diálogo de confirmação quando o botão de descartar é clicado. `SaveBar` define isso como a propriedade `discardConfirmation` do elemento. |

### Events {#events}

| Event | Tipo | Descrição |
| --- | --- | --- |
| `show` | `Event` | A barra de salvamento foi exibida. |
| `hide` | `Event` | A barra de salvamento foi ocultada. |
| `update:open` | `boolean` | Emitido depois de `show` ou `hide` quando o novo estado é diferente de `open`, para `v-model:open`. |

### Slots {#slots}

| Slot | Descrição |
| --- | --- |
| `default` | Um `<button variant="primary">`, que é o botão Salvar, e um `<button>` sem variante, que é o botão Descartar. Os tipos também listam `disabled` e `loading` para esses botões. |
