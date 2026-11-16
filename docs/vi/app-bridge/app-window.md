---
title: "AppWindow (s-app-window) – App Bridge cho Vue 3"
description: "AppWindow render s-app-window của Shopify App Bridge, một cửa sổ modal toàn màn hình trong Shopify admin, trong Vue 3: src là bắt buộc, mở bằng v-model:open."
---

# AppWindow {#app-window}

[Tài liệu s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) của Shopify mô tả nó là một cửa sổ modal toàn màn hình cho các quy trình phức tạp cần không gian màn hình riêng.

`AppWindow` render `s-app-window`, mà tài liệu `@shopify/app-bridge-types` mô tả là
"a fullscreen modal window in the Shopify admin". `src` là bắt buộc: "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với [`Modal`](/vi/app-bridge/modal). Nó
không có slot.

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.

### Một editor toàn màn hình {#example-window-editor}

Dùng cách này cho một editor cần toàn bộ màn hình, được mở từ danh sách các bản ghi.

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

- `src` "must point to a route within your app" (phải trỏ đến một route trong app của bạn), và "the URL is loaded in an iframe when
  the window opens" (URL được tải trong một iframe khi window mở) (`SAppWindowAttributes`). Đổi `src` khi window đang mở
  sẽ điều hướng nó đến URL mới (`SAppWindowElement`).
- Các best practice của Shopify cho window: chỉ mở nó từ một hành động rõ ràng, đặt
  heading bằng `s-page` trong nội dung của window, thêm `data-save-bar` vào các form của nó, và
  đưa người bán về nơi họ bắt đầu khi đóng
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- Window chỉ được render khi một bản ghi đã được chọn, vì `src` là bắt buộc.
- `@hide="reload"` làm mới danh sách sau mỗi lần đóng. Shopify liệt kê "updating UI state"
  (cập nhật state của UI) như một cách dùng event `hide` (`SAppWindowElement`).
- Form theo [ví dụ data-save-bar](/vi/app-bridge/save-bar#example-data-save-bar).
  Khi nó có thay đổi chưa lưu, `hide()` của window hỏi người bán trước khi đóng.
- Editor hiển thị lỗi trong trang. Shopify không nói API App Bridge nào, như
  toast, hoạt động bên trong window.
- Shopify không ghi lại cách route của window đóng window hoặc gửi dữ liệu về
  trang của bạn. Trang có thể truy cập route qua `contentWindow` của element
  ("use this to communicate with the iframe content via `postMessage()`" (dùng nó để giao tiếp với nội dung iframe qua `postMessage()`)), và chỉ khi
  window đang mở.

### Sửa hàng loạt một vùng chọn {#example-window-bulk-edit}

Dùng cách này khi người bán chọn các dòng và sửa chúng cùng nhau trong một màn hình đầy đủ.
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
- Shopify nêu các editor hàng loạt trong số những cách dùng `src` (`SAppWindowAttributes`). Route là
  một trang bình thường của app bạn, nên nó đọc vùng chọn từ query string.
- Sau khi window đóng, `onHide` xóa vùng chọn và tải lại danh sách.

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `open` | `boolean` | Cửa sổ có đang hiện hay không. Dùng `v-model:open` để giữ đồng bộ khi App Bridge đóng cửa sổ. Mặc định: `false`. |
| `id` | `string` | Định danh duy nhất của element app window, dùng để kết nối các nút bằng `commandFor` hoặc lấy element bằng `document.getElementById()`. |
| `src` | `string` (bắt buộc) | URL của nội dung hiển thị trong cửa sổ. Nó phải trỏ tới một route của app render nội dung cửa sổ, và được tải trong một iframe khi cửa sổ mở. |

### Events {#events}

| Event | Kiểu | Mô tả |
| --- | --- | --- |
| `show` | `Event` | Cửa sổ đã mở. |
| `hide` | `Event` | Cửa sổ đã đóng. |
| `update:open` | `boolean` | Phát ra sau `show` hoặc `hide` khi trạng thái mới khác với `open`, dùng cho `v-model:open`. |

### Slots {#slots}

`AppWindow` không có slot: `SAppWindowAttributes` không định nghĩa con nào.
