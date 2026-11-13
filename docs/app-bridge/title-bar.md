---
title: TitleBar
description: TitleBar renders ui-title-bar, with title set as an attribute.
---

# TitleBar {#title-bar}

Before you start, see [Install](/app-bridge/#install).

`TitleBar` renders `ui-title-bar`, with `title` set as an attribute. In a `Modal` it sets
the modal's header and footer. Its children are `<button>` and `<a>` elements; the
`ui-title-bar` types allow `variant="primary"` or `variant="breadcrumb"`,
`tone="critical"`, and `<section label="...">` groups. For the page title bar, Shopify
now documents [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
which is [`SPage`](/components/s-page).
