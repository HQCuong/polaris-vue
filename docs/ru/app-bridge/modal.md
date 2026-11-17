---
title: "Modal (ui-modal) – модальное окно App Bridge для Vue 3"
description: "Modal рендерит ui-modal из Shopify App Bridge во Vue 3: привяжите v-model:open, получайте события show и hide, добавьте TitleBar. Импортируется из polaris-vue-elements/app-bridge."
---

# Modal {#modal}

Модальное окно — это наложение, которое не даёт взаимодействовать с остальным приложением, пока его не закроют; так его описывает [справочник по Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) Shopify.

`Modal` рендерит `ui-modal`. Привяжите `v-model:open`, чтобы открывать и закрывать окно:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const open = ref(false)

function confirm(): void {
  open.value = false
  useAppBridge().toast.show('Reset')
}
</script>

<template>
  <button @click="open = true">Reset settings</button>
  <Modal id="reset-modal" v-model:open="open">
    <p>This restores the default values.</p>
    <TitleBar title="Reset settings?">
      <button variant="primary" @click="confirm">Reset</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

Что делает компонент, по аналогии с `Modal` из `@shopify/app-bridge-react`:

- `open` вызывает метод `show()` или `hide()` элемента. Когда модальное окно открывается или
  закрывается в админке, испускаются `show` и `hide`, а `open` обновляется через `v-model:open`.
  Когда компонент размонтируется, модальное окно скрывается.
- `TitleBar` (или `<ui-title-bar>`) и `SaveBar` (или `<ui-save-bar>`) в слоте по умолчанию
  остаются прямыми потомками `ui-modal`. Всё остальное рендерится в `content` элемента,
  внутри одного `<div>`.
- `id`, `variant` и `src` передаются элементу.

Страница Shopify [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
объясняет, как работают такие модальные окна:

- Модальные окна рендерит админка Shopify, в iframe того же происхождения (same-origin), что и ваше приложение.
- «Когда вы открываете модальное окно с HTML-содержимым, App Bridge переносит это содержимое
  в iframe модального окна. Он также копирует в него таблицы стилей вашего приложения.»
- «Такие модальные окна предназначены для простых сценариев.» Пользовательский JavaScript не
  копируется, и прямого доступа к `document` у вас нет.
- С `src` модальное окно вместо этого загружает маршрут вашего приложения. Типы `ui-modal`
  сообщают, что тогда «любые потомки, кроме элементов ui-title-bar и ui-save-bar, будут
  проигнорированы». Маршрут общается с вашим приложением через `postMessage`, как показано на
  той странице.

Указанная страница рекомендует модальное окно с `src` для всего, что исключают его ограничения.
Обработка событий Vue и элементы Polaris `s-*` внутри перенесённого содержимого пока
не проверены в админке.

## Вызов методов элемента {#modal-methods}

`$el` компонента — это элемент `ui-modal` с типом `UIModalElement`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'polaris-vue-elements/app-bridge'

const modal = ref<InstanceType<typeof Modal> | null>(null)

async function toggle(): Promise<void> {
  await modal.value?.$el.toggle()
}
</script>

<template>
  <Modal ref="modal" id="info-modal">
    <p>Details</p>
  </Modal>
</template>
```

API `shopify.modal` (`ModalApi`) тоже принимает `id`, но его типы и страница Shopify
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
описывают его для элемента Polaris `s-modal`. Для `ui-modal` вызывайте методы элемента, как показано выше.

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.

### Подтверждение необратимого действия {#example-confirm-delete}

Используйте это, когда действие в строке удаляет то, что продавец не сможет вернуть.

```vue
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  SButton,
  STable,
  STableBody,
  STableCell,
  STableHeader,
  STableHeaderRow,
  STableRow,
} from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  id: string
  title: string
}

const products = ref<Product[]>([
  { id: 'gid://shopify/Product/1', title: 'Wool sweater' },
  { id: 'gid://shopify/Product/2', title: 'Linen shirt' },
])
const pending = ref<Product | null>(null)
const open = ref(false)
const deleting = ref(false)

const title = computed(() => `Delete ${pending.value?.title ?? 'product'}?`)

async function askToDelete(product: Product): Promise<void> {
  pending.value = product
  // Let Vue render the new title before the modal opens.
  await nextTick()
  open.value = true
}

async function confirmDelete(): Promise<void> {
  const product = pending.value
  if (!product || deleting.value) return
  const shopify = useAppBridge()
  deleting.value = true
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    products.value = products.value.filter((p) => p.id !== product.id)
    open.value = false
    shopify.toast.show(`${product.title} deleted`)
  } catch {
    shopify.toast.show('Could not delete the product', { isError: true })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <STable>
    <STableHeaderRow>
      <STableHeader>Product</STableHeader>
      <STableHeader>Actions</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow v-for="product in products" :key="product.id">
        <STableCell>{{ product.title }}</STableCell>
        <STableCell>
          <SButton tone="critical" @click="askToDelete(product)">Delete</SButton>
        </STableCell>
      </STableRow>
    </STableBody>
  </STable>

  <Modal id="delete-product-modal" v-model:open="open" @hide="pending = null">
    <p>This permanently deletes the product. You can't undo this.</p>
    <TitleBar :title="title">
      <button variant="primary" tone="critical" @click="confirmDelete">Delete</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Одно модальное окно обслуживает все строки. Строка задаёт `pending`, а строка заголовка называет товар.
  Тело модального окна остаётся статичным, потому что обновления Vue внутри перенесённого содержимого не проверены.
- В «Simple message modal» от Shopify кнопка «Delete» находится в строке заголовка с
  `variant="primary"` и `tone="critical"`
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- Кнопки строки заголовка — прямые потомки `ui-modal`, поэтому `confirmDelete` выполняется на
  вашей странице. Toast-уведомление показывается оттуда, после запроса
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### Короткая форма в модальном окне {#example-form-modal}

Используйте это, чтобы собрать одно-два значения, не покидая страницу, например заметку к заказу.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ orderId: string }>()

const open = ref(false)
const note = ref('')
const saving = ref(false)

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  saving.value = true
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(props.orderId)}/note`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Note saved')
  } catch {
    shopify.toast.show('Could not save the note', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  note.value = ''
}
</script>

<template>
  <SButton @click="open = true">Add note</SButton>
  <Modal id="order-note-modal" v-model:open="open" @hide="reset">
    <form @submit.prevent="save">
      <label>
        Note
        <textarea v-model="note" name="note" rows="4" />
      </label>
    </form>
    <TitleBar title="Add a note">
      <button variant="primary" @click="save">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- Содержимое — одна `<form>`. Shopify: «Можно указать только один родительский элемент,
  обычно `p`, `form` или `div`»
  ([Using modals](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide` очищает заметку при любом способе закрытия модального окна, в том числе кнопкой закрытия в админке.
- Не проверено: видит ли `v-model` на `<textarea>` ввод продавца. App Bridge
  «копирует в iframe модального окна только HTML-элементы и таблицы стилей», а обработчики Vue — это
  JavaScript. Если это не работает, используйте модальное окно с `src`, как в следующем примере.
- В версии этой формы у Shopify также есть `data-save-bar`, который связывает её с панелью сохранения (save bar)
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### Редактор в модальном окне с src {#example-src-modal}

Используйте это для содержимого, которому нужен собственный JavaScript, например для rich-редактора. Модальное окно загружает
маршрут вашего приложения, а два фрейма общаются через `postMessage`.

::: code-group

```ts [editor-messages.ts]
// Messages between the page and the modal route. Both sides import this file.
export type ToEditor = { type: 'load'; html: string } | { type: 'request-save' }

export type FromEditor = { type: 'ready' } | { type: 'save'; html: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isToEditor(data: unknown): data is ToEditor {
  if (!isRecord(data)) return false
  return data.type === 'request-save' || (data.type === 'load' && typeof data.html === 'string')
}

export function isFromEditor(data: unknown): data is FromEditor {
  if (!isRecord(data)) return false
  return data.type === 'ready' || (data.type === 'save' && typeof data.html === 'string')
}
```

```vue [ProductDescription.vue]
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { isFromEditor, type ToEditor } from './editor-messages'

const props = defineProps<{ productId: string; description: string }>()
const emit = defineEmits<{ saved: [html: string] }>()

const modal = ref<InstanceType<typeof Modal> | null>(null)
const open = ref(false)

function post(message: ToEditor): void {
  // contentWindow is only available while the modal is open.
  modal.value?.$el.contentWindow?.postMessage(message, location.origin)
}

async function save(html: string): Promise<void> {
  const shopify = useAppBridge()
  shopify.loading(true)
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    emit('saved', html)
    open.value = false
    shopify.toast.show('Description saved')
  } catch {
    shopify.toast.show('Could not save the description', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin) return
  if (event.source !== modal.value?.$el.contentWindow) return
  const message: unknown = event.data
  if (!isFromEditor(message)) return
  if (message.type === 'ready') post({ type: 'load', html: props.description })
  else void save(message.html)
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <SButton @click="open = true">Edit description</SButton>
  <Modal
    ref="modal"
    id="description-editor"
    src="/modals/description-editor"
    variant="max"
    v-model:open="open"
  >
    <TitleBar title="Edit description">
      <button variant="primary" @click="post({ type: 'request-save' })">Save</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

```vue [DescriptionEditor.vue]
<script setup lang="ts">
// The route at /modals/description-editor, loaded inside the modal.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { STextArea } from 'polaris-vue-elements'
import { isToEditor, type FromEditor } from './editor-messages'

const html = ref('')
const loaded = ref(false)

function opener(): Window | null {
  // The app page that opened this modal.
  return window.opener as Window | null
}

function post(message: FromEditor): void {
  opener()?.postMessage(message, location.origin)
}

function onMessage(event: MessageEvent): void {
  if (event.origin !== location.origin || event.source !== opener()) return
  const message: unknown = event.data
  if (!isToEditor(message)) return
  if (message.type === 'load') {
    html.value = message.html
    loaded.value = true
  } else {
    post({ type: 'save', html: html.value })
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  post({ type: 'ready' })
})
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <STextArea v-model="html" label="Description" :rows="20" :disabled="!loaded" />
</template>
```

:::

- В модальном окне `window.opener` — это страница вашего приложения. На странице `contentWindow`
  модального окна — это маршрут ([How to communicate with your main app frame](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  К `contentWindow` «можно обращаться только при открытом модальном окне» (`UIModalElement`), поэтому
  маршрут сначала сообщает `ready`, а страница отвечает содержимым.
- Shopify в своём примере отправляет сообщения с `location.origin` в качестве целевого origin. Проверки `event.origin`
  и `event.source` добавлены здесь, чтобы каждая сторона принимала сообщения только от
  другой.
- Кнопка «Save» находится в строке заголовка страницы. Она запрашивает у маршрута его содержимое, а
  страница сохраняет его и показывает toast-уведомление. «Вы не можете обращаться к возможностям App Bridge,
  например к toast, напрямую из модального окна»
  ([Modals with a route](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- Маршруту нужен тег скрипта `app-bridge.js`, а также собственные CSS и JS. В приложении на Vite
  каждый маршрут отдаётся из `index.html`, где этот скрипт уже есть.
- `variant="max"` нужно задать до показа модального окна. После этого можно задавать только `small`, `base`
  и `large` (`UIModalElement`).

### Открытие модального окна из другого компонента {#example-modal-by-id}

Используйте это, когда кнопка, открывающая модальное окно, находится в другом компоненте, не в том, где само окно,
например справка, которую открывают из нескольких строк таблицы.

::: code-group

```ts [useModalById.ts]
/// <reference types="@shopify/app-bridge-types" />

export interface ModalControls {
  show: () => Promise<void>
  hide: () => Promise<void>
}

// Finds the ui-modal element by its id when it is needed, as in Shopify's
// document.getElementById('my-modal').show() example.
export function useModalById(id: string): ModalControls {
  const element = (): UIModalElement | null =>
    document.getElementById(id) as unknown as UIModalElement | null
  return {
    show: async () => {
      await element()?.show()
    },
    hide: async () => {
      await element()?.hide()
    },
  }
}
```

```vue [ShippingHelpModal.vue]
<script setup lang="ts">
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <Modal id="shipping-help">
    <div>
      <p>Rates are calculated at checkout from the package weight.</p>
      <p>Free shipping applies after discounts.</p>
    </div>
    <TitleBar title="How shipping rates work" />
  </Modal>
</template>
```

```vue [RatesTable.vue]
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'
import { useModalById } from './useModalById'

const help = useModalById('shipping-help')
</script>

<template>
  <SButton variant="tertiary" icon="question-circle" accessibilityLabel="How rates work" @click="help.show()" />
</template>
```

:::

- Смонтируйте `ShippingHelpModal` один раз, например в макете (layout), и вызывайте `show()` из любого
  компонента. Методы `show()` и `hide()` есть у `UIModalElement`; в
  [примере с модальным окном src](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)
  Shopify вызывает их через `document.getElementById`.
- У этого модального окна нет `v-model:open`, поэтому остальным частям приложения не нужно знать, открыто ли оно.
- Страница Shopify [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  показывает `shopify.modal.show(id)` с элементом Polaris `s-modal`.

### Обновление страницы при закрытии модального окна {#example-show-hide-events}

Используйте это, когда модальное окно меняет данные, которые показывает страница, например импорт, добавляющий товары.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SButton, SSection, SStack, SText } from 'polaris-vue-elements'
import { Modal, TitleBar } from 'polaris-vue-elements/app-bridge'

const open = ref(false)
const importing = ref(false)
const count = ref<number | null>(null)

async function loadCount(): Promise<void> {
  const res = await fetch('/api/products/count')
  if (res.ok) count.value = ((await res.json()) as { count: number }).count
}

function onShow(): void {
  importing.value = true
}

async function onHide(): Promise<void> {
  importing.value = false
  await loadCount()
}

onMounted(loadCount)
</script>

<template>
  <SSection heading="Catalog">
    <SStack direction="inline" gap="base" alignItems="center">
      <SText>{{ count ?? '…' }} products</SText>
      <SButton :disabled="importing" @click="open = true">Import products</SButton>
    </SStack>
  </SSection>

  <Modal
    id="import-products"
    src="/modals/import-products"
    v-model:open="open"
    @show="onShow"
    @hide="onHide"
  >
    <TitleBar title="Import products" />
  </Modal>
</template>
```

- `hide` срабатывает при любом способе закрытия модального окна, в том числе кнопкой закрытия в админке, поэтому
  страница перезагружает данные один раз, в одном месте. `show` и `hide` — это события,
  перечисленные в `UIModalElement`.
- `v-model:open` уже следует за модальным окном. Для побочных эффектов используйте `@show` и `@hide`.

## Пропсы и события {#reference}

### Пропсы {#props}

| Проп | Тип | Описание |
| --- | --- | --- |
| `open` | `boolean` | Показано ли модальное окно. Используйте `v-model:open`, чтобы синхронизировать состояние, когда App Bridge закрывает окно. По умолчанию: `false`. |
| `id` | `string` | Уникальный идентификатор модального окна. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | Размер модального окна. По умолчанию: `"base"`. До показа окна можно задать любое из этих значений; после — только `small`, `base` или `large`. |
| `src` | `string` | URL содержимого, которое нужно показать в модальном окне. С `src` потомки, кроме `ui-title-bar` и `ui-save-bar`, игнорируются. |

`open` — это проп компонента; `id`, `variant` и `src` — атрибуты `ui-modal`, которые передаются элементу.

### События {#events}

| Событие | Тип | Описание |
| --- | --- | --- |
| `show` | `Event` | Модальное окно показано. |
| `hide` | `Event` | Модальное окно скрыто. |
| `update:open` | `boolean` | Испускается после `show` или `hide`, когда новое состояние отличается от `open`, для `v-model:open`. |

### Слоты {#slots}

| Слот | Описание |
| --- | --- |
| `default` | Содержимое модального окна. `TitleBar` (или `<ui-title-bar>`) настраивает строку заголовка окна. Он и `SaveBar` (или `<ui-save-bar>`) остаются прямыми потомками `ui-modal`; всё остальное рендерится в `content` модального окна. |
