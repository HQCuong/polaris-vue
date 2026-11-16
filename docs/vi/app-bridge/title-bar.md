---
title: "TitleBar (ui-title-bar) – App Bridge cho Vue 3"
description: "TitleBar render ui-title-bar của Shopify App Bridge trong Vue 3, với title được đặt làm attribute; trong Modal nó đặt header và footer. Dành cho Shopify embedded app."
---

# TitleBar {#title-bar}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

Title bar xuất hiện ở đầu app của bạn trong trang admin Shopify; [tài liệu TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) của Shopify mô tả cách tùy chỉnh nó.

`TitleBar` render `ui-title-bar`, với `title` được đặt làm attribute. Trong một `Modal`, nó đặt
phần header và footer của modal. Các con của nó là các element `<button>` và `<a>`; type của
`ui-title-bar` cho phép `variant="primary"` hoặc `variant="breadcrumb"`,
`tone="critical"`, và các nhóm `<section label="...">`. Với title bar của trang, Shopify
hiện ghi nhận [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
chính là [`SPage`](/vi/components/s-page).

## Props và sự kiện {#reference}

### Props {#props}

| Prop | Kiểu | Mô tả |
| --- | --- | --- |
| `title` | `string` | Tiêu đề của title bar. Cũng có thể đặt bằng `document.title`. `TitleBar` luôn đặt nó làm attribute. |

`TitleBar` không phát ra sự kiện nào.

### Slots {#slots}

| Slot | Mô tả |
| --- | --- |
| `default` | Các element `<button>` và `<a>`, và các nhóm `<section>` chứa chúng, như bên dưới. |

Type của `ui-title-bar` mô tả các con sau:

| Phần tử con | Attribute |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Type ghi chú rằng element anchor không được hỗ trợ trong Remix, nơi có thể dùng component `<Link>` của Remix thay thế. |
| `<section>` | `label`: `string`. Các con của nó là element `<a>` và `<button>`. |

Trong các type này, `<button>` và `<a>` cũng nhận `id`, `name`, `class`, `href`, `rel`, `target` và `onclick`.
