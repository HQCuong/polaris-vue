---
title: "SaveBar (ui-save-bar) – Vue 3 向け App Bridge"
description: "SaveBar は Vue 3 で Shopify App Bridge の ui-save-bar をレンダリングします。v-model:open、show と hide イベント、discardConfirmation に対応。Shopify 埋め込みアプリ向けです。"
---

# SaveBar {#save-bar}

Shopify の [SaveBar リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar)によると、保存バーは現在のページのフォームに未保存の情報があることを示します。

`SaveBar` は `ui-save-bar` をレンダリングします。`ui-save-bar` の型の説明にあるとおり、"the button with
variant `primary` is the Save button and the button without a variant is the Discard
button" です。

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

`open`、`v-model:open`、`show`/`hide`、およびアンマウント時の非表示は、[`Modal`](/ja/app-bridge/modal) と同様に動作します。
`discardConfirmation`（"whether to show a confirmation dialog when the discard button is
clicked"）は、要素の `discardConfirmation` プロパティとして設定されます。

フォームの場合は、[埋め込みアプリガイド](/ja/guide/shopify-embedded-app#save-bar)にある
`data-save-bar` 属性を使えば、コンポーネントは不要です。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。

### 保存バー付きの設定ページ {#example-settings-form}

フィールドが Vue の状態になっている設定ページに使います。状態が最後に保存した内容と異なる間、保存バーが表示されます。

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

- `dirty` は `computed` なので、`v-model:open` ではなく `:open` でバインドします。保存または破棄すると
  `dirty` が false になり、`SaveBar` はバーを非表示にします。Shopify 自身の例でも、保存と破棄のハンドラーで
  バーを非表示にしています
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- "Add the `disabled` or `loading` attribute to a button to disable it or show it as loading
  in the save bar"（ボタンに `disabled` または `loading` 属性を追加すると、保存バー内でそのボタンを無効にしたり
  読み込み中として表示したりできます）
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)）。
  `.attr` と `''`/`undefined` は、値のない `loading` 属性を追加・削除します。単純な
  `:loading="false"` では `loading="false"` とレンダリングされてしまいます。
- `discard-confirmation` は、マーチャントが Discard をクリックしたときに確認ダイアログを表示します。
- Shopify は、非同期の保存中に [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  を使うことを推奨しています
  （[保存バーのベストプラクティス](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)）。

### 再利用できる dirty フォームの composable {#example-use-dirty-form}

複数のページで同じ保存と破棄のロジックが必要な場合に使います。

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

- 各ページの `SaveBar` には、それぞれ固有の `id` を付けてください。
- composable が持つのは Vue の状態だけです。App Bridge に関わる部分は、コンポーネント側に残します。
  `SaveBar`、トースト、ボタンの `loading` と `disabled` 属性です。

### Vue Router で離れる前に確認する {#example-leave-confirmation}

マーチャントがアプリ内のリンクや `router.push()` で離れられる編集ページに使います。

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

- 保存バーが表示されている間、管理画面内のリンクは開きません。アプリが自分のルートを変更すると、
  管理画面のアドレスバーは前のページのままになり、再読み込みするとそのページが開きます。Vue Router の
  `push()` もルートの変更として扱われます
  （[Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)）。
- Shopify が挙げる 2 つのケース：マーチャントに判断させるなら、`shopify.saveBar.leaveConfirmation()` を待ちます。
  ナビゲーションによって編集が終わるなら、先に `shopify.saveBar.hide(id)` を待ちます。上のガードは、マーチャントが
  確認した後にもバーを非表示にするので、ルートが変わる前にバーが消えます。
- `leaveConfirmation()` は "resolves when the merchant confirms or when no save bar is
  visible"（マーチャントが確認したとき、または保存バーが表示されていないときに resolve される）とされています。
  マーチャントが留まることを選んだ場合に何が起きるかは、Shopify に記載がありません。その場合ガードは待ち続け、
  後のナビゲーションがそれに置き換わります。
- `SaveBar` はアンマウント時にバーを非表示にしますが、それはルートが変わった後です。Shopify：
  "Don't rely on removing the `<ui-save-bar>` element or the form from the page to hide the
  save bar."（`<ui-save-bar>` 要素やフォームをページから削除することで保存バーを非表示にしようとしないでください。）

### data-save-bar を使ったフォーム {#example-data-save-bar}

編集内容が 1 つのフォームのフィールドである場合に使います。App Bridge がフィールドを自分で追跡するので、
`SaveBar` は不要です。

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

- `submit` イベントはマーチャントが Save をクリックしたときに、`reset` イベントは Discard をクリックしたときに
  発火します。`data-discard-confirmation` は Discard の前に確認を追加します
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- App Bridge は各フィールドを保存済みの値と比較します。保存済みの値とは、マーチャントが最初に編集する前の値です。
  コードが設定した値は無視されるので、`onMounted` で読み込んだ値では保存バーは表示されません。`submit` の後、
  現在の値が保存済みの値になり、バーは非表示になります
  （[How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)）。
  その後でリクエストが失敗した場合、バーはすでに非表示なので、エラートーストがマーチャントにとって唯一の手がかりです。
- `@reset` は保存済みの値を Vue の状態に戻します。これがないと、`v-model` が破棄した値を保持したままになります。
- 使い分け：標準的なフォームには `data-save-bar`、"that isn't tied to a single form"（単一のフォームに結び付かない）
  状態には `SaveBar`（`ui-save-bar`）を使います。Shopify："Choose one approach or the other. Don't
  combine `data-save-bar` with programmatic methods on the same page"（どちらか一方の方法を選んでください。
  同じページで `data-save-bar` とプログラムによるメソッドを組み合わせないでください）
  （[Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)）。

### コードが設定する値 {#example-code-set-values}

リソースピッカーで選んだ商品のように、フォームの値が入力ではなくコードから来る場合に使います。

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

- これは Shopify の "Controlled inputs" の例を Vue にしたものです。hidden input が状態を持ち、バブリングする
  `input` イベントによって App Bridge がフォームを再度チェックします
  （[Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)）。
- コードがすでに保存済みの値を設定する場合（たとえば、すぐに保存される「デフォルトに戻す」）、Shopify は代わりに
  フォームの `requestSubmit()` を呼ぶよう案内しています。`submit` イベントによって、それらが保存済みの値になります
  （[How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)）。
- リソースピッカーは、マーチャントがキャンセルすると `undefined` を返すので、`picked?.[0]` は
  `undefined` になり、何も変更されません。

### AppWindow 内の保存バー {#example-save-bar-in-app-window}

[`AppWindow`](/ja/app-bridge/app-window) で開くエディターに使います。

ウィンドウのルートにあるフォームに `data-save-bar` を付けます。
[全画面エディターの例](/ja/app-bridge/app-window#example-window-editor)と同じです。Shopify："Don't use
a `<ui-save-bar>` on the parent page and show it from inside the window: that bar belongs to
the parent page, so it appears behind the window and merchants can't see or click Save or
Discard"（親ページに `<ui-save-bar>` を置いてウィンドウ内から表示しないでください。そのバーは親ページのものなので、
ウィンドウの背後に表示され、マーチャントは Save や Discard を見ることもクリックすることもできません）
（[Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)）。
このようなフォームに未保存の変更があるとき、ウィンドウの `hide()` は閉じる前にマーチャントに確認します
（`SAppWindowElement`）。

## Props とイベント {#reference}

### Props {#props}

| Prop | 型 | 説明 |
| --- | --- | --- |
| `open` | `boolean` | 保存バーが表示されているかどうか。App Bridge が保存バーを非表示にしたときに同期を保つには `v-model:open` を使います。デフォルト：`false`。 |
| `id` | `string` | 保存バーの一意の識別子。 |
| `discardConfirmation` | `boolean` | 破棄（discard）ボタンがクリックされたときに確認ダイアログを表示するかどうか。`SaveBar` はこれを要素の `discardConfirmation` プロパティとして設定します。 |

### Events {#events}

| Event | 型 | 説明 |
| --- | --- | --- |
| `show` | `Event` | 保存バーが表示されました。 |
| `hide` | `Event` | 保存バーが非表示になりました。 |
| `update:open` | `boolean` | 新しい状態が `open` と異なるとき、`show` または `hide` の後に emit されます。`v-model:open` 用です。 |

### Slots {#slots}

| Slot | 説明 |
| --- | --- |
| `default` | 保存ボタンとなる `<button variant="primary">` と、破棄ボタンとなる variant なしの `<button>`。型にはこれらのボタンの `disabled` と `loading` も記載されています。 |
