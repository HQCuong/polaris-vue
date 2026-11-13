---
title: TitleBar
description: TitleBar render ui-title-bar, với title được đặt làm attribute.
---

# TitleBar {#title-bar}

Trước khi bắt đầu, xem [Cài đặt](/vi/app-bridge/#install).

`TitleBar` render `ui-title-bar`, với `title` được đặt làm attribute. Trong một `Modal`, nó đặt
phần header và footer của modal. Các con của nó là các element `<button>` và `<a>`; type của
`ui-title-bar` cho phép `variant="primary"` hoặc `variant="breadcrumb"`,
`tone="critical"`, và các nhóm `<section label="...">`. Với title bar của trang, Shopify
hiện ghi nhận [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
chính là [`SPage`](/vi/components/s-page).
