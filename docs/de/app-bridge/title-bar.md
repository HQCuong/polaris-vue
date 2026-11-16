---
title: "TitleBar (ui-title-bar) – App Bridge für Vue 3"
description: "TitleBar rendert ui-title-bar von Shopify App Bridge in Vue 3, wobei title als Attribut gesetzt wird; in einem Modal setzt es Kopf- und Fußzeile. Für eingebettete Shopify-Apps."
---

# TitleBar {#title-bar}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

`TitleBar` rendert `ui-title-bar`, wobei `title` als Attribut gesetzt wird. In einem `Modal` legt sie
Kopf- und Fußzeile des Modals fest. Ihre Kinder sind `<button>`- und `<a>`-Elemente; die
Typen von `ui-title-bar` erlauben `variant="primary"` oder `variant="breadcrumb"`,
`tone="critical"` und `<section label="...">`-Gruppen. Für die Titelleiste der Seite dokumentiert Shopify
jetzt [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
also [`SPage`](/de/components/s-page).
