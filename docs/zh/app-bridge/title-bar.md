---
title: "TitleBar (ui-title-bar) – 适用于 Vue 3 的 App Bridge"
description: "TitleBar 在 Vue 3 中渲染 Shopify App Bridge 的 ui-title-bar，并将 title 设为 attribute；在 Modal 中，它用于设置页眉和页脚。适用于 Shopify 嵌入式应用。"
---

# TitleBar {#title-bar}

标题栏显示在 Shopify 后台中应用的顶部；Shopify 的 [TitleBar 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)说明了如何自定义它。

`TitleBar` 渲染 `ui-title-bar`，并将 `title` 设为 attribute。在 `Modal` 中，它用于设置
modal 的页眉和页脚。它的子元素是 `<button>` 和 `<a>` 元素；`ui-title-bar` 的类型
允许 `variant="primary"` 或 `variant="breadcrumb"`、`tone="critical"`，
以及 `<section label="...">` 分组。对于页面标题栏，Shopify 现在记录的是
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)，
也就是 [`SPage`](/zh/components/s-page)。

## Props 和事件 {#reference}

### Props {#props}

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 标题栏的标题。也可以通过 `document.title` 设置。`TitleBar` 总是将它设为属性。 |

`TitleBar` 不触发任何事件。

### Slots {#slots}

| Slot | 说明 |
| --- | --- |
| `default` | `<button>` 和 `<a>` 元素，以及包含它们的 `<section>` 分组，见下表。 |

`ui-title-bar` 的类型描述了以下子元素：

| 子元素 | 属性 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 类型中注明 Remix 不支持 anchor 元素，可以改用 Remix 的 `<Link>` 组件。 |
| `<section>` | `label`: `string`. 其子元素是 `<a>` 和 `<button>` 元素。 |

在这些类型中，`<button>` 和 `<a>` 还接受 `id`、`name`、`class`、`href`、`rel`、`target` 和 `onclick`。
