---
title: "TitleBar (ui-title-bar) – App Bridge para Vue 3"
description: "TitleBar renderiza o ui-title-bar do Shopify App Bridge em Vue 3, com title definido como atributo; em um Modal, define o cabeçalho e o rodapé. Para apps incorporados da Shopify."
---

# TitleBar {#title-bar}

A barra de título aparece no topo do seu app no admin da Shopify; a [referência do TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) da Shopify descreve como personalizá-la.

`TitleBar` renderiza `ui-title-bar`, com `title` definido como atributo. Em um `Modal`, ele define
o cabeçalho e o rodapé do modal. Seus filhos são elementos `<button>` e `<a>`; os tipos de
`ui-title-bar` permitem `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` e grupos `<section label="...">`. Para a barra de título da página, a Shopify
agora documenta o [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que é o [`SPage`](/pt/components/s-page).

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.

### Título e ações em um modal {#example-title-bar-in-modal}

Use isto para dar a um modal o seu título e os botões do rodapé, aqui para uma ação em massa cujo
título conta a seleção.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ selectedIds: string[] }>()

const open = ref(false)
const publishing = ref(false)
const title = computed(() => {
  const n = props.selectedIds.length
  return `Publish ${n} ${n === 1 ? 'product' : 'products'}?`
})

async function publish(): Promise<void> {
  if (publishing.value) return
  const shopify = useAppBridge()
  publishing.value = true
  try {
    const res = await fetch('/api/products/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: props.selectedIds }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Products published')
  } catch {
    shopify.toast.show('Could not publish the products', { isError: true })
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton :disabled="selectedIds.length === 0" @click="open = true">Publish</SButton>
  <Modal id="publish-modal" v-model:open="open">
    <p>The products become visible on your online store.</p>
    <TitleBar :title="title">
      <button variant="primary" @click="publish">Publish</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Em um modal, `TitleBar` define o cabeçalho e o rodapé do modal. Como no exemplo "Simple form" da Shopify,
  o botão principal tem `variant="primary"` e Cancel não tem variant
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Os handlers de clique dos botões são executados na sua página, então `publish` pode exibir o toast.
- Para uma ação destrutiva, adicione `tone="critical"` ao botão principal, como no
  [exemplo de confirmação de exclusão](/pt/app-bridge/modal#example-confirm-delete).
- O título é calculado a partir da seleção antes de o modal abrir. Não foi verificado se o App Bridge
  percebe um título que muda enquanto o modal está aberto.

### A barra de título da página com s-page {#example-page-title-bar}

Use isto para a barra de título de uma página. A Shopify agora a configura com `s-page`, não
com `ui-title-bar`.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBadge, SButton, SLink, SMenu, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  title: string
  status: 'ACTIVE' | 'DRAFT'
}

const props = defineProps<{ productId: string }>()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}`)
  if (res.ok) product.value = (await res.json()) as Product
})

function save(): void {
  useAppBridge().toast.show('Product saved')
}
</script>

<template>
  <SPage :heading="product?.title ?? 'Product'">
    <template #breadcrumb-actions>
      <SLink href="/products">Products</SLink>
    </template>
    <template #accessory>
      <SBadge v-if="product?.status === 'DRAFT'" tone="warning">Draft</SBadge>
    </template>
    <template #primary-action>
      <SButton variant="primary" @click="save">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton commandFor="product-more-actions">More actions</SButton>
    </template>
    <SMenu id="product-more-actions">
      <SButton>Duplicate</SButton>
      <SButton tone="critical">Delete</SButton>
    </SMenu>
    <SSection heading="Details">…</SSection>
  </SPage>
</template>
```

- A página da barra de título da Shopify documenta os slots `breadcrumb-actions`, `accessory`,
  `primary-action` e `secondary-actions` de `s-page`, um menu aberto com
  `commandFor`, e "apenas uma ação principal" por página
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` acompanha o registro carregado, então a barra de título informa o nome do produto.
- Os tipos de `ui-title-bar` também permitem botões e links com `variant="breadcrumb"` e
  grupos `<section label="...">`. As páginas atuais da Shopify não descrevem a aparência deles, então
  esta página não tem exemplo deles.

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string` | O título da barra de título. Também pode ser definido com `document.title`. `TitleBar` sempre o define como atributo. |

`TitleBar` não emite eventos.

### Slots {#slots}

| Slot | Descrição |
| --- | --- |
| `default` | Elementos `<button>` e `<a>`, e grupos `<section>` deles, como abaixo. |

Os tipos de `ui-title-bar` descrevem estes filhos:

| Filho | Atributos |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Os tipos observam que elementos anchor não são suportados no Remix, onde o componente `<Link>` do Remix pode ser usado no lugar. |
| `<section>` | `label`: `string`. Seus filhos são elementos `<a>` e `<button>`. |

Nesses tipos, `<button>` e `<a>` também aceitam `id`, `name`, `class`, `href`, `rel`, `target` e `onclick`.
