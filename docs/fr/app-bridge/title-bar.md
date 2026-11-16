---
title: "TitleBar (ui-title-bar) – App Bridge pour Vue 3"
description: "TitleBar génère ui-title-bar de Shopify App Bridge en Vue 3, avec title défini comme attribut ; dans un Modal, il définit l'en-tête et le pied. Pour les apps Shopify intégrées."
---

# TitleBar {#title-bar}

La barre de titre apparaît en haut de votre app dans l'interface d'administration Shopify ; la [référence TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) de Shopify explique comment la personnaliser.

`TitleBar` génère `ui-title-bar`, avec `title` défini comme attribut. Dans un `Modal`, il définit
l'en-tête et le pied du modal. Ses enfants sont des éléments `<button>` et `<a>` ; les
types de `ui-title-bar` autorisent `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` et des groupes `<section label="...">`. Pour la barre de titre de la page, Shopify
documente désormais [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
c'est-à-dire [`SPage`](/fr/components/s-page).

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.

### Titre et actions dans un modal {#example-title-bar-in-modal}

Utilisez ceci pour donner à un modal son titre et ses boutons de pied de page, ici pour une action groupée dont le
titre indique le nombre d'éléments sélectionnés.

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

- Dans un modal, `TitleBar` définit l'en-tête et le pied de page du modal. Comme dans l'exemple "Simple form" de Shopify,
  le bouton principal a `variant="primary"` et Cancel n'a pas de variant
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Les gestionnaires de clic des boutons s'exécutent dans votre page, donc `publish` peut afficher le toast.
- Pour une action destructive, ajoutez `tone="critical"` au bouton principal, comme dans l'
  [exemple de confirmation de suppression](/fr/app-bridge/modal#example-confirm-delete).
- Le titre est calculé à partir de la sélection avant l'ouverture du modal. La prise en compte par App Bridge
  d'un titre qui change pendant que le modal est ouvert n'a pas été vérifiée.

### La barre de titre de la page avec s-page {#example-page-title-bar}

Utilisez ceci pour la barre de titre d'une page. Shopify la configure désormais avec `s-page`, et non
avec `ui-title-bar`.

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

- La page de Shopify sur la barre de titre documente les slots `breadcrumb-actions`, `accessory`,
  `primary-action` et `secondary-actions` de `s-page`, un menu ouvert avec
  `commandFor`, et "only one primary action" par page
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` suit l'enregistrement chargé, donc la barre de titre nomme le produit.
- Les types de `ui-title-bar` autorisent aussi des boutons et liens `variant="breadcrumb"` et des
  groupes `<section label="...">`. Les pages actuelles de Shopify ne décrivent pas leur apparence, donc
  cette page n'en donne pas d'exemple.

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Le titre de la barre de titre. Il peut aussi être défini avec `document.title`. `TitleBar` le définit toujours comme attribut. |

`TitleBar` n'émet aucun événement.

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Des éléments `<button>` et `<a>`, et des groupes `<section>` de ces éléments, comme ci-dessous. |

Les types de `ui-title-bar` décrivent ces enfants :

| Enfant | Attributs |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Les types indiquent que les éléments anchor ne sont pas pris en charge dans Remix, où le composant `<Link>` de Remix peut être utilisé à la place. |
| `<section>` | `label`: `string`. Ses enfants sont des éléments `<a>` et `<button>`. |

Dans ces types, `<button>` et `<a>` acceptent aussi `id`, `name`, `class`, `href`, `rel`, `target` et `onclick`.
