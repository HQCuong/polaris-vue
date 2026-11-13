---
title: TitleBar
description: TitleBar ui-title-bar को render करता है, जिसमें title एक attribute के रूप में सेट होता है।
---

# TitleBar {#title-bar}

शुरू करने से पहले [Install](/hi/app-bridge/#install) देखें।

`TitleBar` `ui-title-bar` को render करता है, जिसमें `title` एक attribute के रूप में सेट होता है। `Modal` में
यह modal का header और footer सेट करता है। इसके children `<button>` और `<a>` elements हैं;
`ui-title-bar` types `variant="primary"` या `variant="breadcrumb"`, `tone="critical"`, और
`<section label="...">` groups की अनुमति देते हैं। Page title bar के लिए Shopify अब
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
document करता है, जो [`SPage`](/hi/components/s-page) है।
