---
title: TitleBar
description: TitleBar renderiza ui-title-bar, com title definido como atributo.
---

# TitleBar {#title-bar}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

`TitleBar` renderiza `ui-title-bar`, com `title` definido como atributo. Em um `Modal`, ele define
o cabeçalho e o rodapé do modal. Seus filhos são elementos `<button>` e `<a>`; os tipos de
`ui-title-bar` permitem `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` e grupos `<section label="...">`. Para a barra de título da página, a Shopify
agora documenta o [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que é o [`SPage`](/pt/components/s-page).
