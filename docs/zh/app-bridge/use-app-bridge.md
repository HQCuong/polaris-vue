---
title: "useAppBridge() – 适用于 Vue 3 的 Shopify App Bridge"
description: "Vue 3 中的 useAppBridge() 返回 Shopify App Bridge 的全局 shopify，类型为 ShopifyGlobal，与 @shopify/app-bridge-react 一致。适用于 Shopify 嵌入式应用。"
---

# useAppBridge() {#use-app-bridge}

`shopify` 全局对象由 App Bridge 脚本定义。Shopify 的 [useAppBridge 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)将它描述为使用 `toast`、`resourcePicker` 等 App Bridge API 的途径。

`useAppBridge()` 返回全局 `shopify`，类型为 `ShopifyGlobal`：

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

与 `@shopify/app-bridge-react` 一样：

- 在服务器端，它返回一个对象，读取其任何属性都会抛出错误。请在 `onMounted()` 或事件处理函数中
  调用这些 API。
- 在浏览器中，如果 `shopify` 未定义，它会抛出错误，这"likely means the App
  Bridge script tag was not added correctly to this page"。

像嵌入式应用指南那样直接使用全局 `shopify` 也可以。

## API {#reference}

`@shopify/app-bridge-types` 中 `ShopifyGlobal` 的顶层成员。说明取自类型中的 JSDoc；没有 JSDoc 的成员，取自所链接的 shopify.dev 页面上的摘要。

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | 应用的配置：`apiKey`（应用的 client ID，通过 `<meta name="shopify-api-key">` 标签提供）、`appOrigins`、`debug`、`disabledFeatures`、`host`、`locale` 和 `shop`。 |
| `origin` | `string` | 类型中没有说明。 |
| `ready` | `Promise<void>` | 类型中没有说明。 |
| `setSignals` | `(RealSignal: any) => void` | 注册一个 signals 实现（例如来自 `@preact/signals`），使 App Bridge 返回的响应式值使用应用自己的 Signal 类，而不是内置的 shim。 |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`、`embedded`、`pos` 和 `intent`：应用是否运行在 Shopify Mobile 应用中、是否嵌入在 Shopify 后台中、是否运行在 Shopify POS 中，或是否作为 intent 运行。 |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 在耗时较长的操作期间显示加载指示器。 |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | 生成用于服务器到服务器身份验证和 API 请求的 ID 令牌。 |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | 当前登录商家的信息，包括姓名、邮箱和语言区域。 |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` 在 Shopify 后台中显示一条 toast 通知并返回其 ID；`hide(id)` 将其隐藏。 |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | 让商家搜索并选择产品、产品系列或变体等 Shopify 资源。 |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` 打开设备摄像头扫描条形码，并 resolve 为一个 `ScannerPayload`。 |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`、`hide(id)` 和 `toggle(id)` 按 ID 显示、隐藏或切换 modal。 |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`、`hide(id)` 和 `toggle(id)` 按 ID 显示、隐藏或切换保存栏；`leaveConfirmation()` 在有未保存的更改时，要求商家在离开页面前确认。 |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`、`close`、`device` 和 `location`：读取和修改当前 POS 购物车，关闭应用并返回 POS 界面，以及获取 POS 设备和地点的信息。 |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`（当前的 intent 请求，不在 intent 工作流程中时为 `null`）、用于调用 intent 的 `invoke()`、用于完成 intent 的 `response`，以及 `register()`。 |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` 注册一个接收 Web Vitals 性能数据的回调；传入 `null` 则取消注册。 |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` 注册一个在商家点击支持按钮时运行的函数；传入 `null` 则取消注册。 |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` 请求显示应用评价 modal，只有满足频率限制和资格条件时才会显示。结果包含 `success`、`code` 和 `message`。 |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` 返回应用在该店铺上已授予、必需和可选的访问权限范围；`request(scopes)` 请求商家授予可选范围；`revoke(scopes)` 撤销已授予的可选范围。 |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | 显示用于选择文件、日期和其他常见数据类型的界面。 |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolve 为应用的扩展列表及其状态信息。 |
| `shopifyQL` | `ShopifyQLApi` | `available()` 和 `ready()`。类型中没有其他说明。 |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | 从应用中为商家发起 Sidekick 对话。它始终有定义，但当应用无法使用 Sidekick 时，其方法会 reject；用 `isEnabled()` 检查这一点。 |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`、`unregister` 和 `clear` 为已在应用扩展配置中声明的工具绑定处理函数，平台可以代表应用调用这些函数。 |
