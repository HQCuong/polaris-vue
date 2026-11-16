---
title: "TitleBar (ui-title-bar) – App Bridge pour Vue 3"
description: "TitleBar génère ui-title-bar de Shopify App Bridge en Vue 3, avec title défini comme attribut ; dans un Modal, il définit l'en-tête et le pied. Pour les apps Shopify intégrées."
---

# TitleBar {#title-bar}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

La barre de titre apparaît en haut de votre app dans l'interface d'administration Shopify ; la [référence TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) de Shopify explique comment la personnaliser.

`TitleBar` génère `ui-title-bar`, avec `title` défini comme attribut. Dans un `Modal`, il définit
l'en-tête et le pied du modal. Ses enfants sont des éléments `<button>` et `<a>` ; les
types de `ui-title-bar` autorisent `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` et des groupes `<section label="...">`. Pour la barre de titre de la page, Shopify
documente désormais [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
c'est-à-dire [`SPage`](/fr/components/s-page).

## Props et événements {#reference}

### Props {#props}

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Le titre de la barre de titre. Il peut aussi être défini avec `document.title`. `TitleBar` le définit toujours comme attribut. |

`TitleBar` n'émet aucun événement.

### Slots {#slots}

| Slot | Description |
| --- | --- |
| `default` | Des éléments `<button>` et `<a>`, et des groupes `<section>` de ces éléments, comme ci-dessous. |

Les types de `ui-title-bar` décrivent ces enfants :

| Enfant | Attributs |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Les types indiquent que les éléments anchor ne sont pas pris en charge dans Remix, où le composant `<Link>` de Remix peut être utilisé à la place. |
| `<section>` | `label`: `string`. Ses enfants sont des éléments `<a>` et `<button>`. |

Dans ces types, `<button>` et `<a>` acceptent aussi `id`, `name`, `class`, `href`, `rel`, `target` et `onclick`.
