---
title: "NavMenu (ui-nav-menu) – App Bridge cho Vue 3"
description: "Điều hướng app cho Shopify embedded app trong Vue 3: Shopify ghi nhận s-app-nav, dùng được như thẻ thô, còn NavMenu render ui-nav-menu cũ hơn của App Bridge."
---

# Điều hướng app {#app-nav}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

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
