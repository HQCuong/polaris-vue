---
title: "TitleBar (ui-title-bar) – App Bridge für Vue 3"
description: "TitleBar rendert ui-title-bar von Shopify App Bridge in Vue 3, wobei title als Attribut gesetzt wird; in einem Modal setzt es Kopf- und Fußzeile. Für eingebettete Shopify-Apps."
---

# TitleBar {#title-bar}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

Die Titelleiste erscheint oben in Ihrer App im Shopify-Adminbereich; Shopifys [TitleBar-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) beschreibt, wie Sie sie anpassen.

`TitleBar` rendert `ui-title-bar`, wobei `title` als Attribut gesetzt wird. In einem `Modal` legt sie
Kopf- und Fußzeile des Modals fest. Ihre Kinder sind `<button>`- und `<a>`-Elemente; die
Typen von `ui-title-bar` erlauben `variant="primary"` oder `variant="breadcrumb"`,
`tone="critical"` und `<section label="...">`-Gruppen. Für die Titelleiste der Seite dokumentiert Shopify
jetzt [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
also [`SPage`](/de/components/s-page).

## Props und Events {#reference}

### Props {#props}

| Prop | Typ | Beschreibung |
| --- | --- | --- |
| `title` | `string` | Der Titel der Titelleiste. Er kann auch über `document.title` gesetzt werden. `TitleBar` setzt ihn immer als Attribut. |

`TitleBar` emittiert keine Events.

### Slots {#slots}

| Slot | Beschreibung |
| --- | --- |
| `default` | `<button>`- und `<a>`-Elemente sowie `<section>`-Gruppen davon, wie unten beschrieben. |

Die Typen von `ui-title-bar` beschreiben diese Kinder:

| Kind | Attribute |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Die Typen weisen darauf hin, dass Anchor-Elemente in Remix nicht unterstützt werden; dort kann stattdessen die `<Link>`-Komponente von Remix verwendet werden. |
| `<section>` | `label`: `string`. Ihre Kinder sind `<a>`- und `<button>`-Elemente. |

In diesen Typen nehmen `<button>` und `<a>` außerdem `id`, `name`, `class`, `href`, `rel`, `target` und `onclick` an.
