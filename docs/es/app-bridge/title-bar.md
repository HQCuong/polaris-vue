---
title: "TitleBar (ui-title-bar) – App Bridge para Vue 3"
description: "TitleBar renderiza ui-title-bar de Shopify App Bridge en Vue 3, con title como atributo; en un Modal define el encabezado y el pie. Para apps integradas de Shopify."
---

# TitleBar {#title-bar}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install).

`TitleBar` renderiza `ui-title-bar`, con `title` como atributo. En un `Modal` define el
encabezado y el pie del modal. Sus hijos son elementos `<button>` y `<a>`; los tipos de
`ui-title-bar` permiten `variant="primary"` o `variant="breadcrumb"`,
`tone="critical"` y grupos `<section label="...">`. Para la barra de título de la página, Shopify
documenta ahora [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que es [`SPage`](/es/components/s-page).
