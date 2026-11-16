---
title: "useAppBridge() – Vue 3 के लिए Shopify App Bridge"
description: "Vue 3 के लिए useAppBridge() Shopify App Bridge का shopify global लौटाता है, जिसका type ShopifyGlobal है, जैसा @shopify/app-bridge-react में। Shopify embedded apps के लिए।"
---

# useAppBridge() {#use-app-bridge}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें।

`shopify` global को App Bridge script define करता है। Shopify का [useAppBridge reference](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) इसे `toast` और `resourcePicker` जैसी App Bridge APIs इस्तेमाल करने का तरीका बताता है।

`useAppBridge()` `shopify` global लौटाता है, जिसका type `ShopifyGlobal` है:

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

`@shopify/app-bridge-react` की तरह:

- Server पर यह एक ऐसा object लौटाता है जो किसी भी property को पढ़ने पर error throw करता है। APIs को
  `onMounted()` या किसी event handler से call करें।
- Browser में, अगर `shopify` परिभाषित नहीं है तो यह error throw करता है, जिसका मतलब "likely means the App
  Bridge script tag was not added correctly to this page" है।

`shopify` global को सीधे इस्तेमाल करना, जैसा embedded-app guide करती है, भी काम करता है।

## API {#reference}

`@shopify/app-bridge-types` में `ShopifyGlobal` के top-level members। विवरण types के JSDoc से लिए गए हैं; जिस member का JSDoc नहीं है, उसका विवरण linked shopify.dev page के summary से लिया गया है।

| Member | Type | विवरण |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | App का configuration: `apiKey` (app का client ID, जो `<meta name="shopify-api-key">` tag से दिया जाता है), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` और `shop`। |
| `origin` | `string` | Types में इसका विवरण नहीं है। |
| `ready` | `Promise<void>` | Types में इसका विवरण नहीं है। |
| `setSignals` | `(RealSignal: any) => void` | एक signals implementation register करता है, जैसे `@preact/signals` से, ताकि App Bridge जो reactive values लौटाता है वे built-in shim की जगह app की अपनी Signal class इस्तेमाल करें। |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` और `intent`: app Shopify Mobile app में चल रहा है या नहीं, Shopify admin में embedded है या नहीं, Shopify POS में चल रहा है या नहीं, या intent के रूप में चल रहा है या नहीं। |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | लंबे operations के दौरान loading indicators दिखाता है। |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Server-to-server authentication और API requests के लिए ID tokens बनाता है। |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Logged-in merchant की जानकारी, जिसमें उनका नाम, email और locale शामिल हैं। |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` Shopify admin में एक toast notification दिखाता है और उसका ID लौटाता है; `hide(id)` उसे छिपाता है। |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Merchants को products, collections या variants जैसे Shopify resources खोजने और चुनने देता है। |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` barcode scan करने के लिए device का camera खोलता है और एक `ScannerPayload` में resolve होता है। |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` और `toggle(id)` किसी modal को उसके ID से दिखाते, छिपाते या toggle करते हैं। |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` और `toggle(id)` किसी save bar को उसके ID से दिखाते, छिपाते या toggle करते हैं; बिना save किए बदलाव होने पर `leaveConfirmation()` page छोड़ने से पहले merchant से पुष्टि माँगता है। |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` और `location`: मौजूदा POS cart पढ़ना और बदलना, app बंद करके POS screen पर लौटना, और POS device और location की जानकारी लेना। |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (मौजूदा intent request, intent workflow के बाहर `null`), intent invoke करने के लिए `invoke()`, intent resolve करने के लिए `response`, और `register()`। |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` एक callback register करता है जिसे Web Vitals performance data मिलता है; `null` उसे unregister करता है। |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` एक function register करता है जो merchant के support button पर click करने पर चलता है; `null` उसे unregister करता है। |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` एक app review modal माँगता है, जो सिर्फ़ तभी दिखता है जब rate limits और eligibility conditions पूरी हों। Result में `success`, `code` और `message` होते हैं। |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` shop पर app के granted, required और optional access scopes लौटाता है; `request(scopes)` merchant से optional scopes देने को कहता है; `revoke(scopes)` दिए गए optional scopes वापस लेता है। |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Files, dates और दूसरे आम data types के लिए selection interfaces दिखाता है। |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` app के extensions और उनकी status जानकारी में resolve होता है। |
| `shopifyQL` | `ShopifyQLApi` | `available()` और `ready()`। इसके अलावा types में इसका विवरण नहीं है। |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | आपके app से merchant के लिए Sidekick conversations शुरू करता है। यह हमेशा defined रहता है, लेकिन app के लिए Sidekick उपलब्ध न होने पर इसके methods reject होते हैं; `isEnabled()` यह जाँचता है। |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` और `clear` उन tools के लिए handler functions जोड़ते हैं जो app extension configuration में पहले से declared हैं, और जिन्हें platform app की ओर से call कर सकता है। |
