---
title: Xây dựng Shopify embedded app với Vue 3
description: Xây dựng app Shopify với Vue 3 và Vite — tải App Bridge và Polaris web component, xác thực các lời gọi fetch tới backend, và dùng các component s-* có type trong App Home.
---

# Xây dựng Shopify embedded app với Vue 3 {#build-a-shopify-embedded-app-with-vue-3}

Một embedded app (Shopify gọi giao diện của nó là
[App Home](https://shopify.dev/docs/apps/build/app-home)) là một web app do bạn tự host
mà Shopify render trong một iframe bên trong trang admin. Bạn có thể xây dựng nó bằng
bất kỳ web framework nào, kể cả Vue 3.

Ở runtime, Shopify cung cấp cho bạn hai thứ từ CDN của họ:

- **App Bridge** (`app-bridge.js`) kết nối iframe của bạn với trang admin và cung cấp
  đối tượng toàn cục `shopify` (toast, modal, điều hướng, session token, ...).
- **Polaris web component** (`polaris-2.js`) đăng ký các custom element `<s-*>`.

`polaris-vue-elements` bổ sung các component Vue 3 có type (`SPage`, `STextField`, `SModal`, ...)
bên trên các element đó. Đây là một dự án cộng đồng, không phải do Shopify phát triển.

Tài liệu và template chính thức của Shopify nhắm tới React, vì vậy hướng dẫn này tập trung vào các
phần dành riêng cho Vue. Hướng dẫn giả định bạn đã đọc [Bắt đầu](/vi/guide/getting-started).

## Kiến trúc {#architecture}

- **Frontend:** một single-page app Vue 3 + Vite, được phục vụ từ một URL do bạn kiểm soát. Shopify
  tải nó trong iframe của trang admin.
- **Backend:** bất kỳ server nào có thể xác thực ID token của Shopify và gọi Admin API.
  Việc xác thực dùng
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  frontend gửi một ID token, backend của bạn xác thực nó rồi đổi lấy một
  access token.

`shopify app init` tạo khung một app React Router; Shopify không có template Vue hay
template nào khác ngoài React. Với một stack khác, Shopify hướng bạn tới tài liệu xác thực
của họ và thư viện API chính thức cho ngôn ngữ của bạn (có một thư viện Node.js không phụ thuộc
framework nào). Một cách tổ chức thực tế là tạo khung backend theo cách bạn
muốn, và xây dựng app Vue riêng, như mô tả bên dưới.

Trong `shopify.app.toml`, app được nhúng với `embedded = true` và `application_url`
trỏ tới nơi app của bạn được phục vụ.

## 1. Tải App Bridge và Polaris {#_1-load-app-bridge-and-polaris}

Thêm meta tag `shopify-api-key` (client ID của app) và cả hai script vào
`<head>` của `index.html`:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite thay thế các biến `%VITE_*%` trong `index.html` bằng giá trị từ môi trường của bạn
(ví dụ `VITE_SHOPIFY_API_KEY` trong `.env`). Bạn cũng có thể inject key từ
server thay vào đó.

App Bridge không được đánh phiên bản cùng Polaris: URL của nó không có phiên bản và luôn tải
App Bridge mới nhất. Về các kênh phát hành của Polaris (`polaris-2.js`, các bản phát hành được ghim), xem
[Các điểm bất thường & lưu ý](/vi/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Hãy mở app từ trang admin Shopify (ví dụ URL preview do
`shopify app dev` in ra). Nếu tải trực tiếp trong một tab trình duyệt, không có trang admin bao quanh và
các tính năng của App Bridge sẽ không hoạt động.

Để truy cập đối tượng toàn cục `shopify` có type, hãy cài package type của Shopify và
tham chiếu tới nó (Shopify hướng dẫn dùng `@shopify/app-bridge-types` cho việc này):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Cấu hình Vite {#_2-configure-vite}

Coi các tag `s-*` là custom element. Đây là cấu hình giống như trong
[Bắt đầu](/vi/guide/getting-started#_3-configure-vite):

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 3. Xây dựng một trang {#_3-build-a-page}

Trang này có một form dùng `v-model`, một nút lưu gọi tới backend của bạn, và một modal
xác nhận việc đặt lại. `SModal` được mở theo cách khai báo bằng `commandFor`/`command`;
xem [`SModal`](/vi/components/s-modal) và
[điểm bất thường về slot hành động của modal](/vi/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. Giao tiếp với backend {#_4-talk-to-your-backend}

Thông thường bạn không cần tự đính kèm token. App Bridge chặn `fetch()` và, với
các request tới domain và subdomain của app, thêm một ID token vào header `Authorization`
(cùng locale của cửa hàng trong `Accept-Language`). Một lời gọi tương đối thông thường là đủ:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

Trên server:

- Xác thực ID token ở mọi request: chữ ký HS256 với client secret của bạn, `exp`
  và `nbf`, `aud` bằng client ID của bạn, và hostname của `iss` và `dest` khớp nhau.
  Trả về `401` nếu thất bại.
- ID token hết hạn sau một phút và là bearer credential: chỉ gửi chúng tới
  backend của chính bạn.
- Đổi ID token lấy access token để gọi Admin API, và giữ token đó
  trên server.

Chỉ tự gọi `shopify.idToken()` khi bộ chặn không bao quát request đó,
chẳng hạn một kết nối WebSocket:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Nếu app của bạn chỉ cần GraphQL Admin API, App Bridge có thể định tuyến
`fetch('shopify:admin/api/graphql.json', ...)` qua trang admin khi Direct API access
được bật trong cấu hình app, mà không cần backend riêng. Xem
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Dùng các API của App Bridge từ Vue {#_5-use-app-bridge-apis-from-vue}

Mọi thứ đều nằm trên đối tượng toàn cục `shopify`; không cần plugin Vue nào.

### Toast {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` nhận `duration` (ms), `isError`, `action`, `onAction` và
`onDismiss`, và trả về một id mà bạn có thể truyền vào `shopify.toast.hide(id)`.

### Modal theo id {#modals-by-id}

Ngoài `commandFor`, `shopify.modal` điều khiển một `SModal` theo `id` của nó:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### Điều hướng app {#app-navigation}

`<s-app-nav>` render thanh điều hướng của app trong sidebar của trang admin. Hãy giữ nó được mount gần
gốc app, ví dụ trong `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

Mục đang active được suy ra từ URL hiện tại. Để điều hướng bằng code,
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
của Shopify mô tả các thẻ anchor, `open('/settings', '_self')` và History API
(`history.pushState`).

### Save bar {#save-bar}

Thêm `data-save-bar` vào một `<form>` và trang admin sẽ hiển thị save bar khi form có
thay đổi chưa lưu; `submit` được kích hoạt khi nhấn Save và `reset` khi nhấn Discard. Không kết hợp nó với
các phương thức `shopify.saveBar` theo kiểu lập trình trên cùng một form. Xem
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Bước tiếp theo {#next-steps}

- Xem [tất cả component](/vi/components/) và đọc [Các điểm bất thường & lưu ý](/vi/guide/quirks).
- Xem lại [Bắt đầu](/vi/guide/getting-started) về `v-model`, overlay và cách gõ type cho tag thô.
- Đọc [tài liệu App Home](https://shopify.dev/docs/apps/build/app-home) và
  [các API của App Bridge](https://shopify.dev/docs/api/app-home/apis) của Shopify.
