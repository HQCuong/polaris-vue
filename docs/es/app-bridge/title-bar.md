---
title: "TitleBar (ui-title-bar) – App Bridge para Vue 3"
description: "TitleBar renderiza ui-title-bar de Shopify App Bridge en Vue 3, con title como atributo; en un Modal define el encabezado y el pie. Para apps integradas de Shopify."
---

# TitleBar {#title-bar}

La barra de título aparece en la parte superior de tu app en el admin de Shopify; la [referencia de TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) de Shopify describe cómo personalizarla.

`TitleBar` renderiza `ui-title-bar`, con `title` como atributo. En un `Modal` define el
encabezado y el pie del modal. Sus hijos son elementos `<button>` y `<a>`; los tipos de
`ui-title-bar` permiten `variant="primary"` o `variant="breadcrumb"`,
`tone="critical"` y grupos `<section label="...">`. Para la barra de título de la página, Shopify
documenta ahora [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que es [`SPage`](/es/components/s-page).

## Props y eventos {#reference}

### Props {#props}

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `title` | `string` | El título de la barra de título. También se puede establecer con `document.title`. `TitleBar` siempre lo establece como atributo. |

`TitleBar` no emite eventos.

### Slots {#slots}

| Slot | Descripción |
| --- | --- |
| `default` | Elementos `<button>` y `<a>`, y grupos `<section>` de ellos, como se indica abajo. |

Los tipos de `ui-title-bar` describen estos hijos:

| Hijo | Atributos |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Los tipos señalan que los elementos anchor no son compatibles con Remix, donde se puede usar en su lugar el componente `<Link>` de Remix. |
| `<section>` | `label`: `string`. Sus hijos son elementos `<a>` y `<button>`. |

En estos tipos, `<button>` y `<a>` también aceptan `id`, `name`, `class`, `href`, `rel`, `target` y `onclick`.
