---
title: 앱 내비게이션
description: Shopify는 앱 내비게이션에 <s-link> 자식을 가진 <s-app-nav>를 문서화합니다. 임베디드 앱 가이드와 Shopify의 app nav 참고 문서를 참고하세요.
---

# 앱 내비게이션 {#app-nav}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

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
