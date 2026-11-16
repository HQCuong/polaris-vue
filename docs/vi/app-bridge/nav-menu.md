---
title: "NavMenu (ui-nav-menu) – App Bridge cho Vue 3"
description: "Điều hướng app cho Shopify embedded app trong Vue 3: Shopify ghi nhận s-app-nav, dùng được như thẻ thô, còn NavMenu render ui-nav-menu cũ hơn của App Bridge."
---

# Điều hướng app {#app-nav}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

App nav cấu hình các mục điều hướng của app trong trang admin Shopify, như [tài liệu NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) của Shopify mô tả.

Shopify ghi nhận `<s-app-nav>` với các con `<s-link>` cho điều hướng app; xem
[hướng dẫn embedded app](/vi/guide/shopify-embedded-app#app-navigation) và
[tài liệu tham khảo app nav](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)
của Shopify. Nó cũng không có component React;
[hướng dẫn migration React](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
của Shopify bảo render trực tiếp nó. Vì vậy thư viện này không có component cho nó, và tag
thô hoạt động với quy tắc `isCustomElement` `s-` hiện có.

`NavMenu` render `ui-nav-menu` cũ hơn, dành cho các app vẫn còn dùng nó:

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

Cách một trong hai element này hoạt động cùng Vue Router vẫn chưa được xác minh.

## Props và sự kiện {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` không có prop và không phát ra sự kiện: `UINavMenuAttributes` chỉ định nghĩa các con, được `NavMenu` render từ default slot. Type không mô tả các con này.

| Slot | Mô tả |
| --- | --- |
| `default` | Các link điều hướng, như `<a href="/" rel="home">` trong ví dụ ở trên. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` không có attribute nào trong type. Các con của nó là các mục điều hướng, dưới dạng element link: mỗi link tạo một mục trong menu điều hướng của app, và một link có `rel="home"` đặt trang đích mặc định.

Type mô tả các attribute của những link này:

| Attribute | Kiểu | Mô tả |
| --- | --- | --- |
| `href` | `string` (bắt buộc) | Đường dẫn của mục điều hướng, tương đối trong app, như `/products` hoặc `/settings`. Khi nhấn, app điều hướng tới route này mà không tải lại toàn trang; nó nên khớp với một route trong phần routing của app. |
| `rel` | `"home"` | Đánh dấu link là trang đích mặc định của app. Link đó bị ẩn khỏi menu điều hướng, và chỉ nên có một link có `rel="home"`. |
| `children` | `string` | Nhãn hiển thị của mục. Type khuyên dùng nhãn ngắn (một hoặc hai từ) gọi tên nơi đến, như "Products" hoặc "Settings". |
