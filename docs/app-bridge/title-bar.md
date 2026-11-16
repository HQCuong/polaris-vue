---
title: "TitleBar (ui-title-bar) – App Bridge for Vue 3"
description: "TitleBar renders the Shopify App Bridge ui-title-bar in Vue 3: a title and buttons, and in a Modal its header and footer. For Shopify embedded apps."
---

# TitleBar {#title-bar}

Before you start, see [Install](/app-bridge/#install).

The title bar appears at the top of your app in the Shopify admin; Shopify's [TitleBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) describes how to customize it.

`TitleBar` renders `ui-title-bar`, with `title` set as an attribute. In a `Modal` it sets
the modal's header and footer. Its children are `<button>` and `<a>` elements; the
`ui-title-bar` types allow `variant="primary"` or `variant="breadcrumb"`,
`tone="critical"`, and `<section label="...">` groups. For the page title bar, Shopify
now documents [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
which is [`SPage`](/components/s-page).

## Props and events {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | The title of the title bar. It can also be set with `document.title`. `TitleBar` always sets it as an attribute. |

`TitleBar` emits no events.

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | `<button>` and `<a>` elements, and `<section>` groups of them, as below. |

The `ui-title-bar` types describe these children:

| Child | Attributes |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. The types note that anchor elements are not supported in Remix, where Remix's `<Link>` component can be used instead. |
| `<section>` | `label`: `string`. Its children are `<a>` and `<button>` elements. |

In these types, `<button>` and `<a>` also take `id`, `name`, `class`, `href`, `rel`, `target` and `onclick`.
