---
title: "AppWindow (s-app-window) – 适用于 Vue 3 的 App Bridge"
description: "AppWindow 在 Vue 3 中渲染 Shopify App Bridge 的 s-app-window，即 Shopify 后台中的全屏模态窗口：src 为必填项，通过 v-model:open 打开。"
---

# AppWindow {#app-window}

Shopify 的 [s-app-window 参考文档](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)将它描述为一个全屏 modal 窗口，用于需要专属屏幕空间的复杂工作流程。

`AppWindow` 渲染 `s-app-window`，`@shopify/app-bridge-types` 的文档将其描述为
"a fullscreen modal window in the Shopify admin"。`src` 是必需的："the URL is loaded
in an iframe when the window opens"。

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

`open`、`v-model:open`、`show`/`hide` 以及卸载时隐藏的行为与 [`Modal`](/zh/app-bridge/modal) 相同。它
没有 slot。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。

### 全屏编辑器 {#example-window-editor}

用于需要占满整个屏幕的编辑器，从记录列表中打开。

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

- `src` “必须指向你应用内的一个路由”，并且“窗口打开时，该 URL 会在 iframe 中加载”
  （`SAppWindowAttributes`）。在窗口打开期间更改 `src`，会让它导航到新的 URL
  （`SAppWindowElement`）。
- Shopify 对窗口的最佳实践：只通过明确的操作打开它，在窗口内容中用 `s-page` 设置标题，
  给其中的表单添加 `data-save-bar`，并在关闭时让商家回到起始位置
  （[App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)）。
- 选定记录之后才会渲染窗口，因为 `src` 是必需的。
- `@hide="reload"` 在每次关闭后刷新列表。Shopify 把“更新 UI 状态”列为 `hide` 事件的用途之一
  （`SAppWindowElement`）。
- 表单遵循 [data-save-bar 示例](/zh/app-bridge/save-bar#example-data-save-bar)。
  当它有未保存的更改时，窗口的 `hide()` 会在关闭前询问商家。
- 编辑器在页面中显示错误。Shopify 没有说明窗口内部哪些 App Bridge API
  （例如 toast）可以使用。
- Shopify 没有记录窗口的路由如何关闭窗口，或如何把数据发回你的页面。页面可以通过元素的
  `contentWindow` 访问该路由（“用它通过 `postMessage()` 与 iframe 内容通信”），
  但仅限窗口打开期间。

### 批量编辑所选项目 {#example-window-bulk-edit}

当商家选择多行并在全屏视图中一起编辑时使用。

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

- Shopify 把批量编辑器列为 `src` 的用途之一（`SAppWindowAttributes`）。该路由是
  你应用的普通页面，因此它从查询字符串中读取所选项目。
- 窗口关闭后，`onHide` 会清除选择并重新加载列表。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 窗口是否显示。使用 `v-model:open` 在 App Bridge 关闭窗口时保持同步。默认值：`false`。 |
| `id` | `string` | 应用窗口元素的唯一标识符，用于通过 `commandFor` 关联按钮，或通过 `document.getElementById()` 获取元素。 |
| `src` | `string` (必填) | 在窗口中显示的内容的 URL。它必须指向应用中渲染窗口内容的路由，并在窗口打开时加载到 iframe 中。 |

### Events {#events}

| Event | 类型 | 说明 |
| --- | --- | --- |
| `show` | `Event` | 窗口已打开。 |
| `hide` | `Event` | 窗口已关闭。 |
| `update:open` | `boolean` | 当新状态与 `open` 不同时，在 `show` 或 `hide` 之后触发，供 `v-model:open` 使用。 |

### Slots {#slots}

`AppWindow` 没有 slot：`SAppWindowAttributes` 没有定义子元素。
