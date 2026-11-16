---
title: "SaveBar (ui-save-bar) – Vue 3용 App Bridge"
description: "SaveBar는 Vue 3에서 Shopify App Bridge의 ui-save-bar를 렌더링합니다. v-model:open, show와 hide 이벤트, discardConfirmation을 지원합니다. Shopify 임베디드 앱용입니다."
---

# SaveBar {#save-bar}

Shopify의 [SaveBar 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar)에 따르면, 저장 바는 현재 페이지의 폼에 저장되지 않은 정보가 있음을 나타냅니다.

`SaveBar`는 `ui-save-bar`를 렌더링합니다. `ui-save-bar` 타입에 설명되어 있듯이 "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button"입니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SaveBar } from 'polaris-vue-elements/app-bridge'

const dirty = ref(false)

function save(): void {
  dirty.value = false
}
function discard(): void {
  dirty.value = false
}
</script>

<template>
  <SaveBar id="settings-save-bar" v-model:open="dirty" discard-confirmation>
    <button variant="primary" @click="save">Save</button>
    <button @click="discard">Discard</button>
  </SaveBar>
</template>
```

`open`, `v-model:open`, `show`/`hide`, 언마운트 시 숨김은 [`Modal`](/ko/app-bridge/modal)과 같이 동작합니다.
`discardConfirmation`("whether to show a confirmation dialog when the discard button is
clicked")은 요소의 `discardConfirmation` 속성으로 설정됩니다.

폼의 경우, [임베디드 앱 가이드](/ko/guide/shopify-embedded-app#save-bar)의 `data-save-bar` 속성은
컴포넌트가 필요 없습니다.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.

### 저장 바가 있는 설정 페이지 {#example-settings-form}

필드가 Vue 상태인 설정 페이지에 사용합니다. 상태가 마지막으로 저장된 값과 다른 동안 저장 바가 표시됩니다.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SCheckbox, SPage, SSection, SStack, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Settings {
  title: string
  enabled: boolean
}

const saved = ref<Settings>({ title: '', enabled: true })
const form = ref<Settings>({ ...saved.value })
const saving = ref(false)

const dirty = computed(
  () => form.value.title !== saved.value.title || form.value.enabled !== saved.value.enabled,
)

onMounted(async () => {
  const res = await fetch('/api/settings')
  if (!res.ok) return
  saved.value = (await res.json()) as Settings
  form.value = { ...saved.value }
})

async function save(): Promise<void> {
  if (saving.value) return
  const shopify = useAppBridge()
  const values = { ...form.value }
  saving.value = true
  shopify.loading(true)
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
    shopify.loading(false)
  }
}

function discard(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Settings">
    <SaveBar id="settings-save-bar" :open="dirty" discard-confirmation>
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="save">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="form.title" label="Title" />
        <SCheckbox v-model="form.enabled" label="Enabled" />
      </SStack>
    </SSection>
  </SPage>
</template>
```

- `dirty`는 `computed`이므로 `v-model:open`이 아니라 `:open`으로 바인딩합니다. 저장하거나 취소하면
  `dirty`가 false가 되고 `SaveBar`가 바를 숨깁니다. Shopify의 예제도 저장과 취소 핸들러에서 바를
  숨깁니다
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "버튼에 `disabled` 또는 `loading` 속성을 추가하면 저장 바에서 해당 버튼을 비활성화하거나 로딩 상태로
  표시합니다"
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr`와 `''`/`undefined`는 값 없는 `loading` 속성을 추가하고 제거합니다. 일반 `:loading="false"`는
  `loading="false"`로 렌더링됩니다.
- `discard-confirmation`은 판매자가 Discard를 클릭하면 확인 대화상자를 표시합니다.
- Shopify는 비동기 저장 중에 [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)를
  사용할 것을 권장합니다
  ([저장 바 모범 사례](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### 재사용 가능한 dirty-form 컴포저블 {#example-use-dirty-form}

여러 페이지에서 같은 저장 및 취소 로직이 필요할 때 사용합니다.

::: code-group

```ts [useDirtyForm.ts]
import { computed, ref, type ComputedRef, type Ref } from 'vue'

export interface DirtyForm<T> {
  /** The values that the form edits. */
  values: Ref<T>
  /** True while `values` differs from the last saved values. */
  dirty: ComputedRef<boolean>
  saving: Ref<boolean>
  /** Sets new saved values, for example after loading them. */
  load: (next: T) => void
  /** Restores the last saved values. */
  discard: () => void
  /** Runs `persist` and, if it resolves, makes the values the saved values. */
  save: (persist: (values: T) => Promise<void>) => Promise<void>
}

// Works for JSON values (strings, numbers, booleans, arrays and plain objects).
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function useDirtyForm<T>(initial: T): DirtyForm<T> {
  const saved = ref(clone(initial)) as Ref<T>
  const values = ref(clone(initial)) as Ref<T>
  const saving = ref(false)
  const dirty = computed(() => JSON.stringify(values.value) !== JSON.stringify(saved.value))

  function load(next: T): void {
    saved.value = clone(next)
    values.value = clone(next)
  }

  function discard(): void {
    values.value = clone(saved.value)
  }

  async function save(persist: (values: T) => Promise<void>): Promise<void> {
    if (saving.value) return
    const snapshot = clone(values.value)
    saving.value = true
    try {
      await persist(snapshot)
      saved.value = snapshot
    } finally {
      saving.value = false
    }
  }

  return { values, dirty, saving, load, discard, save }
}
```

```vue [ShippingSettings.vue]
<script setup lang="ts">
import { onMounted } from 'vue'
import { SNumberField, SPage, SSection } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import { useDirtyForm } from './useDirtyForm'

// Field values are strings, as s-number-field's value is.
const { values, dirty, saving, load, discard, save } = useDirtyForm({
  freeShippingOver: '50',
  handlingDays: '2',
})

onMounted(async () => {
  const res = await fetch('/api/shipping-settings')
  if (res.ok) load((await res.json()) as typeof values.value)
})

async function onSave(): Promise<void> {
  const shopify = useAppBridge()
  try {
    await save(async (next) => {
      const res = await fetch('/api/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    })
    shopify.toast.show('Shipping settings saved')
  } catch {
    shopify.toast.show('Could not save shipping settings', { isError: true })
  }
}
</script>

<template>
  <SPage heading="Shipping">
    <SaveBar id="shipping-save-bar" :open="dirty">
      <button variant="primary" :loading.attr="saving ? '' : undefined" @click="onSave">Save</button>
      <button :disabled="saving" @click="discard">Discard</button>
    </SaveBar>
    <SSection heading="Rates">
      <SNumberField v-model="values.freeShippingOver" label="Free shipping over" :min="0" />
      <SNumberField v-model="values.handlingDays" label="Handling days" :min="0" />
    </SSection>
  </SPage>
</template>
```

:::

- 각 페이지의 `SaveBar`에는 고유한 `id`를 지정하세요.
- 컴포저블은 Vue 상태만 담습니다. App Bridge 부분은 컴포넌트에 남습니다.
  `SaveBar`, 토스트, 그리고 버튼의 `loading`과 `disabled` 속성입니다.

### Vue Router로 이동하기 전에 확인하기 {#example-leave-confirmation}

판매자가 앱 내 링크나 `router.push()`로 벗어날 수 있는 편집 페이지에 사용합니다.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { SButton, SPage, SSection, STextField } from 'polaris-vue-elements'
import { SaveBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const SAVE_BAR_ID = 'product-save-bar'

const props = defineProps<{ productId: string }>()
const router = useRouter()

const saved = ref({ title: '' })
const title = ref('')
const dirty = computed(() => title.value !== saved.value.title)
const url = computed(() => `/api/products/${encodeURIComponent(props.productId)}`)

onMounted(async () => {
  const res = await fetch(url.value)
  if (!res.ok) return
  saved.value = (await res.json()) as { title: string }
  title.value = saved.value.title
})

async function save(): Promise<void> {
  const res = await fetch(url.value, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value }),
  })
  if (res.ok) saved.value = { title: title.value }
}

// The merchant decides: wait for the confirmation, then hide the bar before the
// route changes.
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  const shopify = useAppBridge()
  await shopify.saveBar.leaveConfirmation()
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  return true
})

// The navigation ends the edit: hide the bar first, then navigate.
async function deleteProduct(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch(url.value, { method: 'DELETE' })
  if (!res.ok) {
    shopify.toast.show('Could not delete the product', { isError: true })
    return
  }
  title.value = saved.value.title
  await shopify.saveBar.hide(SAVE_BAR_ID)
  shopify.toast.show('Product deleted')
  await router.push('/products')
}
</script>

<template>
  <SPage heading="Edit product">
    <SaveBar :id="SAVE_BAR_ID" :open="dirty">
      <button variant="primary" @click="save">Save</button>
      <button @click="title = saved.title">Discard</button>
    </SaveBar>
    <SSection>
      <STextField v-model="title" label="Title" />
      <SButton tone="critical" @click="deleteProduct">Delete product</SButton>
    </SSection>
  </SPage>
</template>
```

- 저장 바가 표시되는 동안에는 관리자의 링크가 열리지 않습니다. 앱이 자체 라우트를 바꾸면 관리자의
  주소 표시줄에는 이전 페이지가 그대로 남고, 새로고침하면 그 페이지가 열립니다. Vue Router의
  `push()`도 라우트 변경으로 간주됩니다
  ([저장 바가 표시되는 동안의 탐색](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Shopify가 설명하는 두 경우: 판매자가 결정해야 하면 `shopify.saveBar.leaveConfirmation()`을
  기다리고, 탐색으로 편집이 끝나면 먼저 `shopify.saveBar.hide(id)`를 기다립니다. 위의 가드는
  판매자가 확인한 뒤에도 바를 숨겨서, 라우트가 바뀌기 전에 바가 사라지도록 합니다.
- `leaveConfirmation()`은 "판매자가 확인하거나 표시 중인 저장 바가 없을 때 resolve됩니다". 판매자가
  머무르기를 선택하면 어떻게 되는지는 Shopify가 밝히지 않습니다. 가드는 계속 기다리며, 이후의
  탐색이 이를 대체합니다.
- `SaveBar`는 언마운트될 때 바를 숨기지만, 이는 라우트가 바뀐 뒤입니다. Shopify: "`<ui-save-bar>`
  요소나 폼을 페이지에서 제거하는 방식으로 저장 바를 숨기는 데 의존하지 마세요."

### data-save-bar가 있는 폼 {#example-data-save-bar}

편집 대상이 폼 하나의 필드일 때 사용합니다. App Bridge가 필드를 직접 추적하므로 `SaveBar`가
필요하지 않습니다.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SPage, SSection, SStack, STextArea, STextField } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Profile {
  storeName: string
  description: string
}

const saved = ref<Profile>({ storeName: '', description: '' })
const form = ref<Profile>({ ...saved.value })

onMounted(async () => {
  const res = await fetch('/api/profile')
  if (!res.ok) return
  saved.value = (await res.json()) as Profile
  form.value = { ...saved.value }
})

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const values = { ...form.value }
  shopify.loading(true)
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    saved.value = values
    shopify.toast.show('Profile saved')
  } catch {
    shopify.toast.show('Could not save the profile', { isError: true })
  } finally {
    shopify.loading(false)
  }
}

function onReset(): void {
  form.value = { ...saved.value }
}
</script>

<template>
  <SPage heading="Store profile">
    <form data-save-bar data-discard-confirmation @submit.prevent="onSubmit" @reset="onReset">
      <SSection>
        <SStack gap="base">
          <STextField v-model="form.storeName" label="Store name" name="storeName" />
          <STextArea v-model="form.description" label="Description" name="description" :rows="4" />
        </SStack>
      </SSection>
    </form>
  </SPage>
</template>
```

- `submit` 이벤트는 판매자가 Save를 클릭할 때, `reset` 이벤트는 Discard를 클릭할 때 발생합니다.
  `data-discard-confirmation`은 Discard 전에 확인 단계를 추가합니다
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge는 각 필드를 저장된 값, 즉 판매자가 처음 편집하기 전의 값과 비교합니다. 코드가 설정한
  값은 무시하므로 `onMounted`에서 불러온 값은 바를 표시하지 않습니다. `submit` 후에는 현재 값이
  저장된 값이 되고 바가 숨겨집니다
  ([저장 바가 변경을 추적하는 방식](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  이후 요청이 실패하면 바는 이미 숨겨져 있으므로, 오류 토스트가 판매자에게 유일한 신호입니다.
- `@reset`은 저장된 값을 Vue 상태로 다시 복사합니다. 이것이 없으면 `v-model`이 취소된 값을
  그대로 유지합니다.
- 선택 기준: 표준 폼에는 `data-save-bar`, "단일 폼에 묶여 있지 않은" 상태에는 `SaveBar`
  (`ui-save-bar`)를 사용합니다. Shopify: "한 가지 방식을 선택하세요. 같은 페이지에서
  `data-save-bar`와 프로그래밍 방식 메서드를 함께 사용하지 마세요"
  ([저장 바](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### 코드가 설정하는 값 {#example-code-set-values}

리소스 선택기에서 고른 상품처럼, 폼 값이 입력이 아니라 코드에서 올 때 사용합니다.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SButton, SClickableChip, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface FeaturedProduct {
  id: string
  title: string
}

const saved = ref<FeaturedProduct | null>(null)
const selected = ref<FeaturedProduct | null>(null)
const hiddenInput = ref<HTMLInputElement | null>(null)

// App Bridge ignores values that code sets, so tell it with a native input event.
watch(
  selected,
  (product) => {
    const input = hiddenInput.value
    const next = product?.id ?? ''
    if (!input || input.value === next) return
    input.value = next
    input.dispatchEvent(new Event('input', { bubbles: true }))
  },
  { flush: 'post' },
)

async function pick(): Promise<void> {
  const picked = await useAppBridge().resourcePicker({ type: 'product', action: 'select' })
  const product = picked?.[0]
  if (product) selected.value = { id: product.id, title: product.title }
}

async function onSubmit(): Promise<void> {
  const shopify = useAppBridge()
  const res = await fetch('/api/featured-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: selected.value?.id ?? null }),
  })
  if (res.ok) {
    saved.value = selected.value
    shopify.toast.show('Featured product saved')
  } else {
    shopify.toast.show('Could not save the featured product', { isError: true })
  }
}

function onReset(): void {
  selected.value = saved.value
}
</script>

<template>
  <SPage heading="Storefront">
    <form data-save-bar @submit.prevent="onSubmit" @reset="onReset">
      <input ref="hiddenInput" type="hidden" name="productId" />
      <SSection heading="Featured product">
        <SClickableChip v-if="selected" removable @remove="selected = null">
          {{ selected.title }}
        </SClickableChip>
        <SButton v-else @click="pick">Select product</SButton>
      </SSection>
    </form>
  </SPage>
</template>
```

- 이것은 Shopify의 "Controlled inputs" 예제를 Vue로 옮긴 것입니다. 숨겨진 input이 상태를 담고,
  버블링되는 `input` 이벤트가 App Bridge가 폼을 다시 확인하게 합니다
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- 코드가 이미 저장된 값을 설정하는 경우(예: 즉시 저장하는 "기본값으로 재설정"), Shopify는 대신 폼의
  `requestSubmit()`을 호출하라고 안내합니다. `submit` 이벤트가 그 값을 저장된 값으로 만듭니다
  ([저장 바가 변경을 추적하는 방식](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- 판매자가 취소하면 리소스 선택기는 `undefined`를 반환하므로 `picked?.[0]`은 `undefined`이고
  아무것도 바뀌지 않습니다.

### AppWindow 안의 저장 바 {#example-save-bar-in-app-window}

[`AppWindow`](/ko/app-bridge/app-window)에서 열리는 에디터에 사용합니다.

윈도우 라우트의 폼에 `data-save-bar`를 두세요.
[전체 화면 에디터 예제](/ko/app-bridge/app-window#example-window-editor)와 같습니다. Shopify: "부모 페이지에
`<ui-save-bar>`를 두고 윈도우 안에서 표시하지 마세요. 그 바는 부모 페이지에 속하므로 윈도우 뒤에
나타나, 판매자가 Save나 Discard를 보거나 클릭할 수 없습니다"
([저장 바](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
이런 폼에 저장되지 않은 변경이 있으면 윈도우의 `hide()`는 닫기 전에 판매자에게 확인합니다
(`SAppWindowElement`).

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `open` | `boolean` | 저장 바가 표시되는지 여부입니다. App Bridge가 저장 바를 숨길 때 동기화를 유지하려면 `v-model:open`을 사용하세요. 기본값: `false`. |
| `id` | `string` | 저장 바의 고유 식별자입니다. |
| `discardConfirmation` | `boolean` | 삭제(discard) 버튼을 클릭할 때 확인 대화 상자를 표시할지 여부입니다. `SaveBar`는 이를 요소의 `discardConfirmation` 속성(property)으로 설정합니다. |

### Events {#events}

| Event | 타입 | 설명 |
| --- | --- | --- |
| `show` | `Event` | 저장 바가 표시되었습니다. |
| `hide` | `Event` | 저장 바가 숨겨졌습니다. |
| `update:open` | `boolean` | 새 상태가 `open`과 다를 때 `show` 또는 `hide` 다음에 emit되며, `v-model:open`에 사용됩니다. |

### Slots {#slots}

| Slot | 설명 |
| --- | --- |
| `default` | 저장 버튼인 `<button variant="primary">`와, 삭제 버튼인 variant 없는 `<button>`입니다. 타입에는 이 버튼들에 대한 `disabled`와 `loading`도 나와 있습니다. |
