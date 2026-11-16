---
title: "useAppBridge() – Vue 3용 Shopify App Bridge"
description: "Vue 3용 useAppBridge()는 @shopify/app-bridge-react와 마찬가지로 Shopify App Bridge의 전역 shopify를 ShopifyGlobal 타입으로 반환합니다. Shopify 임베디드 앱용입니다."
---

# useAppBridge() {#use-app-bridge}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

`shopify` 전역 객체는 App Bridge 스크립트가 정의합니다. Shopify의 [useAppBridge 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)는 이를 `toast`, `resourcePicker` 같은 App Bridge API를 사용하는 방법으로 설명합니다.

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

## API {#reference}

`@shopify/app-bridge-types`에 있는 `ShopifyGlobal`의 최상위 멤버입니다. 설명은 타입의 JSDoc에서 가져왔고, JSDoc이 없는 멤버는 링크된 shopify.dev 페이지의 요약에서 가져왔습니다.

| 멤버 | 타입 | 설명 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | 앱의 구성: `apiKey`(`<meta name="shopify-api-key">` 태그로 제공하는 앱의 클라이언트 ID), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale`, `shop`. |
| `origin` | `string` | 타입에 설명이 없습니다. |
| `ready` | `Promise<void>` | 타입에 설명이 없습니다. |
| `setSignals` | `(RealSignal: any) => void` | 시그널 구현(예: `@preact/signals`)을 등록하여, App Bridge가 반환하는 반응형 값이 내장 shim 대신 앱 자체의 Signal 클래스를 사용하게 합니다. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos`, `intent`: 앱이 Shopify Mobile 앱에서 실행되는지, Shopify 관리자에 임베드되어 있는지, Shopify POS에서 실행되는지, 인텐트로 실행되는지를 나타냅니다. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 오래 걸리는 작업 중에 로딩 표시기를 표시합니다. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | 서버 간 인증과 API 요청을 위한 ID 토큰을 생성합니다. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | 로그인한 판매자의 이름, 이메일, 로케일 등의 정보입니다. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)`는 Shopify 관리자에 토스트 알림을 표시하고 그 ID를 반환하며, `hide(id)`는 이를 숨깁니다. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | 판매자가 제품, 컬렉션, 변형 같은 Shopify 리소스를 검색하고 선택할 수 있게 합니다. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()`는 바코드를 스캔하기 위해 기기 카메라를 열고 `ScannerPayload`로 resolve됩니다. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)`, `toggle(id)`는 ID로 모달을 표시하거나 숨기거나 전환합니다. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)`, `toggle(id)`는 ID로 저장 바를 표시하거나 숨기거나 전환하며, `leaveConfirmation()`은 저장되지 않은 변경 사항이 있을 때 페이지를 떠나기 전에 판매자에게 확인을 요청합니다. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device`, `location`: 현재 POS 장바구니를 읽고 변경하고, 앱을 닫고 POS 화면으로 돌아가고, POS 기기와 위치 정보를 가져옵니다. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`(현재 인텐트 요청, 인텐트 워크플로 밖에서는 `null`), 인텐트를 호출하는 `invoke()`, 인텐트를 완료하는 `response`, 그리고 `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)`는 Web Vitals 성능 데이터를 받는 콜백을 등록하며, `null`은 등록을 해제합니다. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)`는 판매자가 지원 버튼을 클릭할 때 실행할 함수를 등록하며, `null`은 등록을 해제합니다. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()`는 앱 리뷰 모달을 요청하며, 이 모달은 빈도 제한과 자격 조건을 충족할 때만 표시됩니다. 결과에는 `success`, `code`, `message`가 있습니다. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()`는 상점에서 앱에 부여된, 필수 및 선택적 액세스 범위를 반환하고, `request(scopes)`는 판매자에게 선택적 범위를 부여해 달라고 요청하며, `revoke(scopes)`는 부여된 선택적 범위를 취소합니다. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | 파일, 날짜 및 기타 일반적인 데이터 유형에 대한 선택 인터페이스를 표시합니다. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()`는 앱의 확장 목록과 그 상태 정보로 resolve됩니다. |
| `shopifyQL` | `ShopifyQLApi` | `available()`과 `ready()`. 그 밖의 내용은 타입에 설명이 없습니다. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | 앱에서 판매자를 위한 Sidekick 대화를 시작합니다. 항상 정의되어 있지만, 앱에서 Sidekick을 사용할 수 없으면 메서드가 reject되며, `isEnabled()`로 이를 확인합니다. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister`, `clear`는 앱 확장 구성에 이미 선언된 도구에 핸들러 함수를 연결하며, 플랫폼이 앱을 대신해 이를 호출할 수 있습니다. |
