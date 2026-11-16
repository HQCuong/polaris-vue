---
title: "SaveBar (ui-save-bar) – App Bridge para Vue 3"
description: "SaveBar renderiza o ui-save-bar do Shopify App Bridge em Vue 3, com v-model:open, os events show e hide e discardConfirmation. Para apps incorporados da Shopify."
---

# SaveBar {#save-bar}

A barra de salvamento indica que um formulário na página atual tem informações não salvas, como descreve a [referência do SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) da Shopify.

`SaveBar` renderiza `ui-save-bar`. Como descrevem os tipos de `ui-save-bar`, "the button with
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

`open`, `v-model:open`, `show`/`hide` e o ocultamento ao desmontar funcionam como no [`Modal`](/pt/app-bridge/modal).
`discardConfirmation` ("whether to show a confirmation dialog when the discard button is
clicked") é definido como a propriedade `discardConfirmation` do elemento.

Para um formulário, o atributo `data-save-bar` do
[guia de apps incorporados](/pt/guide/shopify-embedded-app#save-bar) não precisa de componente.

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.

### Página de configurações com uma barra de salvamento {#example-settings-form}

Use isto para uma página de configurações cujos campos são estado do Vue: a barra de salvamento aparece enquanto o estado
for diferente do último estado salvo.

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

- `dirty` é um `computed`, então é vinculado com `:open`, não com `v-model:open`. Salvar ou
  descartar torna `dirty` falso, e `SaveBar` oculta a barra. O exemplo da própria Shopify também
  oculta a barra nos handlers de salvar e descartar
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- "Adicione o atributo `disabled` ou `loading` a um botão para desabilitá-lo ou exibi-lo como carregando
  na barra de salvamento" ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#the-ui-save-bar-element)).
  `.attr` e `''`/`undefined` adicionam e removem um atributo `loading` simples; um
  `:loading="false"` comum renderizaria `loading="false"`.
- `discard-confirmation` exibe uma caixa de confirmação quando o lojista clica em Discard.
- A Shopify recomenda a [Loading API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/loading-api)
  durante um salvamento assíncrono ([Save bar best practices](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#best-practices)).

### Um composable reutilizável de formulário alterado {#example-use-dirty-form}

Use isto quando várias páginas precisam da mesma lógica de salvar e descartar.

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

- Dê a cada `SaveBar` de página o seu próprio `id`.
- O composable guarda apenas estado do Vue. As partes do App Bridge ficam no componente:
  `SaveBar`, o toast e os atributos `loading` e `disabled` dos botões.

### Perguntar antes de sair com o Vue Router {#example-leave-confirmation}

Use isto em uma página de edição que o lojista pode deixar com links do app ou `router.push()`.

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

- Enquanto a barra de salvamento está visível, os links no admin não abrem. Se o seu app muda a própria
  rota, a barra de endereço do admin mantém a página anterior, e um recarregamento a abre. O
  `push()` do Vue Router conta como uma mudança de rota
  ([Navigation while the save bar shows](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api#navigation-while-the-save-bar-shows)).
- Os dois casos da Shopify: se o lojista deve decidir, espere
  `shopify.saveBar.leaveConfirmation()`; se a navegação encerra a edição, espere
  `shopify.saveBar.hide(id)` primeiro. O guard acima também oculta a barra depois que o lojista
  confirma, para que a barra tenha sumido antes de a rota mudar.
- `leaveConfirmation()` "resolve quando o lojista confirma ou quando nenhuma barra de salvamento está
  visível". A Shopify não diz o que acontece quando o lojista escolhe ficar; o guard
  continua então esperando, e uma navegação posterior o substitui.
- `SaveBar` oculta a barra quando é desmontado, mas isso acontece depois da mudança de rota. Shopify:
  "Não conte com a remoção do elemento `<ui-save-bar>` ou do formulário da página para ocultar a
  barra de salvamento."

### Um formulário com data-save-bar {#example-data-save-bar}

Use isto quando as edições são campos de um único formulário: o App Bridge acompanha os campos por conta própria, e nenhum
`SaveBar` é necessário.

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

- O evento `submit` é disparado quando o lojista clica em Save e o evento `reset` quando
  clica em Discard. `data-discard-confirmation` adiciona uma confirmação antes de Discard
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- O App Bridge compara cada campo com o valor salvo: o valor antes da primeira
  edição do lojista. Ele ignora valores que o seu código define, então os valores carregados em `onMounted`
  não exibem a barra. Depois de `submit`, os valores atuais passam a ser os valores salvos e a
  barra é ocultada
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
  Se a sua requisição falhar depois disso, a barra já está oculta, então o toast de erro é o
  único sinal para o lojista.
- `@reset` copia os valores salvos de volta para o estado do Vue. Sem ele, o `v-model` manteria
  os valores descartados.
- Qual usar: `data-save-bar` para um formulário padrão, `SaveBar` (`ui-save-bar`) para estado
  "que não está ligado a um único formulário". Shopify: "Escolha uma abordagem ou a outra. Não
  combine `data-save-bar` com métodos programáticos na mesma página"
  ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar)).

### Valores que o seu código define {#example-code-set-values}

Use isto quando um valor do formulário vem do código em vez de ser digitado, como um produto escolhido no
seletor de recursos.

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

- Este é o exemplo "Controlled inputs" da Shopify em Vue: um input oculto carrega o estado,
  e um evento `input` que sobe na árvore (bubbles) faz o App Bridge verificar o formulário de novo
  ([Save Bar API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)).
- Quando o seu código define valores que já estão salvos (por exemplo "Reset to defaults" que
  salva de imediato), a Shopify diz para chamar `requestSubmit()` do formulário: o evento
  `submit` os torna os valores salvos
  ([How the save bar tracks changes](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#how-the-save-bar-tracks-changes)).
- O seletor de recursos retorna `undefined` quando o lojista cancela, então `picked?.[0]` é
  `undefined` e nada muda.

### Barra de salvamento em um AppWindow {#example-save-bar-in-app-window}

Use isto para um editor que abre em um [`AppWindow`](/pt/app-bridge/app-window).
Coloque `data-save-bar` em um formulário na rota da janela, como no
[exemplo do editor em tela cheia](/pt/app-bridge/app-window#example-window-editor). Shopify: "Não use
um `<ui-save-bar>` na página pai para exibi-lo de dentro da janela: essa barra pertence à
página pai, então ela aparece atrás da janela e os lojistas não conseguem ver nem clicar em Save ou
Discard" ([Save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar#save-bar-in-an-iframe-window)).
O `hide()` da janela pergunta ao lojista antes de fechar quando um formulário assim tem alterações não salvas
(`SAppWindowElement`).

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `open` | `boolean` | Se a barra de salvamento está sendo exibida. Use `v-model:open` para mantê-la sincronizada quando o App Bridge oculta a barra de salvamento. Padrão: `false`. |
| `id` | `string` | Um identificador único para a barra de salvamento. |
| `discardConfirmation` | `boolean` | Se deve exibir um diálogo de confirmação quando o botão de descartar é clicado. `SaveBar` define isso como a propriedade `discardConfirmation` do elemento. |

### Events {#events}

| Event | Tipo | Descrição |
| --- | --- | --- |
| `show` | `Event` | A barra de salvamento foi exibida. |
| `hide` | `Event` | A barra de salvamento foi ocultada. |
| `update:open` | `boolean` | Emitido depois de `show` ou `hide` quando o novo estado é diferente de `open`, para `v-model:open`. |

### Slots {#slots}

| Slot | Descrição |
| --- | --- |
| `default` | Um `<button variant="primary">`, que é o botão Salvar, e um `<button>` sem variante, que é o botão Descartar. Os tipos também listam `disabled` e `loading` para esses botões. |
