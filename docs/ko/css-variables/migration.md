---
title: "@shopify/polaris-tokens에서 마이그레이션하기"
description: "@shopify/polaris-tokens는 Polaris React의 토큰 패키지입니다. Polaris web components는 이 패키지를 사용하지 않습니다."
---

# `@shopify/polaris-tokens`에서 마이그레이션하기 {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens`는 Polaris React의 토큰 패키지입니다. Polaris web components는 이
패키지를 사용하지 않습니다. runtime이 자체 변수를 정의하며, 대부분의 이름은 그대로 이어집니다.
앱의 CSS를 Polaris React 앱에서 가져왔다면 아래 목록과 대조해 보세요. 레거시 패키지에만 있는
이름은 web components 앱에서 값이 없으므로, 그 이름을 사용하는 CSS는 직접 작성한 `var()`
대체값을 받거나 아무 값도 받지 못합니다.

<CssVariablesMigration />
