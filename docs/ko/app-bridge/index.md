---
title: Vue용 App Bridge 컴포넌트
description: Shopify의 @shopify/app-bridge-react 컴포넌트에 대응하는 Vue 3 컴포넌트 — Modal, SaveBar, AppWindow, TitleBar, NavMenu, useAppBridge — polaris-vue-elements/app-bridge에서 제공합니다.
---

# Vue용 App Bridge 컴포넌트 {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge`는 Shopify의
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
(버전 4.3.0)에 있는 컴포넌트와 훅에 대응하는 Vue 3 컴포넌트와 훅을 제공합니다.
App Bridge 스크립트가 정의하는 App Bridge 요소를 감싸는 컴포넌트입니다.
`polaris-vue-elements`의 나머지 부분과 마찬가지로 Shopify가 만든 것이 아니라 커뮤니티 프로젝트입니다.

| Vue export | 요소 | Shopify 참고 문서 |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | 전역 `shopify` 객체 | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

이 요소들은 Shopify 관리자 안에서만 동작하므로, 이 페이지에는 라이브 데모 없이
코드 예제만 있습니다. 먼저
[Shopify 임베디드 앱 만들기](/ko/guide/shopify-embedded-app)처럼 앱을 설정하세요.

- [useAppBridge()](/ko/app-bridge/use-app-bridge)
- [Modal](/ko/app-bridge/modal)
- [TitleBar](/ko/app-bridge/title-bar)
- [SaveBar](/ko/app-bridge/save-bar)
- [AppWindow](/ko/app-bridge/app-window)
- [앱 내비게이션](/ko/app-bridge/nav-menu)

## 설치 {#install}

App Bridge 스크립트가 페이지에 있어야 합니다
([임베디드 앱 가이드의 1단계](/ko/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris) 참고).
타입을 사용하려면 Shopify의 타입 패키지를 설치하세요. 이 패키지는
`polaris-vue-elements`의 선택적 peer dependency입니다.

```sh
npm install -D @shopify/app-bridge-types
```

Shopify의
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
페이지에서는 CDN 스크립트가 항상 최신 App Bridge를 로드한다고 안내하며, 다음과 같이 말합니다. "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

그런 다음 subpath에서 import하세요.

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

`polaris-vue-elements` 메인 entry는 이 코드를 import하지 않으므로, 이 코드를 사용하지 않는 앱은
이를 로드하지 않습니다.

컴포넌트는 render function으로 요소를 렌더링하므로, 사용하기 위해 `isCustomElement`를
변경할 필요가 없습니다.

## 현재의 App Bridge 요소 {#current-elements}

Shopify의 [마이그레이션 가이드](https://shopify.dev/docs/api/app-bridge/migration-guide)는
현재의 web components를 다음과 같이 설명합니다.

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>`은 Polaris 모달이며,
  이 라이브러리에서는 [`SModal`](/ko/components/s-modal)입니다.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." 이는 [`SPage`](/ko/components/s-page)와 그 slot입니다.
- "The navigation now uses the `<s-app-nav>` web component."
  [앱 내비게이션](/ko/app-bridge/nav-menu)을 참고하세요.

`ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`는 여전히
`@shopify/app-bridge-types`와 `@shopify/app-bridge-react`에 있으며, 이 페이지의 컴포넌트는
이를 그대로 따릅니다.

## 원시 태그 {#raw-tags}

템플릿에서 요소를 직접 작성하려면(`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), `ui-` 태그도 custom element로 취급하세요.

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-') || tag.startsWith('ui-'),
    },
  },
})
```

`s-app-window`와 `s-app-nav`는 이미 `s-`로 처리됩니다.

이러한 태그의 타입 검사를 위해, `tsconfig.app.json`에 선택적 타입을 추가하세요.
`polaris-vue-elements/elements` 타입을 사용한다면 그 옆에 추가합니다.

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

이 타입은 `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window`,
`s-app-nav`와 `<button>`, `<a>`의 `variant`, `tone`, `loading` 속성에 타입을 지정합니다.
`s-page`는 `polaris-vue-elements/elements`가 타입을 지정합니다.

## 타입 {#types}

이 subpath는 `@shopify/app-bridge-react`처럼 `@shopify/app-bridge-types`의 모든 타입을
re-export하며, 여기에 `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps`, `NavMenuProps`를 더합니다.

`polaris-vue-elements/app-bridge`의 `ModalProps`는 `Modal`(`ui-modal`)용입니다. 메인
entry도 `SModal`(`s-modal`)용 `ModalProps`를 export합니다. 둘을 모두 import할 때는 하나의
이름을 바꾸세요.

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## React에서의 대응 관계 {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (또는 `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| 요소에 대한 `ref` | 템플릿 `ref` 후 `.$el` |
| `children` | 기본 slot |
| `useAppBridge()` | `useAppBridge()` |

## 자주 묻는 질문 {#faq}

### @shopify/app-bridge-react가 필요한가요? {#do-i-need-shopify-app-bridge-react}

아니요. `polaris-vue-elements/app-bridge`는 React를 사용하지 않습니다. 페이지에 있는 App Bridge
스크립트만 있으면 되며, 타입을 위해 `@shopify/app-bridge-types`가 필요합니다.

### Shopify 관리자 밖에서도 동작하나요? {#does-it-work-outside-the-shopify-admin}

아니요. App Bridge 스크립트가 앱을 관리자와 연결하고, 관리자가 모달, 저장 바(save bar),
타이틀 바를 렌더링합니다.
[임베디드 앱 가이드](/ko/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)에 설명된 대로
관리자에서 앱을 여세요.

### Modal과 SModal 중 무엇을 써야 하나요? {#should-i-use-modal-or-smodal}

Shopify의 [마이그레이션 가이드](https://shopify.dev/docs/api/app-bridge/migration-guide)는
App Bridge가 "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes"라고 말합니다. `Modal`은
`@shopify/app-bridge-react`가 여전히 제공하는 `ui-modal` 요소를 따릅니다.
