---
title: "SaveBar (ui-save-bar) – App Bridge cho Vue 3"
description: "SaveBar render ui-save-bar của Shopify App Bridge trong Vue 3, với v-model:open, các event show và hide, và discardConfirmation. Dành cho Shopify embedded app."
---

# SaveBar {#save-bar}

Save bar cho biết một form trên trang hiện tại có thông tin chưa được lưu, như [tài liệu SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) của Shopify mô tả.

`SaveBar` render `ui-save-bar`. Như type của `ui-save-bar` mô tả, "the button with
variant `primary` is the Save button and the button without a variant is the Discard
button":

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

`open`, `v-model:open`, `show`/`hide` và việc ẩn khi unmount hoạt động giống như với [`Modal`](/vi/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") được đặt làm property `discardConfirmation` của element.

Với một form, attribute `data-save-bar` trong
[hướng dẫn embedded app](/vi/guide/shopify-embedded-app#save-bar) không cần component nào.

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.

### Trang cài đặt có save bar {#example-settings-form}

Dùng cách này cho một trang cài đặt có các field là state của Vue: save bar hiện khi state
khác với lần lưu gần nhất.
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
- `dirty` là một `computed`, nên nó được gắn bằng `:open`, không phải `v-model:open`. Lưu hoặc
  hủy làm `dirty` thành false, và `SaveBar` ẩn thanh đó. Ví dụ của Shopify cũng
  ẩn thanh trong các handler lưu và hủy
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Add the `disabled` or `loading` attribute to a button to disable it or show it as loading
  in the save bar" (Thêm attribute `disabled` hoặc `loading` vào nút để vô hiệu hóa nó hoặc hiển thị trạng thái đang tải trong save bar) ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` cùng `''`/`undefined` thêm và gỡ attribute `loading` trần; một
  `:loading="false"` thông thường sẽ render `loading="false"`.
- `discard-confirmation` hiển thị hộp thoại xác nhận khi người bán bấm Discard.
- Shopify khuyên dùng [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  trong lúc lưu bất đồng bộ ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Một composable form dirty dùng lại được {#example-use-dirty-form}

Dùng cách này khi nhiều trang cần cùng logic lưu và hủy.

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

- Hãy cho `SaveBar` của mỗi trang một `id` riêng.
- Composable chỉ giữ state của Vue. Các phần của App Bridge vẫn nằm trong component:
  `SaveBar`, toast, và các attribute `loading` và `disabled` của nút.

### Hỏi trước khi rời trang với Vue Router {#example-leave-confirmation}

Dùng cách này trên một trang chỉnh sửa mà người bán có thể rời đi bằng link trong app hoặc `router.push()`.
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
- Khi save bar đang hiện, các link trong admin không mở. Nếu app của bạn đổi
  route của chính nó, thanh địa chỉ của admin giữ trang trước đó, và tải lại sẽ mở trang đó. `push()` của Vue
  Router được tính là một lần đổi route
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Hai trường hợp của Shopify: nếu người bán nên là người quyết định, hãy đợi
  `shopify.saveBar.leaveConfirmation()`; nếu việc điều hướng kết thúc phiên chỉnh sửa, hãy đợi
  `shopify.saveBar.hide(id)` trước. Guard ở trên cũng ẩn thanh sau khi người bán
  xác nhận, để thanh biến mất trước khi route đổi.
- `leaveConfirmation()` "resolves when the merchant confirms or when no save bar is
  visible" (resolve khi người bán xác nhận hoặc khi không có save bar nào đang hiện). Shopify không nói điều gì xảy ra khi người bán chọn ở lại; guard
  khi đó tiếp tục đợi, và một lần điều hướng sau đó sẽ thay thế nó.
- `SaveBar` ẩn thanh khi unmount, nhưng việc đó diễn ra sau khi route đổi. Shopify:
  "Don't rely on removing the `<ui-save-bar>` element or the form from the page to hide the
  save bar." (Đừng dựa vào việc gỡ element `<ui-save-bar>` hoặc form khỏi trang để ẩn
  save bar.)

### Một form có data-save-bar {#example-data-save-bar}

Dùng cách này khi các chỉnh sửa là field của một form: App Bridge tự theo dõi các field, và không cần
`SaveBar`.
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
- Event `submit` được phát khi người bán bấm Save và event `reset` khi họ
  bấm Discard. `data-discard-confirmation` thêm một bước xác nhận trước Discard
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge so sánh từng field với giá trị đã lưu của nó: giá trị trước lần chỉnh sửa
  đầu tiên của người bán. Nó bỏ qua các giá trị do code của bạn đặt, nên các giá trị được tải trong `onMounted`
  không làm hiện thanh. Sau `submit`, các giá trị hiện tại trở thành giá trị đã lưu và
  thanh ẩn đi
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Nếu request của bạn sau đó thất bại, thanh đã bị ẩn rồi, nên toast lỗi là
  tín hiệu duy nhất người bán nhận được.
- `@reset` sao chép các giá trị đã lưu trở lại state của Vue. Nếu không có nó, `v-model` sẽ
  giữ các giá trị đã bị hủy.
- Chọn cách nào: `data-save-bar` cho một form chuẩn, `SaveBar` (`ui-save-bar`) cho state
  "that isn't tied to a single form" (không gắn với một form duy nhất). Shopify: "Choose one approach or the other. Don't
  combine `data-save-bar` with programmatic methods on the same page" (Hãy chọn một cách hoặc cách kia. Đừng
  kết hợp `data-save-bar` với các method lập trình trên cùng một trang)
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Các giá trị do code của bạn đặt {#example-code-set-values}

Dùng cách này khi một giá trị của form đến từ code thay vì từ việc gõ, ví dụ một sản phẩm được chọn trong
resource picker.
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
- Đây là ví dụ "Controlled inputs" của Shopify viết bằng Vue: một input ẩn mang state,
  và một event `input` có bubble khiến App Bridge kiểm tra lại form
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Khi code của bạn đặt các giá trị vốn đã được lưu (ví dụ "Reset to defaults" lưu
  ngay lập tức), Shopify bảo hãy gọi `requestSubmit()` của form thay vào đó: event `submit`
  biến chúng thành giá trị đã lưu
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- Resource picker trả về `undefined` khi người bán hủy, nên `picked?.[0]` là
  `undefined` và không có gì thay đổi.

### Save bar trong một AppWindow {#example-save-bar-in-app-window}

Dùng cách này cho một editor mở trong [`AppWindow`](/vi/app-bridge/app-window).

Đặt `data-save-bar` trên một form trong route của window, như trong
[ví dụ editor toàn màn hình](/vi/app-bridge/app-window#example-window-editor). Shopify: "Don't use
a `<ui-save-bar>` on the parent page and show it from inside the window: that bar belongs to
the parent page, so it appears behind the window and merchants can't see or click Save or
Discard" (Đừng dùng `<ui-save-bar>` trên trang cha rồi hiển thị nó từ bên trong window: thanh đó thuộc về
trang cha, nên nó hiện phía sau window và người bán không thể thấy hay bấm Save hoặc
Discard) ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
`hide()` của window hỏi người bán trước khi đóng khi một form như vậy có thay đổi chưa lưu
(`SAppWindowElement`).

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `open` | `boolean` | Save bar có đang hiện hay không. Dùng `v-model:open` để giữ đồng bộ khi App Bridge ẩn save bar. Mặc định: `false`. |
| `id` | `string` | Định danh duy nhất của save bar. |
| `discardConfirmation` | `boolean` | Có hiện hộp thoại xác nhận khi nhấn nút discard hay không. `SaveBar` đặt nó làm property `discardConfirmation` của element. |

### Events {#events}

| Event | Kiểu | Mô tả |
| --- | --- | --- |
| `show` | `Event` | Save bar đã hiện. |
| `hide` | `Event` | Save bar đã ẩn. |
| `update:open` | `boolean` | Phát ra sau `show` hoặc `hide` khi trạng thái mới khác với `open`, dùng cho `v-model:open`. |

### Slots {#slots}

| Slot | Mô tả |
| --- | --- |
| `default` | Một `<button variant="primary">` là nút Save, và một `<button>` không có variant là nút Discard. Type cũng liệt kê `disabled` và `loading` cho các nút này. |
