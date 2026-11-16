---
title: "TitleBar (ui-title-bar) – App Bridge für Vue 3"
description: "TitleBar rendert ui-title-bar von Shopify App Bridge in Vue 3, wobei title als Attribut gesetzt wird; in einem Modal setzt es Kopf- und Fußzeile. Für eingebettete Shopify-Apps."
---

# TitleBar {#title-bar}

Die Titelleiste erscheint oben in Ihrer App im Shopify-Adminbereich; Shopifys [TitleBar-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) beschreibt, wie Sie sie anpassen.

`TitleBar` rendert `ui-title-bar`, wobei `title` als Attribut gesetzt wird. In einem `Modal` legt sie
Kopf- und Fußzeile des Modals fest. Ihre Kinder sind `<button>`- und `<a>`-Elemente; die
Typen von `ui-title-bar` erlauben `variant="primary"` oder `variant="breadcrumb"`,
`tone="critical"` und `<section label="...">`-Gruppen. Für die Titelleiste der Seite dokumentiert Shopify
jetzt [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
also [`SPage`](/de/components/s-page).

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.

### Titel und Aktionen in einem Modal {#example-title-bar-in-modal}

Verwenden Sie dies, um einem Modal seine Überschrift und seine Buttons in der Fußzeile zu geben, hier für eine Massenaktion, deren
Titel die Auswahl zählt.

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

- In einem Modal legt `TitleBar` Kopf- und Fußzeile des Modals fest. Wie in Shopifys Beispiel "Simple form"
  hat der Hauptbutton `variant="primary"` und Abbrechen keine Variante
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Die Click-Handler der Buttons laufen in Ihrer Seite, daher kann `publish` den Toast anzeigen.
- Fügen Sie bei einer destruktiven Aktion `tone="critical"` zum primären Button hinzu, wie im
  [Beispiel zur Löschbestätigung](/de/app-bridge/modal#example-confirm-delete).
- Der Titel wird aus der Auswahl berechnet, bevor das Modal geöffnet wird. Ob App Bridge
  einen Titel übernimmt, der sich ändert, während das Modal geöffnet ist, wurde nicht verifiziert.

### Die Titelleiste der Seite mit s-page {#example-page-title-bar}

Verwenden Sie dies für die Titelleiste einer Seite. Shopify konfiguriert sie jetzt mit `s-page`, nicht mehr mit
`ui-title-bar`.

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

- Shopifys Seite zur Titelleiste dokumentiert die Slots `breadcrumb-actions`, `accessory`,
  `primary-action` und `secondary-actions` von `s-page`, ein mit `commandFor` geöffnetes Menü und "nur eine primäre Aktion"
  pro Seite
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` folgt dem geladenen Datensatz, sodass die Titelleiste das Produkt nennt.
- Die Typen von `ui-title-bar` erlauben außerdem Buttons und Links mit `variant="breadcrumb"` sowie
  `<section label="...">`-Gruppen. Shopifys aktuelle Seiten beschreiben nicht, wie sie aussehen, daher
  enthält diese Seite kein Beispiel dafür.

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `title` | `string` | Der Titel der Titelleiste. Er kann auch über `document.title` gesetzt werden. `TitleBar` setzt ihn immer als Attribut. |

`TitleBar` emittiert keine Events.

### Slots {#slots}

| Slot | Beschreibung |
| --- | --- |
| `default` | `<button>`- und `<a>`-Elemente sowie `<section>`-Gruppen davon, wie unten beschrieben. |

Die Typen von `ui-title-bar` beschreiben diese Kinder:

| Kind | Attribute |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Die Typen weisen darauf hin, dass Anchor-Elemente in Remix nicht unterstützt werden; dort kann stattdessen die `<Link>`-Komponente von Remix verwendet werden. |
| `<section>` | `label`: `string`. Ihre Kinder sind `<a>`- und `<button>`-Elemente. |

In diesen Typen nehmen `<button>` und `<a>` außerdem `id`, `name`, `class`, `href`, `rel`, `target` und `onclick` an.
