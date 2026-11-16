---
title: "useAppBridge() – Shopify App Bridge for Vue 3"
description: "useAppBridge() for Vue 3 returns the Shopify App Bridge shopify global, typed as ShopifyGlobal, as in @shopify/app-bridge-react. For Shopify embedded apps."
---

# useAppBridge() {#use-app-bridge}

Before you start, see [Install](/app-bridge/#install).

The `shopify` global is defined by the App Bridge script. Shopify's [useAppBridge reference](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) describes it as the way to use App Bridge APIs such as `toast` and `resourcePicker`.

`useAppBridge()` returns the `shopify` global, typed as `ShopifyGlobal`:

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

As in `@shopify/app-bridge-react`:

- On the server it returns an object that throws when you read any property. Call the
  APIs from `onMounted()` or an event handler.
- In the browser it throws if `shopify` is not defined, which "likely means the App
  Bridge script tag was not added correctly to this page".

Using the `shopify` global directly, as the embedded-app guide does, works too.

## API {#reference}

The top-level members of `ShopifyGlobal` in `@shopify/app-bridge-types`. Descriptions come from the JSDoc in the types; where a member has none, from the summary on the linked shopify.dev page.

| Member | Type | Description |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | The app's configuration: `apiKey` (the app's client ID, provided with a `<meta name="shopify-api-key">` tag), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` and `shop`. |
| `origin` | `string` | Not described in the types. |
| `ready` | `Promise<void>` | Not described in the types. |
| `setSignals` | `(RealSignal: any) => void` | Registers a signals implementation, for example from `@preact/signals`, so that reactive values returned by App Bridge use the app's own Signal class instead of the built-in shim. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` and `intent`: whether the app runs in the Shopify Mobile app, is embedded in the Shopify admin, runs in Shopify POS, or runs as an intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Displays loading indicators during long-running operations. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Generates ID tokens for server-to-server authentication and API requests. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Information about the logged-in merchant, including their name, email and locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` displays a toast notification in the Shopify admin and returns its ID; `hide(id)` hides it. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Lets merchants search and select Shopify resources such as products, collections or variants. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` opens the device camera to scan a barcode and resolves to a `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` and `toggle(id)` show, hide or toggle a modal by its ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` and `toggle(id)` show, hide or toggle a save bar by its ID; `leaveConfirmation()` asks the merchant to confirm before leaving the page when there are unsaved changes. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` and `location`: read and change the current POS cart, close the app and return to the POS screen, and get information about the POS device and location. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (the current intent request, `null` outside an intent workflow), `invoke()` to invoke an intent, `response` to resolve one, and `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registers a callback that receives Web Vitals performance data; `null` unregisters it. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registers a function that runs when the merchant clicks the support button; `null` unregisters it. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` requests an app review modal, which only displays if rate limits and eligibility conditions are met. The result has `success`, `code` and `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` returns the app's granted, required and optional access scopes on the shop; `request(scopes)` asks the merchant to grant optional scopes; `revoke(scopes)` revokes granted optional scopes. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Displays selection interfaces for files, dates and other common data types. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolves to the app's extensions, with their status information. |
| `shopifyQL` | `ShopifyQLApi` | `available()` and `ready()`. Not otherwise described in the types. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Starts Sidekick conversations for the merchant from your app. It is always defined, but its methods reject when Sidekick is not available to the app; `isEnabled()` checks this. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` and `clear` bind handler functions for tools already declared in app extension configuration, which the platform can call on behalf of the app. |
