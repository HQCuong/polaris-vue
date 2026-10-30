---
title: Vue 3에서 Shopify Polaris 시작하기
description: polaris-vue-elements를 설치하고 Shopify Polaris web components runtime을 로드한 뒤, Vue 앱이나 Shopify 앱에서 SButton, STextField 같은 타입이 지정된 Vue 3 wrapper를 v-model과 함께 사용하세요.
---

# 시작하기 {#getting-started}

`polaris-vue-elements`는 Shopify의 Polaris web components(`<s-button>`, `<s-text-field>`,
`<s-modal>`, ...)를 감싼 타입이 지정된 Vue 3 컴포넌트 모음입니다. web components 자체는
runtime에 Shopify의 CDN에서 로드되며, 이 라이브러리는 그 위에 타입이 지정된 Vue다운
인터페이스(props, events, v-model)를 제공할 뿐입니다.

## 1. 설치 {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Polaris runtime 로드하기 {#_2-load-the-polaris-runtime}

wrapper 컴포넌트는 표현만 담당하며, 실제 custom element 정의는 포함하지 않습니다.
호스트 앱에서 Shopify의 Polaris runtime 스크립트를 로드해야 하며, 이 스크립트가
`<s-*>` 요소를 전역으로 등록합니다.

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

이 방식은 Shopify 관리자 내부뿐 아니라 모든 Vue 앱에서 동작합니다. 컴포넌트는 일반
custom element이므로 스크립트가 로드된 곳이라면 어디서든 렌더링됩니다.

`polaris-2.js`는 Shopify의 stable 채널이며 프로덕션에 권장하는 URL입니다.
특정 릴리스로 고정하려는 경우나 runtime 버전과 이 라이브러리 버전의 관계를 알고 싶다면
[알려진 특이 사항](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)을
참고하세요.

### Polaris 2.0과 새로운 관리자 디자인 {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0은 Shopify 관리자의 새로운 시각 디자인(색상, 타이포그래피, 간격, 아이콘)을
도입합니다. 2026년 10월 22일에 stable이 되었습니다
([공지](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
1.x에서의 전환은 선택 사항이며, `polaris-1.js`를 `polaris-2.js`로 바꾸기만 하면 됩니다.

- **코드 변경이 필요 없습니다.** 2.0은 시각적 업데이트입니다. 컴포넌트, props,
  events, slots는 1.1과 같고 몇 가지가 추가되었을 뿐입니다(예: `SThumbnail`의 `loading` prop).
  `polaris-1.js`를 계속 사용하는 앱도 이 wrapper와 함께 정상 동작하며, 추가된 기능만
  runtime에 2.x가 필요합니다.
- **각 스토어의 디자인을 따릅니다.** Shopify 관리자 안에서는 새로운 관리자 디자인을 사용하는
  스토어에는 새로운 모습이, 이전 디자인을 사용하는 스토어에는 1.x 모습이 그대로 적용됩니다.
  관리자 밖에서는 기본적으로 새로운 모습이 사용되므로 로컬에서 미리 보기 쉽습니다.
- **뷰포트 하단 근처의 고정(fixed) 또는 sticky 콘텐츠**는
  `--shopify-safe-area-inset-bottom` CSS 변수로 공간을 확보해야
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api))
  떠 있는 Sidekick 바에 가려지지 않습니다.
- **Built for Shopify 앱**은 **2027년 5월 1일**까지 관리자의 새로운 시각 스타일에
  맞춰야 합니다.

## 3. Vite 설정하기 {#_3-configure-vite}

Vue 컴파일러가 모든 `s-*` 태그를 Vue 컴포넌트로 해석하려 하지 않고 custom element로
취급하도록 설정합니다.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 4. 첫 번째 컴포넌트 {#_4-your-first-component}

`polaris-vue-elements`에서 컴포넌트를 가져와 다른 Vue 컴포넌트처럼 사용하세요.
props와 events는 모두 타입이 지정되어 있습니다.

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. 폼 컴포넌트에서 v-model 사용하기 {#_5-v-model-on-form-components}

폼 형태의 컴포넌트는 `v-model`을 지원하며, 각 요소에 맞는 prop/event 쌍에 매핑됩니다
(전체 매핑은 `src/lib/overrides.ts`를 참고하세요. 텍스트 계열은 `value`/`input`,
`SCheckbox`/`SSwitch`는 `checked`/`change`, `SChoiceList`는 `values`/`change`를
사용하는 식입니다).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. 오버레이 제어하기(modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

`SModal` 같은 오버레이 컴포넌트는 두 가지 방법으로 제어할 수 있습니다.

**선언적 방식**: 트리거 버튼에 표준 HTML `commandFor`/`command` 속성을 지정합니다.
스크립트가 필요 없습니다.

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**명령형 방식**: 타입이 지정된 template ref를 가져와 `$el`을 통해 실제 요소의
메서드를 호출합니다.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. `<s-*>` 태그를 직접 사용할 때의 타입 지정(선택 사항) {#_7-typing-raw-s-tags-optional}

wrapper로 바꾸지 않고 Polaris 고유 태그(`<s-button>`, `<s-text-field>`, …)를 계속
작성하고 싶다면, 이 패키지로 해당 태그에도 타입을 지정할 수 있습니다. `tsconfig.json`에서
한 번만 활성화하세요.

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

또는 `env.d.ts` 같은 `.d.ts` 파일에서 reference를 추가합니다.

```ts
/// <reference types="polaris-vue-elements/elements" />
```

이렇게 하면 모든 Polaris 태그가 Vue의 `GlobalComponents`에 추가되어, Volar와 `vue-tsc`가
wrapper와 같은 방식으로 태그를 검사합니다. 유니온 타입 props, 타입이 지정된 `@click` /
`@aftershow` 리스너, 그리고 명령형 메서드를 위한 타입이 지정된 요소를 사용할 수 있습니다.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

타입만 제공할 뿐 runtime에 아무것도 등록하지 않으므로, 3단계의 `isCustomElement`
설정은 그대로 유지하세요. wrapper와 다른 점은 두 가지입니다.

- **태그를 직접 사용할 때는 `v-model`을 쓸 수 없습니다.** `:value`를 bind하고 `@input` / `@change`를
  직접 수신하거나, 각 폼 필드의 속성과 이벤트를 대신 매핑해 주는 wrapper 컴포넌트를
  사용하세요.
- **같은 태그에 대해 직접 작성한 shim과 함께 사용하지 마세요.** 타입이 다른
  `GlobalComponents['s-button']` 선언이 두 개 있으면 충돌합니다. 이 기능을 활성화할 때
  shim은 제거하세요.

## 다음 단계 {#next-steps}

모든 wrapper의 전체 prop/event 목록은 [컴포넌트 레퍼런스](/ko/components/)에서 확인하고,
직접 겪기 전에 [알려진 특이 사항](/ko/guide/quirks)을 읽어 보세요.

Shopify 앱을 만들고 있다면 [Vue 3로 Shopify 임베디드 앱 만들기](/ko/guide/shopify-embedded-app)에서
Vue에서 App Bridge를 로드하는 방법, 인증된 요청, App Bridge API 사용법을 확인하세요.
