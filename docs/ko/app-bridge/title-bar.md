---
title: TitleBar
description: TitleBar는 title을 속성으로 설정해 ui-title-bar를 렌더링합니다. Modal 안에서는 모달의 헤더와 푸터를 설정합니다.
---

# TitleBar {#title-bar}

시작하기 전에 [설치](/ko/app-bridge/#install)를 참고하세요.

`TitleBar`는 `title`을 속성으로 설정해 `ui-title-bar`를 렌더링합니다. `Modal` 안에서는
모달의 헤더와 푸터를 설정합니다. 자식은 `<button>`과 `<a>` 요소이며, `ui-title-bar` 타입은
`variant="primary"` 또는 `variant="breadcrumb"`, `tone="critical"`, 그리고
`<section label="...">` 그룹을 허용합니다. 페이지 타이틀 바의 경우 Shopify는 이제
[`s-page`](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/title-bar)를 문서화하며,
이는 [`SPage`](/ko/components/s-page)입니다.
