---
title: "TitleBar (ui-title-bar) – Vue 3용 App Bridge"
description: "TitleBar는 Vue 3에서 title을 속성으로 설정해 Shopify App Bridge의 ui-title-bar를 렌더링합니다. Modal 안에서는 헤더와 푸터를 설정합니다. Shopify 임베디드 앱용입니다."
---

# TitleBar {#title-bar}

타이틀 바는 Shopify 관리자에서 앱의 맨 위에 표시되며, Shopify의 [TitleBar 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)에서 이를 사용자 지정하는 방법을 설명합니다.

`TitleBar`는 `title`을 속성으로 설정해 `ui-title-bar`를 렌더링합니다. `Modal` 안에서는
모달의 헤더와 푸터를 설정합니다. 자식은 `<button>`과 `<a>` 요소이며, `ui-title-bar` 타입은
`variant="primary"` 또는 `variant="breadcrumb"`, `tone="critical"`, 그리고
`<section label="...">` 그룹을 허용합니다. 페이지 타이틀 바의 경우 Shopify는 이제
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)를 문서화하며,
이는 [`SPage`](/ko/components/s-page)입니다.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.

### 모달의 제목과 작업 {#example-title-bar-in-modal}

모달에 제목과 푸터 버튼을 지정할 때 사용합니다. 여기서는 제목에 선택 개수가 표시되는 일괄 작업입니다.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'

const props = defineProps<{ selectedIds: string[] }>()

const open = ref(false)
const publishing = ref(false)
const title = computed(() => {
  const n = props.selectedIds.length
  return `Publish ${n} ${n === 1 ? 'product' : 'products'}?`
})

async function publish(): Promise<void> {
  if (publishing.value) return
  const shopify = useAppBridge()
  publishing.value = true
  try {
    const res = await fetch('/api/products/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: props.selectedIds }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    open.value = false
    shopify.toast.show('Products published')
  } catch {
    shopify.toast.show('Could not publish the products', { isError: true })
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton :disabled="selectedIds.length === 0" @click="open = true">Publish</SButton>
  <Modal id="publish-modal" v-model:open="open">
    <p>The products become visible on your online store.</p>
    <TitleBar :title="title">
      <button variant="primary" @click="publish">Publish</button>
      <button @click="open = false">Cancel</button>
    </TitleBar>
  </Modal>
</template>
```

- 모달에서 `TitleBar`는 모달의 헤더와 푸터를 설정합니다. Shopify의 "Simple form" 예제처럼 주 버튼에는
  `variant="primary"`를 지정하고 Cancel에는 variant를 지정하지 않습니다
  ([모달 사용하기](https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#simple-form)).
- 버튼의 클릭 핸들러는 페이지에서 실행되므로 `publish`가 토스트를 표시할 수 있습니다.
- 되돌릴 수 없는 작업에는 [삭제 확인 예제](/ko/app-bridge/modal#example-confirm-delete)처럼 주 버튼에
  `tone="critical"`을 추가하세요.
- 제목은 모달이 열리기 전에 선택 항목으로 계산됩니다. 모달이 열려 있는 동안 바뀌는 제목을 App Bridge가
  반영하는지는 확인되지 않았습니다.

### s-page로 만드는 페이지 타이틀 바 {#example-page-title-bar}

페이지의 타이틀 바에 사용합니다. Shopify는 이제 `ui-title-bar`가 아니라 `s-page`로 이를 구성합니다.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SBadge, SButton, SLink, SMenu, SPage, SSection } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

interface Product {
  title: string
  status: 'ACTIVE' | 'DRAFT'
}

const props = defineProps<{ productId: string }>()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/products/${encodeURIComponent(props.productId)}`)
  if (res.ok) product.value = (await res.json()) as Product
})

function save(): void {
  useAppBridge().toast.show('Product saved')
}
</script>

<template>
  <SPage :heading="product?.title ?? 'Product'">
    <template #breadcrumb-actions>
      <SLink href="/products">Products</SLink>
    </template>
    <template #accessory>
      <SBadge v-if="product?.status === 'DRAFT'" tone="warning">Draft</SBadge>
    </template>
    <template #primary-action>
      <SButton variant="primary" @click="save">Save</SButton>
    </template>
    <template #secondary-actions>
      <SButton commandFor="product-more-actions">More actions</SButton>
    </template>
    <SMenu id="product-more-actions">
      <SButton>Duplicate</SButton>
      <SButton tone="critical">Delete</SButton>
    </SMenu>
    <SSection heading="Details">…</SSection>
  </SPage>
</template>
```

- Shopify의 타이틀 바 문서는 `s-page`의 `breadcrumb-actions`, `accessory`, `primary-action`,
  `secondary-actions` 슬롯, `commandFor`로 여는 메뉴, 페이지당 "하나의 주요 작업"만 허용한다는 점을
  설명합니다
  ([타이틀 바](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar)).
- `heading`은 불러온 레코드를 따라가므로 타이틀 바에 상품 이름이 표시됩니다.
- `ui-title-bar` 타입은 `variant="breadcrumb"` 버튼과 링크, `<section label="...">` 그룹도
  허용합니다. Shopify의 현재 문서는 이들의 모양을 설명하지 않으므로 이 페이지에는 해당 예제가 없습니다.

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `title` | `string` | 타이틀 바의 제목입니다. `document.title`로도 설정할 수 있습니다. `TitleBar`는 이를 항상 속성으로 설정합니다. |

`TitleBar`는 이벤트를 emit하지 않습니다.

### Slots {#slots}

| Slot | 설명 |
| --- | --- |
| `default` | 아래와 같은 `<button>`, `<a>` 요소와 이를 묶는 `<section>` 그룹입니다. |

`ui-title-bar` 타입은 다음 자식을 설명합니다.

| 자식 | 속성 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 타입에는 Remix에서 anchor 요소가 지원되지 않으며 대신 Remix의 `<Link>` 컴포넌트를 사용할 수 있다고 적혀 있습니다. |
| `<section>` | `label`: `string`. 자식은 `<a>`와 `<button>` 요소입니다. |

이 타입에서 `<button>`과 `<a>`는 `id`, `name`, `class`, `href`, `rel`, `target`, `onclick`도 받습니다.
