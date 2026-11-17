---
title: "SaveBar (ui-save-bar) – App Bridge для Vue 3"
description: "SaveBar рендерит ui-save-bar из Shopify App Bridge во Vue 3: v-model:open, события show и hide, discardConfirmation. Для встроенных приложений Shopify."
---

# SaveBar {#save-bar}

Панель сохранения (save bar) сообщает, что форма на текущей странице содержит несохранённые данные; так её описывает [справочник по SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) Shopify.

`SaveBar` рендерит `ui-save-bar`. Как сказано в типах `ui-save-bar`, «кнопка с
вариантом `primary` — это кнопка сохранения, а кнопка без варианта — это кнопка
отмены изменений (Discard)»:

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

`open`, `v-model:open`, `show`/`hide` и скрытие при размонтировании работают так же, как у [`Modal`](/ru/app-bridge/modal).
`discardConfirmation` («показывать ли диалог подтверждения при нажатии кнопки отмены изменений») задаётся как свойство
`discardConfirmation` элемента.

Для формы атрибут `data-save-bar` из
[руководства по встроенному приложению](/ru/guide/shopify-embedded-app#save-bar) не требует компонента.

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.

### Страница настроек с панелью сохранения {#example-settings-form}

Используйте это для страницы настроек, поля которой — состояние Vue: панель сохранения показывается, пока состояние
отличается от последнего сохранённого.

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

- `dirty` — это `computed`, поэтому он привязан через `:open`, а не `v-model:open`. Сохранение или
  отмена изменений делает `dirty` равным false, и `SaveBar` скрывает панель. В собственном примере Shopify панель
  тоже скрывается в обработчиках сохранения и отмены
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- «Добавьте кнопке атрибут `disabled` или `loading`, чтобы отключить её или показать как загружающуюся
  в панели сохранения» ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` и `''`/`undefined` добавляют и удаляют атрибут `loading` без значения; обычный
  `:loading="false"` отрендерил бы `loading="false"`.
- `discard-confirmation` показывает диалог подтверждения, когда продавец нажимает «Discard».
- Shopify рекомендует использовать [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  во время асинхронного сохранения ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Переиспользуемый композабл для несохранённой формы {#example-use-dirty-form}

Используйте это, когда нескольким страницам нужна одна и та же логика сохранения и отмены.

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

- Дайте `SaveBar` каждой страницы собственный `id`.
- Композабл хранит только состояние Vue. Части, связанные с App Bridge, остаются в компоненте:
  `SaveBar`, toast-уведомление и атрибуты `loading` и `disabled` у кнопок.

### Подтверждение перед уходом со страницы с Vue Router {#example-leave-confirmation}

Используйте это на странице редактирования, которую продавец может покинуть по ссылкам приложения или через `router.push()`.

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

- Пока показана панель сохранения, ссылки в админке не открываются. Если ваше приложение меняет собственный
  маршрут, адресная строка админки сохраняет предыдущую страницу, и при перезагрузке откроется она. `push()`
  из Vue Router считается сменой маршрута
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Два случая по Shopify: если решение за продавцом, дождитесь
  `shopify.saveBar.leaveConfirmation()`; если переход завершает редактирование, сначала дождитесь
  `shopify.saveBar.hide(id)`. Приведённый выше guard также скрывает панель после того, как продавец
  подтвердил уход, чтобы панели уже не было к моменту смены маршрута.
- `leaveConfirmation()` «разрешается, когда продавец подтверждает или когда ни одна панель
  сохранения не видна». Shopify не уточняет, что происходит, если продавец решает остаться; guard
  в этом случае продолжает ждать, и следующая навигация его заменяет.
- `SaveBar` скрывает панель при размонтировании, но это происходит уже после смены маршрута. Shopify:
  «Не полагайтесь на удаление элемента `<ui-save-bar>` или формы со страницы, чтобы скрыть
  панель сохранения.»

### Форма с data-save-bar {#example-data-save-bar}

Используйте это, когда правки — это поля одной формы: App Bridge сам отслеживает поля, и
`SaveBar` не нужен.

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

- Событие `submit` срабатывает, когда продавец нажимает «Save», а событие `reset` — когда он
  нажимает «Discard». `data-discard-confirmation` добавляет подтверждение перед отменой изменений
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- App Bridge сравнивает каждое поле с его сохранённым значением: значением до первой правки
  продавца. Он игнорирует значения, которые задаёт ваш код, поэтому значения, загруженные в `onMounted`,
  не показывают панель. После `submit` текущие значения становятся сохранёнными, а
  панель скрывается
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Если после этого ваш запрос завершится ошибкой, панель уже скрыта, поэтому toast-уведомление об ошибке —
  единственный сигнал для продавца.
- `@reset` копирует сохранённые значения обратно в состояние Vue. Без него `v-model`
  сохранил бы отменённые значения.
- Что выбрать: `data-save-bar` для обычной формы, `SaveBar` (`ui-save-bar`) для состояния,
  «не привязанного к одной форме». Shopify: «Выберите один из подходов. Не
  сочетайте `data-save-bar` с программными методами на одной странице»
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Значения, которые задаёт ваш код {#example-code-set-values}

Используйте это, когда значение поля формы приходит из кода, а не вводится вручную, например товар, выбранный
в resource picker.

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

- Это пример Shopify «Controlled inputs» на Vue: скрытое поле input хранит состояние,
  а всплывающее событие `input` заставляет App Bridge заново проверить форму
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Когда ваш код задаёт значения, которые уже сохранены (например, «Сбросить к значениям по умолчанию», что
  сохраняет сразу), Shopify советует вместо этого вызвать `requestSubmit()` формы: событие `submit`
  делает их сохранёнными значениями
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- Resource picker возвращает `undefined`, когда продавец отменяет выбор, поэтому `picked?.[0]` равно
  `undefined`, и ничего не меняется.

### Панель сохранения в AppWindow {#example-save-bar-in-app-window}

Используйте это для редактора, который открывается в [`AppWindow`](/ru/app-bridge/app-window).

Поместите `data-save-bar` на форму в маршруте окна, как в
[примере полноэкранного редактора](/ru/app-bridge/app-window#example-window-editor). Shopify: «Не используйте
`<ui-save-bar>` на родительской странице, показывая его из окна: эта панель принадлежит
родительской странице, поэтому она появляется позади окна, и продавцы не могут увидеть или нажать «Save» или
«Discard»» ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
Метод `hide()` окна спрашивает продавца перед закрытием, если у такой формы есть несохранённые изменения
(`SAppWindowElement`).

## Пропсы и события {#reference}

### Пропсы {#props}

| Проп | Тип | Описание |
| --- | --- | --- |
| `open` | `boolean` | Показана ли панель сохранения. Используйте `v-model:open`, чтобы синхронизировать состояние, когда App Bridge скрывает панель сохранения. По умолчанию: `false`. |
| `id` | `string` | Уникальный идентификатор панели сохранения. |
| `discardConfirmation` | `boolean` | Показывать ли диалог подтверждения при нажатии кнопки отмены изменений. `SaveBar` задаёт его как свойство `discardConfirmation` элемента. |

### События {#events}

| Событие | Тип | Описание |
| --- | --- | --- |
| `show` | `Event` | Панель сохранения показана. |
| `hide` | `Event` | Панель сохранения скрыта. |
| `update:open` | `boolean` | Испускается после `show` или `hide`, когда новое состояние отличается от `open`, для `v-model:open`. |

### Слоты {#slots}

| Слот | Описание |
| --- | --- |
| `default` | `<button variant="primary">` — кнопка сохранения, и `<button>` без варианта — кнопка отмены изменений. Типы также перечисляют `disabled` и `loading` для этих кнопок. |
