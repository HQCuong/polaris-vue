<div align="center">

<sub>[English](../../README.md) | **Tiếng Việt**</sub>

<br>

<a href="https://polaris-vue-elements.dev/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: Vue 3 wrapper có type cho Shopify Polaris web components" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Tài liệu](https://polaris-vue-elements.dev/)** ·
[Bắt đầu](https://polaris-vue-elements.dev/guide/getting-started) ·
[Components](https://polaris-vue-elements.dev/components/) ·
[Hướng dẫn embedded app](https://polaris-vue-elements.dev/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Bản dịch này có thể chậm hơn bản tiếng Anh. Nếu có chỗ không khớp, [bản tiếng Anh](../../README.md) là bản chính thức.

Các Vue 3 wrapper component có type đầy đủ cho [Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components): các custom element `s-*` dùng để xây dựng app Shopify App Home (embedded trong trang admin).

Runtime Polaris vẫn được tải từ CDN của Shopify (kênh ổn định `polaris-2.js` tự động nhận các bản cập nhật tương thích). Thư viện này cho bạn một lớp Vue đúng chuẩn, có type đầy đủ, nằm bên trên runtime đó.

## Tính năng

- **Props và events có type cho cả 62 component**, được generate từ Custom Elements Manifest chính thức của Shopify (`@shopify/polaris-types`): props dạng union như `variant`, autocomplete trong template, listener `@click` / `@aftershow` có type.
- **`v-model` trên 17 form component** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), mỗi component được map đúng cặp property/event của nó.
- **Điều khiển overlay bằng code.** `SModal` expose `$el` có type (`ModalElement`), nên `modal.value?.$el.showOverlay()` qua được type-check, bên cạnh cách khai báo `commandFor` / `command` của Polaris.
- **Không bao giờ chặn bạn.** Prop lạ được truyền thẳng qua `$attrs`, slot được chuyển nguyên vẹn, và component Polaris mới ra luôn dùng được dưới dạng thẻ `s-*` gốc. Wrapper cũ chỉ thiếu type cho tính năng mới, không bao giờ làm hỏng code đang chạy.

## Cài đặt

```sh
npm install polaris-vue-elements
```

Vue `^3.5` là peer dependency.

### Thiết lập runtime (bắt buộc)

Các wrapper chỉ lo phần giao diện. App của bạn cần tải runtime Polaris từ CDN của Shopify và báo cho Vue biết các thẻ `s-*` là custom element:

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **Lưu ý:** `polaris-2.js` là kênh ổn định của Shopify, mang giao diện mới của trang admin. App vẫn dùng `polaris-1.js` vẫn chạy bình thường: API component của 2.0 giống 1.1, chỉ thêm vài thứ. Xem [Polaris 2.0 and the new admin design](https://polaris-vue-elements.dev/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Bắt đầu nhanh

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **Mẹo:** thích viết thẳng thẻ `<s-button>` của Polaris hơn? Thêm `"types": ["polaris-vue-elements/elements"]` vào `tsconfig.json`, Volar / `vue-tsc` sẽ type-check cả thẻ `<s-*>` gốc (chỉ có type; `v-model` vẫn chỉ có ở wrapper). Xem [Typing raw `<s-*>` tags](https://polaris-vue-elements.dev/guide/getting-started#_7-typing-raw-s-tags-optional).

## Tài liệu

Toàn bộ tài liệu (hiện bằng tiếng Anh) ở **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/)**:

- [Getting started](https://polaris-vue-elements.dev/guide/getting-started): thiết lập, `v-model`, overlay và type cho thẻ gốc.
- [Build a Shopify embedded app with Vue 3](https://polaris-vue-elements.dev/guide/shopify-embedded-app): App Bridge, `fetch` có xác thực, điều hướng và save bar.
- [Known quirks](https://polaris-vue-elements.dev/guide/quirks): các hành vi của Polaris đã được kiểm chứng trên trình duyệt thật.
- [Component reference](https://polaris-vue-elements.dev/components/): props, events, slots, best practices và ví dụ chạy trực tiếp cho cả 62 component.

Mã nguồn của site nằm trong [`docs/`](../../docs); chạy ở máy bằng `npm run docs:dev`.

## Cách hoạt động

Mọi thứ suy ra được từ manifest của Shopify đều được generate tự động; phần cần con người quyết định chỉ nằm trong một file nhỏ.

```
@shopify/polaris-types (custom-elements.json)   ← nguồn chuẩn
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, type Props/Events/Element, components (KHÔNG SỬA TAY)
src/lib/runtime/          ← createWrapper: một factory dùng chung cho cả 62 component
src/lib/overrides.ts      ← viết tay: chỉ có các mapping v-model
```

Các test chống lệch (drift-guard) khiến việc quên cập nhật là không thể: CI sẽ fail nếu code generated đã cũ, nếu một component trong manifest chưa có wrapper, hoặc nếu một component dạng form mới thiếu override cho v-model. Một workflow chạy theo lịch ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) tự mở PR đồng bộ mỗi khi `@shopify/polaris-types` có bản mới.

<details>
<summary><strong>Tự cập nhật lên bản Polaris mới</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # generate lại wrapper + type
npm run docs:generate     # generate lại trang tài liệu component
git diff                  # xem lại, rồi ghi thay đổi API vào CHANGELOG.md
```

</details>

## Phát triển

```sh
npm install
npm run dev            # playground (src/App.vue) với component Polaris chạy thật
npm run docs:dev       # site tài liệu
npm run test:unit      # vitest (drift guard + hành vi của wrapper)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # generate lại src/lib/generated/ từ manifest
npm run docs:generate  # generate lại docs/components/ từ manifest
npm run build:lib      # build package để publish vào dist/
```

## Đóng góp

Luôn hoan nghênh báo lỗi, sửa tài liệu và pull request. Xem [Hướng dẫn đóng góp](./CONTRIBUTING.md) để biết cách thiết lập, các quy tắc và checklist trước khi mở PR, cùng [Quy tắc ứng xử](./CODE_OF_CONDUCT.md). Để báo lỗ hổng bảo mật, xem [Chính sách bảo mật](./SECURITY.md).

## Phát hành

Bản phát hành được tạo từ `main` bằng cách push một tag phiên bản. [`release.yml`](../../.github/workflows/release.yml) lo phần còn lại: chạy kiểm tra, `npm publish` kèm provenance qua npm Trusted Publishing, và tạo GitHub Release với nội dung lấy từ `CHANGELOG.md`.

<details>
<summary><strong>Các bước phát hành (dành cho maintainer)</strong></summary>

1. Trong [`CHANGELOG.md`](../../CHANGELOG.md), chuyển các mục dưới `## [Unreleased]` sang một heading mới `## [x.y.z] - YYYY-MM-DD` và cập nhật các link so sánh ở cuối file. PR đồng bộ polaris-types tự ghi component mới/bị xoá vào đó; thay đổi về prop, slot và icon thì ghi tay (việc xoá là breaking change).
2. `npm version x.y.z --no-git-tag-version`, commit cả hai file rồi push lên `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Tag có hậu tố pre-release (ví dụ `v0.3.0-rc.0`) sẽ được publish với dist-tag `next`.

</details>

## Giấy phép

[MIT](../../LICENSE). Không liên kết với Shopify và không được Shopify bảo trợ.
