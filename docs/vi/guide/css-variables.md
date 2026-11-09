---
title: Biến CSS và design token của Shopify Polaris (web components)
description: Mọi design token của Polaris mà runtime của Shopify web components định nghĩa, kèm xem trước trực tiếp, tìm kiếm và sao chép. Import chúng dưới dạng tokens.css cho CSS của riêng ứng dụng bạn.
schema: TechArticle
---

# Biến CSS của Polaris (design token) {#css-variables}

Polaris web components tự định kiểu cho chính chúng, nhưng ứng dụng của bạn thường có một ít
CSS riêng: một lưới trang, một card tùy biến, chú thích của biểu đồ, khoảng cách giữa hai
component. Các biến CSS của Polaris cho phép CSS đó dùng cùng màu sắc, khoảng cách, bo góc
và font với các component xung quanh, nhờ vậy nó khớp với thiết kế của admin thay vì dựa vào
các giá trị đoán mò được viết cứng.

`polaris-vue-elements` cung cấp chúng dưới dạng một stylesheet duy nhất, `tokens.css`, được
trích xuất từ Polaris runtime mà ứng dụng của bạn nạp.

::: warning Không chính thức
Shopify không công bố danh sách biến CSS cho Polaris web components. Các tên và giá trị này
được trích xuất từ runtime của Shopify (`polaris-2.js`), nên giá trị đi theo CDN, và một tên
có thể thay đổi hoặc biến mất nếu Shopify đổi tên nó. Danh sách được kiểm tra hằng ngày
(xem [Cách danh sách luôn được cập nhật](#how-it-stays-up-to-date)).
:::

## Khi nào nên dùng {#when-to-use}

- **Nên** dùng chúng cho các phần tử do ứng dụng của bạn sở hữu: wrapper, container layout,
  widget tùy biến, văn bản bạn render bên ngoài các Polaris component.
- **Không nên** cố định kiểu lại các Polaris component bằng chúng. Mỗi component render bên
  trong shadow root riêng của nó, nên việc đặt `--p-color-bg-fill-brand` trên trang của bạn sẽ
  không đổi màu `<SButton>`. Hãy dùng props của component (`tone`, `variant`, `padding`, …)
  thay thế.
- **Ưu tiên các component layout trước.** `<SStack>`, `<SGrid>` và `<SBox>` đã nhận các giá trị
  khoảng cách, padding và viền của Polaris qua props. Chỉ dùng đến biến CSS khi những component
  đó không đáp ứng được điều bạn cần.

## Cài đặt {#install}

Import stylesheet một lần, ví dụ trong `main.ts`:

```ts
import 'polaris-vue-elements/tokens.css'
```

Sau đó dùng các biến trong bất kỳ CSS nào:

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

Tên và giá trị gốc cũng có sẵn dưới dạng JSON, dành cho công cụ hoặc CSS-in-JS:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Theme {#themes}

Runtime có hai giao diện. Một cửa hàng dùng thiết kế admin cũ nhận các giá trị cơ sở (khối
`:root` trong `tokens.css`). Một cửa hàng dùng thiết kế admin mới, và mọi trang bên ngoài
Shopify admin, nhận theme `admin-next`: khi Polaris component đầu tiên render, runtime thêm
class `p-partial-theme-admin-next` vào `<html>`, và `tokens.css` ghi đè các giá trị khác biệt
dưới chính class đó. CSS của bạn đi theo theme mà runtime đã chọn mà không cần thêm bất kỳ
thao tác nào. Bên dưới, hãy chuyển giữa **Cơ sở** và **admin-next** để xem từng bộ giá trị;
một chấm tô nửa đánh dấu những biến có giá trị khác nhau giữa hai theme.

Các giá trị mà runtime chỉ áp dụng trong những điều kiện bổ sung (màu P3 gam rộng, cỡ chữ trên
thiết bị di động, chế độ tương phản cao, hỗ trợ `corner-shape`) không được đưa vào; `tokens.css`
chứa giá trị mặc định cho từng biến.

## Cách danh sách luôn được cập nhật {#how-it-stays-up-to-date}

Một job định kỳ đọc `polaris-2.js` từ CDN của Shopify mỗi ngày, trích xuất các biến và mở một
pull request khi có bất cứ thứ gì được thêm, bị xóa hoặc thay đổi. Mỗi bản phát hành của
`polaris-vue-elements` chứa danh sách tại thời điểm phát hành đó.

<div class="css-variables-list">

## Tất cả các biến {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### Màu: nền {#color-bg}

<CssVariables group="color-bg" />

### Màu: chữ {#color-text}

<CssVariables group="color-text" />

### Màu: viền {#color-border}

<CssVariables group="color-border" />

### Màu: icon {#color-icon}

<CssVariables group="color-icon" />

### Màu: khác {#color-other}

<CssVariables group="color-other" />

### Khoảng cách {#space}

<CssVariables group="space" />

### Bo góc {#border-radius}

<CssVariables group="border-radius" />

### Độ dày viền {#border-width}

<CssVariables group="border-width" />

### Font {#font}

<CssVariables group="font" />

### Đổ bóng {#shadow}

<CssVariables group="shadow" />

### Chuyển động {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### Chiều rộng {#width}

<CssVariables group="width" />

### Chiều cao {#height}

<CssVariables group="height" />

### Breakpoint {#breakpoints}

Các biến breakpoint chứa giá trị độ rộng, nhưng CSS không thể dùng `var()` bên trong media
query, nên hãy viết trực tiếp giá trị: `@media (min-width: 48rem)`.

<CssVariables group="breakpoints" />

### Khác {#other}

<CssVariables group="other" />

</div>

## Chuyển đổi từ `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` là gói token của Polaris React. Polaris web components không dùng
gói này: runtime định nghĩa các biến riêng của nó, và phần lớn tên được giữ nguyên. Nếu CSS
của ứng dụng bạn được lấy từ một ứng dụng Polaris React, hãy đối chiếu nó với các danh sách
dưới đây. Một tên chỉ có trong gói cũ sẽ không có giá trị trong ứng dụng dùng web components,
nên CSS dùng tên đó sẽ nhận giá trị dự phòng `var()` mà bạn đã viết, hoặc không nhận gì cả.

<CssVariablesMigration />

## Câu hỏi thường gặp {#faq}

### Polaris web components có biến CSS không?

Có. Polaris runtime (`polaris-2.js`) định nghĩa khoảng 700 custom property `--p-*` trên
`:root` và dùng chúng bên trong các component của nó. Shopify không ghi tài liệu cho chúng,
và tên trong runtime có kèm một mã hash của bản build. `tokens.css` cung cấp cho bạn cùng các
giá trị đó dưới những tên ổn định.

### Có thể dùng các biến này để định kiểu lại một Polaris component không?

Không. Mỗi component render bên trong shadow root riêng của nó và đọc các biến đã gắn hash
của chính runtime, nên việc đặt `--p-color-bg-fill-brand` trên trang của bạn không làm thay đổi
`<SButton>`. Hãy dùng props của component, chẳng hạn `tone` và `variant`. Các biến này dành
cho những phần tử của riêng bạn xung quanh các component.

### Vì sao tên biến trong DevTools kết thúc bằng một mã hash như `-6e076`?

Runtime thêm một hậu tố riêng cho từng bản build vào mọi tên (`--p-color-bg-surface-6e076`),
và hậu tố này thay đổi giữa các bản build. Đừng sao chép những tên đó vào CSS của bạn:
`tokens.css` bỏ hậu tố đi, nên `var(--p-color-bg-surface)` vẫn hoạt động sau khi Shopify phát
hành một bản build mới.

### Danh sách này khác gì so với `@shopify/polaris-tokens`?

`@shopify/polaris-tokens` là gói token dành cho Polaris React. Danh sách này lấy trực tiếp từ
runtime của web components, nên nó chứa các token mà component thực sự dùng, bao gồm cả các
giá trị của thiết kế admin mới (`admin-next`). Phần lớn tên là giống nhau; xem
[Chuyển đổi từ `@shopify/polaris-tokens`](#migrating-from-polaris-tokens) để biết những điểm
khác biệt.

### Các biến có hỗ trợ chế độ tối (dark mode) không?

Không phải dưới dạng theme cho trang. Runtime có một bộ giá trị tối (`admin-next-dark`),
nhưng chỉ áp dụng nó cho một số phần bên trong vài component, không bao giờ cho cả trang, nên
`tokens.css` không có theme tối. Các giá trị này có trong `tokens.json` dưới
`themes["admin-next-dark"]` nếu bạn muốn tự xây dựng một theme tối.
