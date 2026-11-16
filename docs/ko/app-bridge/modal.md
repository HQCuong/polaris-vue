---
title: "Modal (ui-modal) – Vue 3용 App Bridge modal"
description: "Modal은 Vue 3에서 Shopify App Bridge의 ui-modal을 렌더링합니다. v-model:open을 바인딩하고, show와 hide 이벤트를 받고, TitleBar를 추가합니다. polaris-vue-elements/app-bridge에서 가져옵니다."
---

# Modal {#modal}

Shopify의 [Modal 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/modal)에 따르면, 모달은 닫힐 때까지 앱의 나머지 부분과 상호작용하지 못하게 하는 오버레이입니다.

`Modal`은 `ui-modal`을 렌더링합니다. `v-model:open`을 바인딩해 열고 닫습니다.

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

`@shopify/app-bridge-react`의 `Modal`을 따라 컴포넌트가 하는 일은 다음과 같습니다.

- `open`은 요소의 `show()` 또는 `hide()`를 호출합니다. 관리자에서 모달이 열리거나 닫히면
  `show`와 `hide`가 emit되고 `v-model:open`을 통해 `open`이 업데이트됩니다.
  컴포넌트가 언마운트되면 모달은 숨겨집니다.
- 기본 slot 안의 `TitleBar`(또는 `<ui-title-bar>`)와 `SaveBar`(또는 `<ui-save-bar>`)는
  `ui-modal`의 직접 자식으로 유지됩니다. 나머지는 모두 요소의 `content` 안에 하나의
  `<div>`로 감싸서 렌더링됩니다.
- `id`, `variant`, `src`는 요소에 전달됩니다.

Shopify의 [Using modals in your app](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app)
에서 이 모달의 동작 방식을 설명합니다.

- 모달은 Shopify 관리자가 앱과 same-origin인 iframe에서 렌더링합니다.
- "When you open a modal with HTML content, App Bridge moves this content into the
  modal's iframe. It also copies the stylesheets from your app into the modal frame."
- "These modals are meant to be used for simple use cases." 사용자 정의 JavaScript는
  복사되지 않으며, `document`에 직접 접근할 수 없습니다.
- `src`를 지정하면 모달이 대신 앱의 라우트를 로드합니다. `ui-modal` 타입에는 이 경우
  "any children other than the ui-title-bar and ui-save-bar elements will be
  ignored"라고 되어 있습니다. 라우트는 해당 페이지에 나와 있듯이 `postMessage`를 통해
  앱과 통신합니다.

위 페이지는 이러한 제한으로 해결되지 않는 경우에 `src` 모달을 권장합니다. 이동된 콘텐츠 안에서의
Vue 이벤트 처리와 Polaris `s-*` 요소는 아직 관리자에서 확인되지 않았습니다.

## 요소 메서드 호출하기 {#modal-methods}

컴포넌트의 `$el`은 `ui-modal` 요소이며, 타입은 `UIModalElement`입니다.

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

`shopify.modal` API(`ModalApi`)도 `id`를 받지만, 그 타입과 Shopify의
[Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
페이지는 Polaris `s-modal` 요소를 기준으로 설명합니다. `ui-modal`에서는 위와 같이 요소 메서드를 호출하세요.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.

### 되돌릴 수 없는 작업 확인하기 {#example-confirm-delete}

행 작업이 판매자가 되돌릴 수 없는 항목을 삭제할 때 사용합니다.

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

- 모달 하나가 모든 행을 처리합니다. 행이 `pending`을 설정하고, 타이틀 바에 상품 이름이 표시됩니다.
  이동된 콘텐츠 안의 Vue 업데이트는 확인되지 않았으므로 모달 본문은 정적으로 유지합니다.
- Shopify의 "Simple message modal"은 Delete 버튼을 타이틀 바에 `variant="primary"`와
  `tone="critical"`로 둡니다
  ([모달 사용하기](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-message-modal)).
- 타이틀 바 버튼은 `ui-modal`의 직접 자식이므로 `confirmDelete`는 페이지에서 실행됩니다. 토스트는
  요청이 끝난 뒤 그곳에서 표시합니다
  ([Toast API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/toast-api)).

### 모달 안의 짧은 폼 {#example-form-modal}

주문 메모처럼 한두 개의 값을 페이지를 벗어나지 않고 받을 때 사용합니다.

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

- 콘텐츠는 `<form>` 하나입니다. Shopify: "단일 부모 요소만 제공할 수 있으며, 보통 `p`, `form`
  또는 `div`입니다"
  ([모달 사용하기](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-html-content)).
- `@hide`는 관리자의 닫기 버튼을 포함해 모달이 어떤 방식으로 닫히든 메모를 비웁니다.
- 확인되지 않음: `<textarea>`의 `v-model`이 판매자의 입력을 감지하는지 여부. App Bridge는
  "HTML 요소와 스타일시트만 모달 프레임으로 복사"하며, Vue의 리스너는 JavaScript입니다.
  동작하지 않으면 다음 예제처럼 `src` 모달을 사용하세요.
- Shopify의 이 폼 버전에는 폼을 저장 바와 연결하는 `data-save-bar`도 있습니다
  ([Simple form](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).

### src 모달 안의 에디터 {#example-src-modal}

리치 에디터처럼 자체 JavaScript가 필요한 콘텐츠에 사용합니다. 모달이 앱의 라우트를 로드하고,
두 프레임은 `postMessage`로 통신합니다.

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

- 모달에서 `window.opener`는 앱 페이지입니다. 페이지에서 모달의 `contentWindow`는 해당 라우트입니다
  ([메인 앱 프레임과 통신하는 방법](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#how-to-communicate-with-your-main-app-frame)).
  `contentWindow`는 "모달이 열려 있을 때만 접근할 수 있으므로"(`UIModalElement`), 라우트가
  먼저 `ready`를 보내면 페이지가 콘텐츠로 응답합니다.
- Shopify의 예제는 대상 origin으로 `location.origin`을 사용해 전송합니다. 여기에서는 `event.origin`과
  `event.source` 검사를 추가해, 양쪽이 상대방의 메시지만 받도록 했습니다.
- Save 버튼은 페이지의 타이틀 바에 있습니다. 라우트에 콘텐츠를 요청하고, 페이지가 이를 저장한 뒤
  토스트를 표시합니다. "모달에서는 토스트 같은 App Bridge 기능에 직접 접근할 수 없습니다"
  ([라우트가 있는 모달](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)).
- 라우트에는 `app-bridge.js` 스크립트 태그와 자체 CSS, JS가 필요합니다. Vite 앱에서는 모든 라우트가
  `index.html`에서 제공되며, 이 파일에 이미 스크립트가 있습니다.
- `variant="max"`는 모달을 표시하기 전에 설정해야 합니다. 그 후에는 `small`, `base`, `large`만
  설정할 수 있습니다(`UIModalElement`).

### 다른 컴포넌트에서 모달 열기 {#example-modal-by-id}

여러 테이블 행에서 여는 도움말 모달처럼, 모달을 여는 버튼이 모달과 다른 컴포넌트에 있을 때
사용합니다.

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

- `ShippingHelpModal`을 예를 들어 레이아웃에 한 번만 마운트하고, 어느 컴포넌트에서든 `show()`를
  호출하세요. `show()`와 `hide()` 메서드는 `UIModalElement`에 있으며, Shopify의
  [src 모달 예제](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route)는
  `document.getElementById`로 이를 호출합니다.
- 이 모달에는 `v-model:open`이 없으므로, 다른 곳에서 열림 여부를 알 필요가 없습니다.
- Shopify의 [Modal API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/modal-api)
  페이지는 Polaris `s-modal` 요소와 함께 `shopify.modal.show(id)`를 보여 줍니다.

### 모달이 닫히면 페이지 새로고침하기 {#example-show-hide-events}

상품을 추가하는 가져오기처럼, 모달이 페이지에 표시되는 데이터를 바꿀 때 사용합니다.

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

- `hide`는 관리자의 닫기 버튼을 포함해 모달이 어떤 방식으로 닫히든 발생하므로, 페이지는 한 곳에서
  데이터를 한 번만 다시 불러옵니다. `show`와 `hide`는 `UIModalElement`가 나열하는 이벤트입니다.
- `v-model:open`은 이미 모달을 따라갑니다. 부수 효과에는 `@show`와 `@hide`를 사용하세요.

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `open` | `boolean` | 모달이 표시되는지 여부입니다. App Bridge가 모달을 닫을 때 동기화를 유지하려면 `v-model:open`을 사용하세요. 기본값: `false`. |
| `id` | `string` | 모달의 고유 식별자입니다. |
| `variant` | `"small" \| "base" \| "large" \| "max"` | 모달의 크기입니다. 기본값: `"base"`. 모달이 표시되기 전에는 이 값 중 어느 것으로든 설정할 수 있고, 그 후에는 `small`, `base`, `large` 사이에서만 바꿀 수 있습니다. |
| `src` | `string` | 모달에 표시할 콘텐츠의 URL입니다. `src`가 있으면 `ui-title-bar`와 `ui-save-bar` 이외의 자식은 무시됩니다. |

`open`은 컴포넌트의 prop이고, `id`, `variant`, `src`는 요소에 전달되는 `ui-modal` 속성입니다.

### Events {#events}

| Event | 타입 | 설명 |
| --- | --- | --- |
| `show` | `Event` | 모달이 표시되었습니다. |
| `hide` | `Event` | 모달이 숨겨졌습니다. |
| `update:open` | `boolean` | 새 상태가 `open`과 다를 때 `show` 또는 `hide` 다음에 emit되며, `v-model:open`에 사용됩니다. |

### Slots {#slots}

| Slot | 설명 |
| --- | --- |
| `default` | 모달 콘텐츠입니다. `TitleBar`(또는 `<ui-title-bar>`)는 모달의 타이틀 바를 구성합니다. 이것과 `SaveBar`(또는 `<ui-save-bar>`)는 `ui-modal`의 직접 자식으로 유지되고, 나머지는 모두 모달의 `content`에 렌더링됩니다. |
