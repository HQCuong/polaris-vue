---
title: "NavMenu (ui-nav-menu) – Vue 3용 App Bridge"
description: "Vue 3로 만드는 Shopify 임베디드 앱의 앱 내비게이션: Shopify는 s-app-nav를 문서화하며 이 태그는 그대로 사용할 수 있고, NavMenu는 이전 App Bridge ui-nav-menu를 렌더링합니다."
---

# 앱 내비게이션 {#app-nav}

Shopify의 [NavMenu 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)에 따르면, 앱 내비게이션은 Shopify 관리자에서 앱의 내비게이션 항목을 구성합니다.

Shopify는 앱 내비게이션에 `<s-link>` 자식을 가진 `<s-app-nav>`를 문서화합니다.
[임베디드 앱 가이드](/ko/guide/shopify-embedded-app#app-navigation)와 Shopify의
[app nav 참고 문서](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)를 참고하세요.
이 요소에도 React 컴포넌트는 없으며, Shopify의
[React 마이그레이션 가이드](https://shopify.dev/docs/api/app-bridge/migration-guide-react)는
직접 렌더링하라고 안내합니다. 따라서 이 라이브러리에는 이를 위한 컴포넌트가 없으며, 원시 태그는
기존의 `s-` `isCustomElement` 규칙으로 동작합니다.

`NavMenu`는 이전 방식인 `ui-nav-menu`를 렌더링하며, 아직 이를 사용하는 앱을 위한 것입니다.

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

두 요소가 Vue Router와 함께 어떻게 동작하는지는 아직 확인되지 않았습니다.

## Props와 이벤트 {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu`에는 prop이 없고 이벤트도 emit하지 않습니다. `UINavMenuAttributes`는 자식만 정의하며, `NavMenu`는 이를 기본 slot에서 렌더링합니다. 타입은 이 자식을 설명하지 않습니다.

| Slot | 설명 |
| --- | --- |
| `default` | 위 예시의 `<a href="/" rel="home">` 같은 내비게이션 링크입니다. |

### `s-app-nav` {#reference-app-nav}

타입에서 `s-app-nav`에는 속성이 없습니다. 자식은 링크 요소로 제공되는 내비게이션 항목입니다. 각 링크는 앱 내비게이션 메뉴에 항목을 하나 만들고, `rel="home"`이 있는 링크 하나가 기본 랜딩 페이지를 설정합니다.

타입은 이 링크의 속성을 다음과 같이 설명합니다.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `href` | `string` (필수) | 내비게이션 항목의 경로로, `/products`나 `/settings`처럼 앱 안의 상대 경로입니다. 클릭하면 전체 페이지를 다시 로드하지 않고 앱이 이 라우트로 이동하며, 앱의 라우팅에 있는 라우트와 일치해야 합니다. |
| `rel` | `"home"` | 링크를 앱의 기본 랜딩 페이지로 지정합니다. 그 링크는 내비게이션 메뉴에서 숨겨지며, `rel="home"`은 링크 하나에만 있어야 합니다. |
| `children` | `string` | 항목에 표시되는 라벨입니다. 타입은 "Products"나 "Settings"처럼 목적지를 가리키는 짧은 라벨(한두 단어)을 권장합니다. |
