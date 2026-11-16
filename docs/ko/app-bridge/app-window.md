---
title: "AppWindow (s-app-window) – Vue 3용 App Bridge"
description: "AppWindow는 Vue 3에서 Shopify 관리자의 전체 화면 모달 창인 Shopify App Bridge의 s-app-window를 렌더링합니다. src는 필수이며 v-model:open으로 엽니다."
---

# AppWindow {#app-window}

Shopify의 [s-app-window 레퍼런스](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window)는 이를 전용 화면 공간이 필요한 복잡한 워크플로를 위한 전체 화면 모달 창으로 설명합니다.

`AppWindow`는 `s-app-window`를 렌더링하며, `@shopify/app-bridge-types` 문서는 이를
"a fullscreen modal window in the Shopify admin"이라고 설명합니다. `src`는 필수입니다. "the URL is loaded
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

`open`, `v-model:open`, `show`/`hide`, 언마운트 시 숨김은 [`Modal`](/ko/app-bridge/modal)과 같이 동작합니다. slot은
없습니다.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.

### 전체 화면 에디터 {#example-window-editor}

레코드 목록에서 열리는, 화면 전체가 필요한 에디터에 사용합니다.

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

- `src`는 "앱 내의 라우트를 가리켜야 하며", "윈도우가 열릴 때 해당 URL이 iframe에 로드됩니다"
  (`SAppWindowAttributes`). 윈도우가 열려 있는 동안 `src`를 바꾸면 새 URL로 이동합니다
  (`SAppWindowElement`).
- 윈도우에 대한 Shopify의 모범 사례: 명시적인 동작으로만 열고, 윈도우 콘텐츠에서 `s-page`로
  제목을 설정하고, 폼에 `data-save-bar`를 추가하고, 닫을 때 판매자를 처음 있던 곳으로
  돌려보냅니다
  ([앱 윈도우](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- `src`가 필수이므로 윈도우는 레코드가 선택된 뒤에 렌더링됩니다.
- `@hide="reload"`는 닫을 때마다 목록을 새로고침합니다. Shopify는 `hide` 이벤트의 용도로
  "UI 상태 업데이트"를 듭니다(`SAppWindowElement`).
- 폼은 [data-save-bar 예제](/ko/app-bridge/save-bar#example-data-save-bar)를 따릅니다.
  저장되지 않은 변경이 있으면 윈도우의 `hide()`는 닫기 전에 판매자에게 확인합니다.
- 에디터는 오류를 페이지에 표시합니다. 토스트 같은 App Bridge API 중 어느 것이 윈도우 안에서 동작하는지는
  Shopify가 밝히지 않습니다.
- 윈도우의 라우트가 윈도우를 닫거나 페이지로 데이터를 돌려보내는 방법은 Shopify가 문서화하지
  않았습니다. 페이지는 윈도우가 열려 있는 동안에만 요소의 `contentWindow`를 통해 라우트에 접근할 수
  있습니다("이를 사용해 `postMessage()`로 iframe 콘텐츠와 통신합니다").

### 선택 항목 일괄 편집 {#example-window-bulk-edit}

판매자가 행을 선택해 전체 화면 뷰에서 함께 편집할 때 사용합니다.

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

- Shopify는 `src`의 용도로 일괄 에디터를 듭니다(`SAppWindowAttributes`). 라우트는 앱의 일반
  페이지이므로 쿼리 문자열에서 선택 항목을 읽습니다.
- 윈도우가 닫힌 뒤 `onHide`가 선택을 지우고 목록을 다시 불러옵니다.

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `open` | `boolean` | 창이 표시되는지 여부입니다. App Bridge가 창을 닫을 때 동기화를 유지하려면 `v-model:open`을 사용하세요. 기본값: `false`. |
| `id` | `string` | 앱 창 요소의 고유 식별자로, `commandFor`로 버튼을 연결하거나 `document.getElementById()`로 요소를 가져올 때 사용합니다. |
| `src` | `string` (필수) | 창에 표시할 콘텐츠의 URL입니다. 창 콘텐츠를 렌더링하는 앱의 라우트를 가리켜야 하며, 창이 열릴 때 iframe에 로드됩니다. |

### Events {#events}

| Event | 타입 | 설명 |
| --- | --- | --- |
| `show` | `Event` | 창이 열렸습니다. |
| `hide` | `Event` | 창이 닫혔습니다. |
| `update:open` | `boolean` | 새 상태가 `open`과 다를 때 `show` 또는 `hide` 다음에 emit되며, `v-model:open`에 사용됩니다. |

### Slots {#slots}

`AppWindow`에는 slot이 없습니다. `SAppWindowAttributes`는 자식을 정의하지 않습니다.
