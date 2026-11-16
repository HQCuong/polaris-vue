---
title: "TitleBar (ui-title-bar) – Vue 3 के लिए App Bridge"
description: "TitleBar Vue 3 में Shopify App Bridge के ui-title-bar को render करता है, title attribute के रूप में सेट होता है; Modal में यह header और footer सेट करता है। Shopify embedded apps के लिए।"
---

# TitleBar {#title-bar}

Title bar Shopify admin में आपके app के ऊपर दिखता है; Shopify का [TitleBar reference](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) बताता है कि इसे customize कैसे करें।

`TitleBar` `ui-title-bar` को render करता है, जिसमें `title` एक attribute के रूप में सेट होता है। `Modal` में
यह modal का header और footer सेट करता है। इसके children `<button>` और `<a>` elements हैं;
`ui-title-bar` types `variant="primary"` या `variant="breadcrumb"`, `tone="critical"`, और
`<section label="...">` groups की अनुमति देते हैं। Page title bar के लिए Shopify अब
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)
document करता है, जो [`SPage`](/hi/components/s-page) है।

## Props और events {#reference}

### Props {#props}

| Prop | Type | विवरण |
| --- | --- | --- |
| `title` | `string` | Title bar का title। इसे `document.title` से भी set किया जा सकता है। `TitleBar` इसे हमेशा attribute के रूप में set करता है। |

`TitleBar` कोई event emit नहीं करता।

### Slots {#slots}

| Slot | विवरण |
| --- | --- |
| `default` | `<button>` और `<a>` elements, और उनके `<section>` groups, जैसा नीचे है। |

`ui-title-bar` types इन children का वर्णन करते हैं:

| Child | Attributes |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Types में note है कि Remix में anchor elements supported नहीं हैं, जहाँ उनकी जगह Remix का `<Link>` component इस्तेमाल किया जा सकता है। |
| `<section>` | `label`: `string`. इसके children `<a>` और `<button>` elements हैं। |

इन types में `<button>` और `<a>` `id`, `name`, `class`, `href`, `rel`, `target` और `onclick` भी लेते हैं।
