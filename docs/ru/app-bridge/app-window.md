---
title: "AppWindow (s-app-window) – App Bridge для Vue 3"
description: "AppWindow рендерит s-app-window из Shopify App Bridge, полноэкранное модальное окно в админке Shopify, во Vue 3: src обязателен, открывайте через v-model:open."
---

# AppWindow {#app-window}

[Справочник по s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) Shopify описывает его как полноэкранное модальное окно для сложных сценариев, которым нужно отдельное место на экране.

`AppWindow` рендерит `s-app-window`, который документация `@shopify/app-bridge-types` описывает как
«полноэкранное модальное окно в админке Shopify». `src` обязателен: «URL загружается
в iframe при открытии окна».

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

`open`, `v-model:open`, `show`/`hide` и скрытие при размонтировании работают так же, как у [`Modal`](/ru/app-bridge/modal). Слотов
у него нет.

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.

### Полноэкранный редактор {#example-window-editor}

Используйте это для редактора, которому нужен весь экран и который открывается из списка записей.

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

- `src` «должен указывать на маршрут вашего приложения», и «URL загружается в iframe при
  открытии окна» (`SAppWindowAttributes`). Изменение `src` при открытом окне
  перенаправляет его на новый URL (`SAppWindowElement`).
- Рекомендации Shopify для окна: открывайте его только по явному действию, задавайте
  заголовок через `s-page` в содержимом окна, добавляйте `data-save-bar` в его формы и
  возвращайте продавца туда, откуда он начал, при закрытии
  ([App window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window#best-practices)).
- Окно рендерится после выбора записи, потому что `src` обязателен.
- `@hide="reload"` обновляет список после каждого закрытия. Shopify называет «обновление состояния UI»
  одним из применений события `hide` (`SAppWindowElement`).
- Форма следует [примеру с data-save-bar](/ru/app-bridge/save-bar#example-data-save-bar).
  Если в ней есть несохранённые изменения, `hide()` окна спрашивает продавца перед закрытием.
- Редактор показывает ошибки на странице. Shopify не уточняет, какие API App Bridge, например
  toast, работают внутри окна.
- Shopify не документирует, как маршрут окна закрывает окно или отправляет данные обратно
  на вашу страницу. Страница может обратиться к маршруту через `contentWindow` элемента
  («используйте это для обмена с содержимым iframe через `postMessage()`»), но только пока
  окно открыто.

### Массовое редактирование выбранного {#example-window-bulk-edit}

Используйте это, когда продавец выбирает строки и редактирует их вместе в полноэкранном виде.

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

- Shopify называет массовые редакторы среди применений `src` (`SAppWindowAttributes`). Маршрут — это
  обычная страница вашего приложения, поэтому он читает выбранное из своей строки запроса.
- После закрытия окна `onHide` очищает выбор и перезагружает список.

## Пропсы и события {#reference}

### Пропсы {#props}

| Проп | Тип | Описание |
| --- | --- | --- |
| `open` | `boolean` | Показано ли окно. Используйте `v-model:open`, чтобы синхронизировать состояние, когда App Bridge закрывает окно. По умолчанию: `false`. |
| `id` | `string` | Уникальный идентификатор элемента окна приложения; используется, чтобы связать кнопки через `commandFor` или получить элемент через `document.getElementById()`. |
| `src` | `string` (обязателен) | URL содержимого, которое нужно показать в окне. Он должен указывать на маршрут вашего приложения, который рендерит содержимое окна, и загружается в iframe при открытии окна. |

### События {#events}

| Событие | Тип | Описание |
| --- | --- | --- |
| `show` | `Event` | Окно открылось. |
| `hide` | `Event` | Окно закрылось. |
| `update:open` | `boolean` | Испускается после `show` или `hide`, когда новое состояние отличается от `open`, для `v-model:open`. |

### Слоты {#slots}

У `AppWindow` нет слотов: `SAppWindowAttributes` не определяет потомков.
