---
title: "NavMenu (ui-nav-menu) – App Bridge cho Vue 3"
description: "Điều hướng app cho Shopify embedded app trong Vue 3: Shopify ghi nhận s-app-nav, dùng được như thẻ thô, còn NavMenu render ui-nav-menu cũ hơn của App Bridge."
---

# Điều hướng app {#app-nav}

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

## Ví dụ {#examples}

Các ví dụ này dựa theo tài liệu của Shopify và chưa được thử trong một trang admin thật.

### Điều hướng app từ các route Vue Router của bạn {#example-app-nav-routes}

Dùng cách này để giữ điều hướng app của admin và các route của bạn ở cùng một chỗ: các link được render
từ bảng route.

::: code-group
```ts [router.ts]
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** The label of the route in the app nav. Routes without one are not in the nav. */
    navLabel?: string
  }
}

export const HOME_PATH = '/app'

export const routes: RouteRecordRaw[] = [
  { path: HOME_PATH, component: () => import('./pages/HomePage.vue') },
  {
    path: '/app/templates',
    component: () => import('./pages/TemplatesPage.vue'),
    meta: { navLabel: 'Templates' },
  },
  {
    path: '/app/settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: { navLabel: 'Settings' },
  },
  // Not in the nav: reached from the templates list.
  { path: '/app/templates/:id', component: () => import('./pages/TemplatePage.vue') },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <s-app-nav>
    <s-link :href="HOME_PATH" rel="home">Home</s-link>
    <s-link v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</s-link>
  </s-app-nav>
  <RouterView />
</template>
```
:::

- Tên app ở thanh bên đã link đến `/`. Shopify chỉ thêm link `rel="home"` khi
  trang chủ nằm ở chỗ khác, ví dụ `/app`; link đó bị ẩn khỏi menu
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Link không thể lồng nhau, và nhãn nên là danh từ ngắn, như "Templates" hoặc
  "Settings" (cùng trang).
- Với `createWebHistory()`, Vue Router đổi route bằng `history.pushState()`, và
  App Bridge gửi từng đường dẫn mới đến thanh địa chỉ của admin
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- [Hướng dẫn migrate navigation](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  của Shopify yêu cầu bạn kiểm tra việc tải trực tiếp, back và forward, và mục đang active có theo
  các lần đổi route hay không.

### NavMenu từ cùng các route {#example-nav-menu-routes}

Dùng cách này nếu app của bạn vẫn dùng `ui-nav-menu`.
```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NavMenu } from 'polaris-vue-elements/app-bridge'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <NavMenu>
    <a :href="HOME_PATH" rel="home">Home</a>
    <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
  </NavMenu>
  <RouterView />
</template>
```
- Ví dụ này dùng `router.ts` của ví dụ trước. Các con của `ui-nav-menu` là element `<a>`;
  các type không mô tả chúng chi tiết hơn.

### Link đến các trang của Shopify admin {#example-admin-links}

Dùng cách này để đưa người bán từ app của bạn đến một sản phẩm, đơn hàng hoặc khách hàng trong admin.
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SStack } from 'polaris-vue-elements'

const props = defineProps<{ productGid: string }>()

// 'gid://shopify/Product/123' → '123'
const productId = computed(() => props.productGid.split('/').pop() ?? '')
</script>

<template>
  <SStack direction="inline" gap="base">
    <a :href="`shopify://admin/products/${productId}`" target="_top">View in Shopify admin</a>
    <a href="shopify://admin/orders" target="_top">Orders</a>
    <a href="https://help.example.com" target="_blank">Help center</a>
  </SStack>
</template>
```
- Giao thức `shopify:` với `target="_top"` mở các trang admin: các trang danh sách như
  `shopify://admin/orders`, hoặc một resource "by appending the resource ID" (bằng cách thêm ID của resource)
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` mở một URL bên ngoài trong tab mới, và admin vẫn mở (cùng trang).

### Điều hướng từ code {#example-navigate-from-code}

Dùng cách này để đi đến một trang sau một hành động, ví dụ mở một bản ghi bạn vừa tạo.
```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const router = useRouter()

async function createTemplate(): Promise<void> {
  const res = await fetch('/api/templates', { method: 'POST' })
  if (!res.ok) {
    useAppBridge().toast.show('Could not create the template', { isError: true })
    return
  }
  const { id } = (await res.json()) as { id: string }
  await router.push(`/app/templates/${encodeURIComponent(id)}`)
}
</script>

<template>
  <SButton variant="primary" @click="createTemplate">Create template</SButton>
</template>
```
- `router.push()` dùng `history.pushState()`, mà App Bridge theo dõi. Shopify cũng
  ghi lại `open('/settings', '_self')` cho đường dẫn tương đối
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Nếu một save bar có thể đang hiện, hãy ẩn nó hoặc hỏi trước; xem
  [Hỏi trước khi rời trang với Vue Router](/vi/app-bridge/save-bar#example-leave-confirmation).

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
