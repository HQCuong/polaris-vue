---
title: "TitleBar (ui-title-bar) – Vue 3용 App Bridge"
description: "TitleBar는 Vue 3에서 title을 속성으로 설정해 Shopify App Bridge의 ui-title-bar를 렌더링합니다. Modal 안에서는 헤더와 푸터를 설정합니다. Shopify 임베디드 앱용입니다."
---

# TitleBar {#title-bar}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

타이틀 바는 Shopify 관리자에서 앱의 맨 위에 표시되며, Shopify의 [TitleBar 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar)에서 이를 사용자 지정하는 방법을 설명합니다.

`TitleBar`는 `title`을 속성으로 설정해 `ui-title-bar`를 렌더링합니다. `Modal` 안에서는
모달의 헤더와 푸터를 설정합니다. 자식은 `<button>`과 `<a>` 요소이며, `ui-title-bar` 타입은
`variant="primary"` 또는 `variant="breadcrumb"`, `tone="critical"`, 그리고
`<section label="...">` 그룹을 허용합니다. 페이지 타이틀 바의 경우 Shopify는 이제
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)를 문서화하며,
이는 [`SPage`](/ko/components/s-page)입니다.

## Props와 이벤트 {#reference}

### Props {#props}

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `title` | `string` | 타이틀 바의 제목입니다. `document.title`로도 설정할 수 있습니다. `TitleBar`는 이를 항상 속성으로 설정합니다. |

`TitleBar`는 이벤트를 emit하지 않습니다.

### Slots {#slots}

| Slot | 설명 |
| --- | --- |
| `default` | 아래와 같은 `<button>`, `<a>` 요소와 이를 묶는 `<section>` 그룹입니다. |

`ui-title-bar` 타입은 다음 자식을 설명합니다.

| 자식 | 속성 |
| --- | --- |
| `<button>` | `variant`: `"breadcrumb" \| "primary"`; `tone`: `"critical" \| "default"` |
| `<a>` | `variant`: `"breadcrumb" \| "primary"`. 타입에는 Remix에서 anchor 요소가 지원되지 않으며 대신 Remix의 `<Link>` 컴포넌트를 사용할 수 있다고 적혀 있습니다. |
| `<section>` | `label`: `string`. 자식은 `<a>`와 `<button>` 요소입니다. |

이 타입에서 `<button>`과 `<a>`는 `id`, `name`, `class`, `href`, `rel`, `target`, `onclick`도 받습니다.
