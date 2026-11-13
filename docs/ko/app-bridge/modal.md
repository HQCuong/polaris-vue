---
title: Modal
description: "Modal은 ui-modal을 렌더링합니다. v-model:open을 바인딩해 열고 닫습니다."
---

# Modal {#modal}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

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
