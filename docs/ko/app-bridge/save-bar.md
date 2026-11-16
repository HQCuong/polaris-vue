---
title: "SaveBar (ui-save-bar) – Vue 3용 App Bridge"
description: "SaveBar는 Vue 3에서 Shopify App Bridge의 ui-save-bar를 렌더링합니다. v-model:open, show와 hide 이벤트, discardConfirmation을 지원합니다. Shopify 임베디드 앱용입니다."
---

# SaveBar {#save-bar}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하고, `open`에 대해서는 [Modal](/ko/app-bridge/modal)을 참고하세요.

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

`open`, `v-model:open`, `show`/`hide`, 언마운트 시 숨김은 `Modal`과 같이 동작합니다.
`discardConfirmation`("whether to show a confirmation dialog when the discard button is
clicked")은 요소의 `discardConfirmation` 속성으로 설정됩니다.

폼의 경우, [임베디드 앱 가이드](/ko/guide/shopify-embedded-app#save-bar)의 `data-save-bar` 속성은
컴포넌트가 필요 없습니다.

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
