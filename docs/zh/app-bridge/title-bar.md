---
title: "TitleBar (ui-title-bar) – 适用于 Vue 3 的 App Bridge"
description: "TitleBar 在 Vue 3 中渲染 Shopify App Bridge 的 ui-title-bar，并将 title 设为 attribute；在 Modal 中，它用于设置页眉和页脚。适用于 Shopify 嵌入式应用。"
---

# TitleBar {#title-bar}

标题栏显示在 Shopify 后台中应用的顶部；Shopify 的 [TitleBar 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)说明了如何自定义它。

`TitleBar` 渲染 `ui-title-bar`，并将 `title` 设为 attribute。在 `Modal` 中，它用于设置
modal 的页眉和页脚。它的子元素是 `<button>` 和 `<a>` 元素；`ui-title-bar` 的类型
允许 `variant="primary"` 或 `variant="breadcrumb"`、`tone="critical"`，
以及 `<section label="...">` 分组。对于页面标题栏，Shopify 现在记录的是
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)，
也就是 [`SPage`](/zh/components/s-page)。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。

### modal 中的标题和操作 {#example-title-bar-in-modal}

用于给 modal 设置标题和页脚按钮，这里是一个批量操作，标题中会统计所选项目的数量。

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

- 在 modal 中，`TitleBar` 设置 modal 的页眉和页脚。与 Shopify 的 “Simple form”
  示例一样，主按钮带有 `variant="primary"`，Cancel 没有 variant
  （[Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)）。
- 按钮的点击处理函数在你的页面中运行，因此 `publish` 可以显示 toast。
- 对于破坏性操作，在主按钮上添加 `tone="critical"`，如
  [删除确认示例](/zh/app-bridge/modal#example-confirm-delete)所示。
- 标题在 modal 打开之前根据所选项目计算。modal 打开期间标题发生变化时，
  App Bridge 是否会更新，尚未验证。

### 使用 s-page 的页面标题栏 {#example-page-title-bar}

用于页面的标题栏。Shopify 现在用 `s-page` 来配置它，而不是 `ui-title-bar`。

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

- Shopify 的标题栏页面记录了 `s-page` 的 `breadcrumb-actions`、`accessory`、
  `primary-action` 和 `secondary-actions` slot，一个用 `commandFor` 打开的菜单，
  以及每个页面“只有一个主要操作”
  （[Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)）。
- `heading` 跟随已加载的记录，因此标题栏会显示产品名称。
- `ui-title-bar` 的类型还允许 `variant="breadcrumb"` 的按钮和链接，以及
  `<section label="...">` 分组。Shopify 当前的页面没有描述它们的外观，
  因此本页没有这方面的示例。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 标题栏的标题。也可以通过 `document.title` 设置。`TitleBar` 总是将它设为属性。 |

`TitleBar` 不触发任何事件。

### Slots {#slots}

| Slot | 说明 |
| --- | --- |
| `default` | `<button>` 和 `<a>` 元素，以及包含它们的 `<section>` 分组，见下表。 |

`ui-title-bar` 的类型描述了以下子元素：

| 子元素 | 属性 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 类型中注明 Remix 不支持 anchor 元素，可以改用 Remix 的 `<Link>` 组件。 |
| `<section>` | `label`: `string`. 其子元素是 `<a>` 和 `<button>` 元素。 |

在这些类型中，`<button>` 和 `<a>` 还接受 `id`、`name`、`class`、`href`、`rel`、`target` 和 `onclick`。
