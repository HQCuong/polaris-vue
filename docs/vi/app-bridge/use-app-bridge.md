---
title: "useAppBridge() – Shopify App Bridge cho Vue 3"
description: "useAppBridge() cho Vue 3 trả về đối tượng toàn cục shopify của Shopify App Bridge, có type là ShopifyGlobal, giống trong @shopify/app-bridge-react. Dành cho Shopify embedded app."
---

# useAppBridge() {#use-app-bridge}

Global `shopify` được script App Bridge định nghĩa. [Tài liệu useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) của Shopify mô tả nó là cách dùng các API của App Bridge như `toast` và `resourcePicker`.

`useAppBridge()` trả về đối tượng toàn cục `shopify`, có type là `ShopifyGlobal`:

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

Giống như trong `@shopify/app-bridge-react`:

- Trên server, nó trả về một đối tượng sẽ ném lỗi khi bạn đọc bất kỳ thuộc tính nào. Hãy gọi các
  API từ `onMounted()` hoặc một event handler.
- Trong trình duyệt, nó ném lỗi nếu `shopify` chưa được định nghĩa, điều này "likely means the App
  Bridge script tag was not added correctly to this page".

Dùng trực tiếp đối tượng toàn cục `shopify`, như hướng dẫn embedded app đã làm, cũng được.

## API {#reference}

Các thành viên cấp cao nhất của `ShopifyGlobal` trong `@shopify/app-bridge-types`. Mô tả lấy từ JSDoc trong type; với thành viên không có JSDoc, mô tả lấy từ phần tóm tắt trên trang shopify.dev được liên kết.

| Thành viên | Kiểu | Mô tả |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | Cấu hình của app: `apiKey` (client ID của app, cung cấp bằng thẻ `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` và `shop`. |
| `origin` | `string` | Không được mô tả trong type. |
| `ready` | `Promise<void>` | Không được mô tả trong type. |
| `setSignals` | `(RealSignal: any) => void` | Đăng ký một bản cài đặt signals, ví dụ từ `@preact/signals`, để các giá trị reactive mà App Bridge trả về dùng class Signal của chính app thay cho bản shim có sẵn. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` và `intent`: app có chạy trong app Shopify Mobile, được nhúng trong trang admin Shopify, chạy trong Shopify POS, hoặc chạy như một intent hay không. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Hiển thị chỉ báo đang tải trong các thao tác chạy lâu. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Tạo ID token cho xác thực server-to-server và các request API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Thông tin về người bán đang đăng nhập, gồm tên, email và locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` hiển thị một thông báo toast trong trang admin Shopify và trả về ID của nó; `hide(id)` ẩn nó. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Cho người bán tìm và chọn các tài nguyên Shopify như sản phẩm, collection hoặc biến thể. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` mở camera của thiết bị để quét mã vạch và resolve thành một `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` và `toggle(id)` hiện, ẩn hoặc chuyển đổi một modal theo ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` và `toggle(id)` hiện, ẩn hoặc chuyển đổi một save bar theo ID; `leaveConfirmation()` yêu cầu người bán xác nhận trước khi rời trang khi có thay đổi chưa lưu. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` và `location`: đọc và thay đổi giỏ hàng POS hiện tại, đóng app và quay lại màn hình POS, và lấy thông tin về thiết bị và địa điểm POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (yêu cầu intent hiện tại, là `null` khi không ở trong quy trình intent), `invoke()` để gọi một intent, `response` để hoàn tất một intent, và `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` đăng ký một callback nhận dữ liệu hiệu năng Web Vitals; `null` hủy đăng ký. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` đăng ký một hàm chạy khi người bán nhấn nút hỗ trợ; `null` hủy đăng ký. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` yêu cầu một modal đánh giá app, modal này chỉ hiển thị khi đáp ứng giới hạn tần suất và điều kiện đủ tư cách. Kết quả có `success`, `code` và `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` trả về các access scope đã cấp, bắt buộc và tùy chọn của app trên shop; `request(scopes)` yêu cầu người bán cấp các scope tùy chọn; `revoke(scopes)` thu hồi các scope tùy chọn đã cấp. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Hiển thị giao diện chọn cho file, ngày và các kiểu dữ liệu thông dụng khác. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` resolve thành danh sách extension của app, kèm thông tin trạng thái. |
| `shopifyQL` | `ShopifyQLApi` | `available()` và `ready()`. Ngoài ra không được mô tả trong type. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Bắt đầu các cuộc trò chuyện Sidekick cho người bán từ app của bạn. Nó luôn được định nghĩa, nhưng các phương thức của nó reject khi app không dùng được Sidekick; `isEnabled()` kiểm tra điều này. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` và `clear` gắn các hàm xử lý cho các tool đã khai báo trong cấu hình app extension, mà nền tảng có thể gọi thay cho app. |
