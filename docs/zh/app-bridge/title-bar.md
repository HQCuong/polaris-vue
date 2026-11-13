---
title: TitleBar
description: TitleBar 渲染 ui-title-bar，并将 title 设为 attribute。在 Modal 中，它用于设置 modal 的页眉和页脚。
---

# TitleBar {#title-bar}

开始之前，请参阅[安装](/zh/app-bridge/#install)。

`TitleBar` 渲染 `ui-title-bar`，并将 `title` 设为 attribute。在 `Modal` 中，它用于设置
modal 的页眉和页脚。它的子元素是 `<button>` 和 `<a>` 元素；`ui-title-bar` 的类型
允许 `variant="primary"` 或 `variant="breadcrumb"`、`tone="critical"`，
以及 `<section label="...">` 分组。对于页面标题栏，Shopify 现在记录的是
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)，
也就是 [`SPage`](/zh/components/s-page)。
