---
title: Shopify Polaris web components trong Vue — các điểm bất thường đã biết
description: Các điểm bất thường đã được kiểm chứng trên trình duyệt của Shopify Polaris web components khi dùng từ Vue 3 — yêu cầu về slot, thời điểm phát event và hành vi v-model khác với các thư viện component Vue thông thường.
---

# Các điểm bất thường & lưu ý {#known-quirks-gotchas}

Đây là những hành vi thực tế, đã được kiểm chứng trên trình duyệt, của các Polaris
web component bên dưới mà không phải lúc nào cũng khớp với điều bạn mong đợi khi
quen dùng một thư viện component Vue thông thường. Đọc trước phần này trước khi gặp
phải sẽ giúp bạn tiết kiệm thời gian debug.

## 1. `<SBanner>` cần có nội dung slot {#_1-sbanner-needs-slot-content}

Chỉ một attribute `heading` là không đủ — `<s-banner>` sẽ render rỗng trừ khi
nó cũng có nội dung trong default slot.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Slot hành động của modal chỉ chấp nhận một số variant button nhất định {#_2-modal-action-slots-only-accept-specific-button-variants}

Slot `primary-action` của `SModal` chỉ chấp nhận một button duy nhất với
`variant="primary"`. Polaris gán nội dung slot thủ công ở bên dưới, và bất kỳ
node nào không khớp sẽ bị **loại bỏ một cách im lặng** — không cảnh báo, không lỗi,
chỉ đơn giản là không được render. `secondary-actions` chấp nhận các button có `variant`
là `secondary` hoặc `auto`.

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. Prop kiểu số phải được bind, không viết dưới dạng attribute chuỗi {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Tài liệu của chính Polaris dùng attribute HTML thuần (ví dụ `rows="3"`),
nhưng điều đó dễ gây hiểu nhầm trong Vue: với các prop có type `number`, `vue-tsc`
yêu cầu một biểu thức được bind, không phải một chuỗi literal.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Việc gán slot chỉ diễn ra một lần, tại thời điểm connect {#_4-slot-assignment-happens-once-at-connect-time}

Thay đổi attribute `slot` của một phần tử con sau khi phần tử cha đã mount sẽ không
gán lại nó. Nếu bạn cần một phần tử di chuyển giữa các named slot, hãy render lại
nó (ví dụ với `v-if`/`:key`) thay vì thay đổi `slot` một cách reactive.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Polaris runtime được đánh phiên bản trên CDN — phiên bản của thư viện này không phải là phiên bản của runtime {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

Từ tháng 8 năm 2026, Polaris CDN tuân theo semantic versioning
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Hãy chọn kênh phù hợp với quy trình phát hành của bạn:

| URL | Nội dung phục vụ |
| --- | --- |
| `polaris-2.js` | Kênh ổn định 2.x — phong cách giao diện mới của trang admin Shopify; tự động nhận các bản cập nhật tương thích (minor). **Khuyến nghị.** |
| `polaris-2.0.js` | Bản phát hành được ghim — không có thay đổi về tính năng, bản sửa lỗi hay giao diện cho đến khi bạn đổi phiên bản ghim. |
| `polaris-1.js` | Kênh ổn định 1.x trước đó. |
| `polaris.js` | URL cũ — hiện phục vụ cùng bản build với `polaris-1.js` và không bao giờ tự chuyển sang một major mới. |

Một major mới (như 2.0) luôn là tùy chọn chủ động: bạn phải đổi URL của script. Polaris
2.0 là một bản cập nhật về giao diện: Custom Elements Manifest của nó
(`@shopify/polaris-types@2.0.0`) khai báo cùng các tag, prop, event và slot
như 1.1 cộng thêm một vài bổ sung (prop `loading` của `SThumbnail`, thêm icon cho
`STextField`), nên các wrapper này cũng hoạt động với `polaris-1.js`.

Dù bạn tải kênh nào, runtime vẫn cập nhật độc lập với phiên bản
`polaris-vue-elements` mà bạn đã cài đặt. Phiên bản của thư viện này chỉ
phản ánh độ mới của các **type và wrapper** được sinh ra:

- Một wrapper cũ không bao giờ làm hỏng các component đã tồn tại — nó chỉ có thể
  thiếu các prop/event có type cho những tính năng Shopify thêm vào sau lần
  cuối wrapper được sinh ra.
- Các prop không xác định vẫn hoạt động: chúng được truyền qua `$attrs` xuống
  phần tử bên dưới mà không có type.
- Các component không xác định/mới vẫn hoạt động: hãy dùng trực tiếp tag custom element gốc
  (ví dụ `<s-new-component>`) cho đến khi có wrapper có type được sinh ra cho nó.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
