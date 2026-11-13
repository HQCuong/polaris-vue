---
title: useAppBridge()
description: useAppBridge()는 전역 shopify를 반환하며, 타입은 ShopifyGlobal입니다.
---

# useAppBridge() {#use-app-bridge}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

`useAppBridge()`는 전역 `shopify`를 반환하며, 타입은 `ShopifyGlobal`입니다.

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

`@shopify/app-bridge-react`와 마찬가지로 다음과 같이 동작합니다.

- 서버에서는 어떤 속성을 읽든 오류를 던지는 객체를 반환합니다. API는 `onMounted()`나
  이벤트 핸들러에서 호출하세요.
- 브라우저에서는 `shopify`가 정의되어 있지 않으면 오류를 던지며, 이는 "likely means the App
  Bridge script tag was not added correctly to this page"입니다.

임베디드 앱 가이드처럼 전역 `shopify`를 직접 사용해도 됩니다.
