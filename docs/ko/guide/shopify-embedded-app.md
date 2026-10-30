---
title: Vue 3로 Shopify 임베디드 앱 만들기
description: Vue 3와 Vite로 Shopify 앱을 만드세요 — App Bridge와 Polaris web components를 로드하고, 백엔드로의 fetch 호출을 인증하며, App Home에서 타입이 지정된 s-* 컴포넌트를 사용합니다.
---

# Vue 3로 Shopify 임베디드 앱 만들기 {#build-a-shopify-embedded-app-with-vue-3}

임베디드 앱(Shopify는 이 UI를
[App Home](https://shopify.dev/docs/apps/build/app-home)이라고 부릅니다)은 직접 호스팅하는
웹 앱으로, Shopify가 관리자 안의 iframe에 렌더링합니다. Vue 3를 포함해 어떤 웹
프레임워크로든 만들 수 있습니다.

runtime에 Shopify는 CDN에서 두 가지를 제공합니다.

- **App Bridge**(`app-bridge.js`)는 iframe을 관리자와 연결하고 전역 `shopify` 객체
  (toast, modal, 내비게이션, 세션 토큰, ...)를 노출합니다.
- **Polaris web components**(`polaris-2.js`)는 `<s-*>` custom element를 등록합니다.

`polaris-vue-elements`는 이 요소들 위에 타입이 지정된 Vue 3 컴포넌트(`SPage`, `STextField`, `SModal`, ...)를
제공합니다. Shopify가 만든 것이 아니라 커뮤니티 프로젝트입니다.

Shopify의 공식 문서와 템플릿은 React를 대상으로 하므로, 이 가이드는 Vue에 해당하는 부분을
다룹니다. [시작하기](/ko/guide/getting-started)를 이미 읽었다고 가정합니다.

## 아키텍처 {#architecture}

- **프론트엔드:** 직접 관리하는 URL에서 제공되는 Vue 3 + Vite 싱글 페이지 앱입니다. Shopify가
  이를 관리자 iframe에 로드합니다.
- **백엔드:** Shopify의 ID 토큰을 검증하고 Admin API를 호출할 수 있는 서버라면 무엇이든
  됩니다. 인증에는
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization)를
  사용합니다. 프론트엔드가 ID 토큰을 보내면 백엔드가 이를 검증하고 액세스 토큰으로
  교환합니다.

`shopify app init`은 React Router 앱을 생성하며, Shopify는 Vue나 그 밖의 React가 아닌
템플릿을 제공하지 않습니다. 다른 스택의 경우 Shopify는 인증 문서와 사용하는 언어의 공식 API
라이브러리를 안내합니다(프레임워크 의존성이 없는 Node.js 라이브러리도 있습니다). 실용적인
구성 중 하나는 백엔드를 원하는 방식으로 생성하고, 아래 설명처럼 Vue 앱을 별도로 만드는
것입니다.

`shopify.app.toml`에서 `embedded = true`로 앱을 임베디드로 설정하고, `application_url`이
앱이 제공되는 위치를 가리키도록 합니다.

## 1. App Bridge와 Polaris 로드하기 {#_1-load-app-bridge-and-polaris}

`index.html`의 `<head>`에 `shopify-api-key` 메타 태그(앱의 client ID)와 두 스크립트를
추가합니다.

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite는 `index.html`의 `%VITE_*%` 변수를 환경 변수 값으로 치환합니다
(예: `.env`의 `VITE_SHOPIFY_API_KEY`). 서버에서 키를 주입할 수도 있습니다.

App Bridge는 Polaris와 함께 버전이 관리되지 않습니다. URL에 버전이 없으며 항상 최신
App Bridge를 로드합니다. Polaris 채널(`polaris-2.js`, 고정 릴리스)에 대해서는
[알려진 특이 사항](/ko/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)을 참고하세요.

앱은 Shopify 관리자에서 여세요(예: `shopify app dev`가 출력하는 미리 보기 URL).
브라우저 탭에서 직접 로드하면 주변에 관리자가 없으므로 App Bridge 기능이 동작하지 않습니다.

전역 `shopify`에 타입을 적용하려면 Shopify의 타입 패키지를 설치하고 reference를
추가하세요(Shopify는 이를 위해 `@shopify/app-bridge-types`를 안내합니다).

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Vite 설정하기 {#_2-configure-vite}

`s-*` 태그를 custom element로 취급하도록 설정합니다.
[시작하기](/ko/guide/getting-started#_3-configure-vite)와 같은 설정입니다.

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

## 3. 페이지 만들기 {#_3-build-a-page}

이 페이지에는 `v-model`을 사용하는 폼, 백엔드를 호출하는 저장 버튼, 초기화를 확인하는
모달이 있습니다. `SModal`은 `commandFor`/`command`로 선언적으로 엽니다.
[`SModal`](/ko/components/s-modal)과
[모달 액션 slot 특이 사항](/ko/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants)을 참고하세요.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. 백엔드와 통신하기 {#_4-talk-to-your-backend}

보통은 토큰을 직접 첨부할 필요가 없습니다. App Bridge가 `fetch()`를 가로채서, 앱의
도메인과 서브도메인으로 보내는 요청에 `Authorization` 헤더로 ID 토큰을 추가합니다
(`Accept-Language`에는 스토어의 로케일도 추가합니다). 일반적인 상대 경로 호출로 충분합니다.

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

서버에서는 다음을 처리합니다.

- 모든 요청에서 ID 토큰을 검증합니다. client secret을 사용한 HS256 서명, `exp`와
  `nbf`, client ID와 같은 `aud`, 그리고 일치하는 `iss`와 `dest` 호스트 이름을 확인하세요.
  실패하면 `401`로 응답합니다.
- ID 토큰은 1분 후에 만료되며 bearer 자격 증명입니다. 자신의 백엔드로만
  보내세요.
- Admin API를 호출하려면 ID 토큰을 액세스 토큰으로 교환하고, 그 토큰은 서버에
  보관하세요.

인터셉터가 처리하지 않는 요청(예: WebSocket 연결)에서만 `shopify.idToken()`을 직접
호출하세요.

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

앱에 GraphQL Admin API만 필요하다면, 앱 설정에서 Direct API access를 활성화했을 때
App Bridge가 `fetch('shopify:admin/api/graphql.json', ...)`를 관리자를 통해 라우팅하므로
별도의 백엔드가 필요 없습니다.
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api)을 참고하세요.

## 5. Vue에서 App Bridge API 사용하기 {#_5-use-app-bridge-apis-from-vue}

모든 기능은 전역 `shopify`에 있으므로 Vue 플러그인이 필요 없습니다.

### Toast {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)`는 `duration`(ms), `isError`, `action`, `onAction`,
`onDismiss`를 받으며, `shopify.toast.hide(id)`에 전달할 수 있는 id를 반환합니다.

### id로 모달 제어하기 {#modals-by-id}

`commandFor` 외에도 `shopify.modal`로 `id`를 사용해 `SModal`을 제어할 수 있습니다.

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### 앱 내비게이션 {#app-navigation}

`<s-app-nav>`는 관리자 사이드바에 앱의 내비게이션을 렌더링합니다. 앱의 루트 근처, 예를 들어
`App.vue`에 마운트된 상태로 유지하세요.

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

활성 항목은 현재 URL을 기준으로 결정됩니다. 코드에서 이동하는 방법은 Shopify의
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
문서에서 앵커, `open('/settings', '_self')`, History API(`history.pushState`)로
안내합니다.

### Save bar {#save-bar}

`<form>`에 `data-save-bar`를 추가하면 폼에 저장되지 않은 변경 사항이 있을 때 관리자가
save bar를 표시합니다. Save를 누르면 `submit`이, Discard를 누르면 `reset`이 발생합니다.
같은 폼에서 프로그래밍 방식의 `shopify.saveBar` 메서드와 함께 사용하지 마세요.
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)를 참고하세요.

## 다음 단계 {#next-steps}

- [모든 컴포넌트](/ko/components/)를 살펴보고 [알려진 특이 사항](/ko/guide/quirks)을 읽어 보세요.
- `v-model`, 오버레이, 태그 직접 사용 시의 타입 지정은 [시작하기](/ko/guide/getting-started)를 다시 참고하세요.
- Shopify의 [App Home 문서](https://shopify.dev/docs/apps/build/app-home)와
  [App Bridge API](https://shopify.dev/docs/api/app-home/apis)를 읽어 보세요.
