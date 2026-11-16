---
title: "TitleBar (ui-title-bar) – App Bridge cho Vue 3"
description: "TitleBar render ui-title-bar của Shopify App Bridge trong Vue 3, với title được đặt làm attribute; trong Modal nó đặt header và footer. Dành cho Shopify embedded app."
---

# TitleBar {#title-bar}

Title bar xuất hiện ở đầu app của bạn trong trang admin Shopify; [tài liệu TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) của Shopify mô tả cách tùy chỉnh nó.

`TitleBar` render `ui-title-bar`, với `title` được đặt làm attribute. Trong một `Modal`, nó đặt
phần header và footer của modal. Các con của nó là các element `<button>` và `<a>`; type của
`ui-title-bar` cho phép `variant="primary"` hoặc `variant="breadcrumb"`,
`tone="critical"`, và các nhóm `<section label="...">`. Với title bar của trang, Shopify
hiện ghi nhận [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
chính là [`SPage`](/vi/components/s-page).

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.

### Tiêu đề và hành động trong modal {#example-title-bar-in-modal}

Dùng cách này để cho modal một tiêu đề và các nút ở chân, ở đây cho một hành động hàng loạt có
tiêu đề đếm số mục đã chọn.
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
- Trong modal, `TitleBar` đặt phần header và footer của modal. Như trong ví dụ "Simple form" của Shopify,
  nút chính có `variant="primary"` và Cancel không có variant
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- Các handler click của nút chạy trong trang của bạn, nên `publish` có thể hiển thị toast.
- Với một hành động không thể hoàn tác, hãy thêm `tone="critical"` vào nút chính, như trong
  [ví dụ xác nhận xóa](/vi/app-bridge/modal#example-confirm-delete).
- Tiêu đề được tính từ các mục đã chọn trước khi modal mở. Việc App Bridge
  có nhận tiêu đề thay đổi khi modal đang mở hay không vẫn chưa được kiểm chứng.

### Title bar của trang với s-page {#example-page-title-bar}

Dùng cách này cho title bar của một trang. Hiện Shopify cấu hình nó bằng `s-page`, không phải
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
- Trang title bar của Shopify mô tả các slot `breadcrumb-actions`, `accessory`,
  `primary-action` và `secondary-actions` của `s-page`, một menu mở bằng
  `commandFor`, và "only one primary action" (chỉ một hành động chính) cho mỗi trang
  ([Title bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading` theo bản ghi đã tải, nên title bar nêu tên sản phẩm.
- Các type của `ui-title-bar` còn cho phép các nút và link `variant="breadcrumb"` cùng
  các nhóm `<section label="...">`. Các trang hiện tại của Shopify không mô tả chúng trông ra sao, nên
  trang này không có ví dụ về chúng.

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `title` | `string` | Tiêu đề của title bar. Cũng có thể đặt bằng `document.title`. `TitleBar` luôn đặt nó làm attribute. |

`TitleBar` không phát ra sự kiện nào.

### Slots {#slots}

| Slot | Mô tả |
| --- | --- |
| `default` | Các element `<button>` và `<a>`, và các nhóm `<section>` chứa chúng, như bên dưới. |

Type của `ui-title-bar` mô tả các con sau:

| Phần tử con | Attribute |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Type ghi chú rằng element anchor không được hỗ trợ trong Remix, nơi có thể dùng component `<Link>` của Remix thay thế. |
| `<section>` | `label`: `string`. Các con của nó là element `<a>` và `<button>`. |

Trong các type này, `<button>` và `<a>` cũng nhận `id`, `name`, `class`, `href`, `rel`, `target` và `onclick`.
