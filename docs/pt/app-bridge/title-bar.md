---
title: "TitleBar (ui-title-bar) – App Bridge para Vue 3"
description: "TitleBar renderiza o ui-title-bar do Shopify App Bridge em Vue 3, com title definido como atributo; em um Modal, define o cabeçalho e o rodapé. Para apps incorporados da Shopify."
---

# TitleBar {#title-bar}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

A barra de título aparece no topo do seu app no admin da Shopify; a [referência do TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) da Shopify descreve como personalizá-la.

`TitleBar` renderiza `ui-title-bar`, com `title` definido como atributo. Em um `Modal`, ele define
o cabeçalho e o rodapé do modal. Seus filhos são elementos `<button>` e `<a>`; os tipos de
`ui-title-bar` permitem `variant="primary"` ou `variant="breadcrumb"`,
`tone="critical"` e grupos `<section label="...">`. Para a barra de título da página, a Shopify
agora documenta o [`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar),
que é o [`SPage`](/pt/components/s-page).

## Props e eventos {#reference}

### Props {#props}

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string` | O título da barra de título. Também pode ser definido com `document.title`. `TitleBar` sempre o define como atributo. |

`TitleBar` não emite eventos.

### Slots {#slots}

| Slot | Descrição |
| --- | --- |
| `default` | Elementos `<button>` e `<a>`, e grupos `<section>` deles, como abaixo. |

Os tipos de `ui-title-bar` descrevem estes filhos:

| Filho | Atributos |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. Os tipos observam que elementos anchor não são suportados no Remix, onde o componente `<Link>` do Remix pode ser usado no lugar. |
| `<section>` | `label`: `string`. Seus filhos são elementos `<a>` e `<button>`. |

Nesses tipos, `<button>` e `<a>` também aceitam `id`, `name`, `class`, `href`, `rel`, `target` e `onclick`.
