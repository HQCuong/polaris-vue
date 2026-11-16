---
title: "TitleBar (ui-title-bar) – App Bridge pour Vue 3"
description: "TitleBar génère ui-title-bar de Shopify App Bridge en Vue 3, avec title défini comme attribut ; dans un Modal, il définit l'en-tête et le pied. Pour les apps Shopify intégrées."
---

# TitleBar {#title-bar}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

`TitleBar` génère `ui-title-bar`, avec `title` défini comme attribut. Dans un `Modal`, il définit
l'en-tête et le pied du modal. Ses enfants sont des éléments `<button>` et `<a>` ; les
types de `ui-title-bar` autorisent `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` et des groupes `<section label="...">`. Pour la barre de titre de la page, Shopify
documente désormais [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
c'est-à-dire [`SPage`](/fr/components/s-page).
