---
title: "Modal (ui-modal) – Vue 3용 App Bridge modal"
description: "Modal은 Vue 3에서 Shopify App Bridge의 ui-modal을 렌더링합니다. v-model:open을 바인딩하고, show와 hide 이벤트를 받고, TitleBar를 추가합니다. polaris-vue-elements/app-bridge에서 가져옵니다."
---

# Modal {#modal}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

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

`shopify.modal.show(id)`와 `shopify.modal.hide(id)`도 `id`로 사용할 수 있습니다.

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
