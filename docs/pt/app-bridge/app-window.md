---
title: "AppWindow (s-app-window) – App Bridge para Vue 3"
description: "AppWindow renderiza o s-app-window do Shopify App Bridge, uma janela modal em tela cheia no admin da Shopify, em Vue 3: src é obrigatório e ele abre com v-model:open."
---

# AppWindow {#app-window}

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

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no [`Modal`](/pt/app-bridge/modal).
Ele não tem slot.

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.

### Um editor em tela cheia {#example-window-editor}

Use isto para um editor que precisa da tela inteira, aberto a partir de uma lista de registros.

::: code-group

```vue [ProductList.vue]
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const editingId = ref<string | null>(null)
const open = ref(false)

// The window loads this route of your app in an iframe.
const src = computed(() =>
  editingId.value ? `/products/${encodeURIComponent(editingId.value)}/editor` : null,
)

function edit(product: Product): void {
  editingId.value = product.id
  open.value = true
}

async function reload(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

onMounted(reload)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="base">
      <SStack v-for="product in products" :key="product.id" direction="inline" gap="base">
        <SText>{{ product.title }}</SText>
        <SButton @click="edit(product)">Open editor</SButton>
      </SStack>
    </SStack>
  </SSection>
  <AppWindow v-if="src" id="product-editor" :src="src" v-model:open="open" @hide="reload" />
</template>
```

```vue [ProductEditor.vue]
<script setup lang="ts">
// The route at /products/:id/editor, loaded inside the window.
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SBanner, SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'

interface ProductDraft {
  title: string
  description: string
}

const route = useRoute()
const url = computed(() => `/api/products/${encodeURIComponent(String(route.params.id))}`)

const saved = ref<ProductDraft>({ title: '', description: '' })
const form = ref<ProductDraft>({ ...saved.value })
const error = ref(false)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as ProductDraft
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const values = { ...form.value }
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  error.value = !res.ok
  if (res.ok) saved.value = values
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage :heading="saved.title || 'Product editor'">
    <SBanner v-if="error" tone="critical">The product could not be saved.</SBanner>
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.title" label="Product title" name="title" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="12" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

:::

- `src` "deve apontar para uma rota dentro do seu app", e "a URL é carregada em um iframe quando
  a janela abre" (`SAppWindowAttributes`). Mudar `src` com a janela aberta
  a navega para a nova URL (`SAppWindowElement`).
- As boas práticas da Shopify para a janela: abri-la apenas a partir de uma ação explícita, definir o
  título com `s-page` no conteúdo da janela, adicionar `data-save-bar` aos formulários dela e
  devolver o lojista ao ponto de onde começou ao fechar
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- A janela é renderizada quando um registro é escolhido, porque `src` é obrigatório.
- `@hide="reload"` atualiza a lista a cada fechamento. A Shopify lista "atualizar o estado da UI"
  como um uso do evento `hide` (`SAppWindowElement`).
- O formulário segue o [exemplo de data-save-bar](/pt/app-bridge/save-bar#example-data-save-bar).
  Quando ele tem alterações não salvas, o `hide()` da janela pergunta ao lojista antes de fechar.
- O editor mostra os erros na página. A Shopify não diz quais APIs do App Bridge, como o
  toast, funcionam dentro da janela.
- A Shopify não documenta como a rota da janela fecha a janela ou devolve dados
  à sua página. A página pode alcançar a rota pelo `contentWindow` do elemento
  ("use isto para se comunicar com o conteúdo do iframe via `postMessage()`"), apenas enquanto a
  janela está aberta.

### Edição em massa de uma seleção {#example-window-bulk-edit}

Use isto quando o lojista seleciona linhas e as edita juntas em uma visualização em tela cheia.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SButton, SCheckbox, SSection, SStack } from 'polaris-vue-elements'
import { AppWindow } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([])
const selected = ref<string[]>([])
const open = ref(false)

// The selection travels in the URL, which the bulk-edit route reads.
const src = computed(() => `/bulk-edit?ids=${encodeURIComponent(selected.value.join(','))}`)

function toggle(id: string): void {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id]
}

async function load(): Promise<void> {
  const res = await fetch('/api/products')
  if (res.ok) products.value = (await res.json()) as Product[]
}

async function onHide(): Promise<void> {
  selected.value = []
  await load()
}

onMounted(load)
</script>

<template>
  <SSection heading="Products">
    <SStack gap="small-200">
      <SCheckbox
        v-for="product in products"
        :key="product.id"
        :label="product.title"
        :checked="selected.includes(product.id)"
        @change="toggle(product.id)"
      />
    </SStack>
    <SButton :disabled="selected.length === 0" @click="open = true">
      Edit {{ selected.length }} selected
    </SButton>
  </SSection>
  <AppWindow id="bulk-editor" :src="src" v-model:open="open" @hide="onHide" />
</template>
```

- A Shopify cita editores em massa entre os usos de `src` (`SAppWindowAttributes`). A rota é
  uma página comum do seu app, então ela lê a seleção da query string.
- Depois que a janela fecha, `onHide` limpa a seleção e recarrega a lista.

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
