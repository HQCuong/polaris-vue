---
title: "TitleBar (ui-title-bar) – App Bridge для Vue 3"
description: "TitleBar отображает ui-title-bar из Shopify App Bridge в Vue 3: заголовок и кнопки, а в Modal — его шапку и подвал. Для встроенных приложений Shopify."
---

# TitleBar {#title-bar}

Строка заголовка отображается в верхней части вашего приложения в админке Shopify; как её настроить, описано в [справочнике TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) Shopify.

`TitleBar` отображает `ui-title-bar`, а `title` задаёт как атрибут. Внутри `Modal` он задаёт
шапку и подвал модального окна. Его дочерние элементы — `<button>` и `<a>`; типы
`ui-title-bar` допускают `variant="primary"` или `variant="breadcrumb"`,
`tone="critical"` и группы `<section label="...">`. Для строки заголовка страницы Shopify
теперь документирует [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
то есть [`SPage`](/ru/components/s-page).

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.

### Заголовок и действия в модальном окне {#example-title-bar-in-modal}

Используйте это, чтобы задать модальному окну заголовок и кнопки в подвале. Здесь это массовое действие,
в заголовке которого указано число выбранных элементов.

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

- В модальном окне `TitleBar` задаёт шапку и подвал. Как в примере «Simple form» от Shopify,
  у основной кнопки `variant="primary"`, а у «Cancel» варианта нет
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Обработчики кликов по кнопкам выполняются на вашей странице, поэтому `publish` может показать toast-уведомление.
- Для деструктивного действия добавьте основной кнопке `tone="critical"`, как в
  [примере подтверждения удаления](/ru/app-bridge/modal#example-confirm-delete).
- Заголовок вычисляется из выбранных элементов до открытия модального окна. Подхватывает ли App Bridge
  заголовок, изменившийся при открытом окне, не проверялось.

### Строка заголовка страницы с s-page {#example-page-title-bar}

Используйте это для строки заголовка страницы. Shopify теперь настраивает её через `s-page`, а не
через `ui-title-bar`.

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

- На странице Shopify о строке заголовка описаны слоты `s-page` `breadcrumb-actions`, `accessory`,
  `primary-action` и `secondary-actions`, меню, которое открывается через
  `commandFor`, и правило «только одно основное действие» на страницу
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` следует за загруженной записью, поэтому в строке заголовка указано название товара.
- Типы `ui-title-bar` также допускают кнопки и ссылки с `variant="breadcrumb"` и
  группы `<section label="...">`. Текущие страницы Shopify не описывают, как они выглядят, поэтому
  примера с ними на этой странице нет.

## Пропсы и события {#reference}

### Пропсы {#props}

| Проп | Тип | Описание |
| --- | --- | --- |
| `title` | `string` | Заголовок строки заголовка. Его также можно задать через `document.title`. `TitleBar` всегда задаёт его как атрибут. |

`TitleBar` не вызывает событий.

### Слоты {#slots}

| Слот | Описание |
| --- | --- |
| `default` | Элементы `<button>` и `<a>`, а также группы `<section>` из них, как показано ниже. |

Типы `ui-title-bar` описывают такие дочерние элементы:

| Дочерний элемент | Атрибуты |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. В типах отмечено, что элементы-ссылки не поддерживаются в Remix, где вместо них можно использовать компонент `<Link>` из Remix. |
| `<section>` | `label`: `string`. Его дочерние элементы — `<a>` и `<button>`. |

В этих типах `<button>` и `<a>` также принимают `id`, `name`, `class`, `href`, `rel`, `target` и `onclick`.
