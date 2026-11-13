---
title: SaveBar
description: "SaveBar는 ui-save-bar를 렌더링합니다. ui-save-bar 타입에 설명되어 있듯이 \"the button with variant primary is the Save button and the button without a variant is the Discard button\"입니다."
---

# SaveBar {#save-bar}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하고, `open`에 대해서는 [Modal](/ko/app-bridge/modal)을 참고하세요.

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

`open`, `v-model:open`, `show`/`hide`, 언마운트 시 숨김은 `Modal`과 같이 동작합니다.
`discardConfirmation`("whether to show a confirmation dialog when the discard button is
clicked")은 요소의 `discardConfirmation` 속성으로 설정됩니다.

폼의 경우, [임베디드 앱 가이드](/ko/guide/shopify-embedded-app#save-bar)의 `data-save-bar` 속성은
컴포넌트가 필요 없습니다.
