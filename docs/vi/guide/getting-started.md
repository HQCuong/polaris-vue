---
title: Bắt đầu với Shopify Polaris trong Vue 3
description: Cài đặt polaris-vue-elements, nạp runtime web component Shopify Polaris và dùng các wrapper Vue 3 có type như SButton và STextField với v-model trong ứng dụng Vue hoặc Shopify app.
---

# Bắt đầu {#getting-started}

`polaris-vue-elements` là một bộ component Vue 3 có type, bọc các web component Polaris
của Shopify (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). Bản thân các web component
được nạp lúc runtime từ CDN của Shopify — thư viện này chỉ cung cấp cho bạn
một lớp giao diện Vue có type và đúng phong cách Vue (props, events, v-model) bao quanh chúng.

## 1. Cài đặt {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Nạp runtime Polaris {#_2-load-the-polaris-runtime}

Các wrapper component chỉ đảm nhận phần hiển thị — chúng không đi kèm
định nghĩa custom element thực sự. Ứng dụng chủ của bạn phải nạp script runtime
Polaris của Shopify, script này đăng ký các phần tử `<s-*>` ở phạm vi toàn cục:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Cách này hoạt động trong mọi ứng dụng Vue, không chỉ bên trong Shopify Admin — các component là
custom element thuần và render ở bất cứ đâu script được nạp.

`polaris-2.js` là kênh ổn định của Shopify và là lựa chọn chúng tôi khuyên dùng cho production.
Để ghim một bản phát hành cụ thể, hoặc để hiểu phiên bản runtime liên quan thế nào
đến phiên bản của thư viện này, xem
[Các điểm bất thường & lưu ý](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 và thiết kế admin mới {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 mang đến thiết kế giao diện mới của trang admin Shopify (màu sắc, kiểu chữ,
khoảng cách và icon). Phiên bản này trở nên ổn định vào ngày 22 tháng 10 năm 2026
([thông báo](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Việc chuyển từ 1.x là tùy chọn: thay `polaris-1.js` bằng `polaris-2.js`.

- **Không cần thay đổi code.** 2.0 là bản cập nhật giao diện: các component, props,
  events và slots của nó giống với 1.1, cộng thêm một vài bổ sung (chẳng hạn
  prop `loading` của `SThumbnail`). Các ứng dụng vẫn dùng `polaris-1.js` tiếp tục hoạt động
  với các wrapper này; chỉ những phần bổ sung mới cần 2.x lúc runtime.
- **Nó tuân theo thiết kế của từng cửa hàng.** Bên trong trang admin Shopify, cửa hàng
  có thiết kế admin mới sẽ nhận giao diện mới, còn cửa hàng dùng thiết kế trước đó giữ
  giao diện 1.x. Bên ngoài admin, giao diện mới được dùng mặc định, giúp
  dễ dàng xem trước ở môi trường local.
- **Nội dung cố định (fixed) hoặc dính (sticky) gần đáy viewport** nên chừa khoảng trống
  bằng biến CSS `--shopify-safe-area-inset-bottom`
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  để thanh Sidekick nổi không che mất nó.
- **Các ứng dụng Built for Shopify** phải khớp với phong cách giao diện mới của admin trước
  **ngày 1 tháng 5 năm 2027**.

## 3. Cấu hình Vite {#_3-configure-vite}

Yêu cầu trình biên dịch của Vue coi mọi thẻ `s-*` là custom element thay vì
cố gắng resolve nó như một Vue component:

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

## 4. Component đầu tiên của bạn {#_4-your-first-component}

Import các component từ `polaris-vue-elements` và dùng chúng như mọi Vue
component khác — props và events đều có type đầy đủ:

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. v-model trên các component form {#_5-v-model-on-form-components}

Các component dạng form hỗ trợ `v-model`, được ánh xạ tới đúng cặp prop/event
bên dưới của phần tử đó (xem `src/lib/overrides.ts` để biết toàn bộ
ánh xạ — các component dạng text dùng `value`/`input`, `SCheckbox`/`SSwitch` dùng
`checked`/`change`, `SChoiceList` dùng `values`/`change`, v.v.):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. Điều khiển overlay (modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Các overlay component như `SModal` có thể được điều khiển theo hai cách:

**Theo kiểu khai báo**, với các thuộc tính HTML chuẩn `commandFor`/`command` trên
một nút kích hoạt — không cần script:

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**Theo kiểu mệnh lệnh**, bằng cách lấy một template ref có type và gọi method của
phần tử bên dưới thông qua `$el`:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. Khai báo type cho thẻ `<s-*>` thô (tùy chọn) {#_7-typing-raw-s-tags-optional}

Nếu bạn muốn tiếp tục viết các thẻ gốc của Polaris (`<s-button>`, `<s-text-field>`, …)
thay vì chuyển sang các wrapper, package vẫn có thể cung cấp type cho chúng. Bật tính năng này một lần, trong
`tsconfig.json` của bạn:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

hoặc bằng một reference trong file `.d.ts` như `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Việc này thêm mọi thẻ Polaris vào `GlobalComponents` của Vue, nhờ đó Volar và `vue-tsc` kiểm tra
các thẻ thô giống như cách chúng kiểm tra các wrapper: props có kiểu union, listener
`@click` / `@aftershow` có type, và một phần tử có type cho các method mệnh lệnh.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

Đây chỉ là type: không có gì được đăng ký lúc runtime, vì vậy hãy giữ thiết lập `isCustomElement`
từ bước 3. Hai điểm khác biệt so với các wrapper:

- **Không có `v-model` trên thẻ thô.** Tự bind `:value` và lắng nghe `@input` / `@change`,
  hoặc dùng wrapper component, vốn ánh xạ sẵn thuộc tính và
  event của từng trường form cho bạn.
- **Đừng kết hợp nó với một shim viết tay** cho cùng các thẻ trong dự án của bạn —
  hai khai báo `GlobalComponents['s-button']` với type khác nhau sẽ xung đột.
  Hãy xóa shim khi bạn bật tính năng này.

## Bước tiếp theo {#next-steps}

Xem [tài liệu tham khảo component](/vi/components/) để biết danh sách prop/event đầy đủ
của từng wrapper, hoặc đọc [Các điểm bất thường & lưu ý](/vi/guide/quirks) trước khi bạn
tự mình gặp phải chúng.

Đang xây dựng một Shopify app? Xem [Xây dựng Shopify embedded app với Vue 3](/vi/guide/shopify-embedded-app)
để biết cách nạp App Bridge, gửi request đã xác thực và dùng các API của App Bridge từ Vue.
