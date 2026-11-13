---
title: Shopify Polaris CSS 변수와 디자인 토큰 (web components)
description: Shopify web components runtime이 정의하는 모든 Polaris 디자인 토큰을 실시간 미리보기, 검색, 복사 기능과 함께 제공합니다. 앱 자체 CSS용 tokens.css로 import하세요.
schema: TechArticle
---

# Polaris CSS 변수 (디자인 토큰) {#css-variables}

Polaris web components는 스스로 스타일을 적용하지만, 앱에는 보통 자체 CSS가 조금 있습니다.
페이지 그리드, 커스텀 카드, 차트 범례, 두 컴포넌트 사이의 간격 같은 것들입니다. Polaris CSS
변수를 사용하면 그 CSS가 주변 컴포넌트와 같은 색상, 간격, 반경, 폰트를 사용하므로, 하드코딩한
추측값 대신 admin의 디자인과 일치하게 됩니다.

`polaris-vue-elements`는 이 변수들을 앱이 로드하는 Polaris runtime에서 추출한 하나의
스타일시트 `tokens.css`로 제공합니다.

::: warning 비공식
Shopify는 Polaris web components의 CSS 변수 목록을 공개하지 않습니다. 이 이름과 값은
Shopify의 runtime(`polaris-2.js`)에서 추출한 것이므로 값은 CDN을 따르며, Shopify가 이름을
바꾸면 이름이 변경되거나 사라질 수 있습니다. 목록은 매일 확인됩니다
([최신 상태를 유지하는 방법](#how-it-stays-up-to-date) 참고).
:::

## 언제 사용하나요 {#when-to-use}

- 앱이 소유한 요소에는 **사용하세요**: 래퍼, 레이아웃 컨테이너, 커스텀 위젯, Polaris
  컴포넌트 밖에서 렌더링하는 텍스트 등.
- 이 변수로 Polaris 컴포넌트의 스타일을 바꾸려고 **하지 마세요**. 각 컴포넌트는 자체 shadow
  root 안에서 렌더링되므로, 페이지에 `--p-color-bg-fill-brand`를 설정해도 `<SButton>`의 색이
  바뀌지 않습니다. 대신 컴포넌트의 props(`tone`, `variant`, `padding`, …)를 사용하세요.
- **레이아웃 컴포넌트를 먼저 고려하세요.** `<SStack>`, `<SGrid>`, `<SBox>`는 이미 Polaris의
  간격, padding, 테두리 값을 props로 받습니다. 이것들로 충분하지 않을 때 CSS 변수를 사용하세요.

## 설치 {#install}

스타일시트를 한 번 import합니다. 예를 들어 `main.ts`에서 하면 됩니다. 앱이 Shopify admin 안에서 실행되더라도 필요합니다([이유](#need-tokens-in-admin)):

```ts
import 'polaris-vue-elements/tokens.css'
```

그런 다음 어떤 CSS에서든 변수를 사용합니다.

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

원래의 이름과 값은 도구나 CSS-in-JS용으로 JSON 형태로도 제공됩니다.

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Theme {#themes}

runtime에는 두 가지 모습이 있습니다. 이전 admin 디자인을 사용하는 스토어는 기본 값
(`tokens.css`의 `:root` 블록)을 받습니다. 새 admin 디자인을 사용하는 스토어와 Shopify admin
밖의 모든 페이지는 `admin-next` theme을 받습니다. 첫 번째 Polaris 컴포넌트가 렌더링될 때
runtime이 `<html>`에 `p-partial-theme-admin-next` 클래스를 추가하고, `tokens.css`는 같은
클래스 아래에서 달라지는 값을 덮어씁니다. 별도의 작업 없이도 CSS는 runtime이 선택한 theme을
따릅니다. [전체 변수](/ko/css-variables/reference) 페이지에서 **기본**과 **admin-next**를 전환하면 각 값 세트를 볼 수 있으며, 반쯤 채워진
점은 두 theme 사이에 값이 다른 변수를 표시합니다.

runtime이 추가 조건에서만 적용하는 값(광색역 P3 색상, 모바일 글자 크기, 고대비 모드,
`corner-shape` 지원)은 포함되지 않으며, `tokens.css`에는 각 변수의 기본 값이 들어 있습니다.

## 최신 상태를 유지하는 방법 {#how-it-stays-up-to-date}

예약된 작업이 매일 Shopify의 CDN에서 `polaris-2.js`를 읽어 변수를 추출하고, 추가·삭제·변경된
항목이 있으면 pull request를 엽니다. `polaris-vue-elements`의 각 릴리스에는 해당 릴리스
시점의 목록이 포함됩니다.

- [전체 변수](/ko/css-variables/reference)
- [`@shopify/polaris-tokens`에서 마이그레이션하기](/ko/css-variables/migration)

## 자주 묻는 질문 {#faq}

### Polaris web components에 CSS 변수가 있나요?

네. Polaris runtime(`polaris-2.js`)은 `:root`에 약 700개의 `--p-*` 커스텀 속성을 정의하고
컴포넌트 내부에서 이를 사용합니다. Shopify는 이 변수들을 문서화하지 않으며, runtime의 이름에는
빌드 해시가 붙어 있습니다. `tokens.css`는 같은 값을 안정적인 이름으로 제공합니다.

### 제 앱은 Shopify admin 안에서 실행됩니다. 그래도 `tokens.css`가 필요한가요? {#need-tokens-in-admin}

네. runtime은 변수를 `--p-color-bg-surface-6e076` 같은 해시가 붙은 이름으로만 정의하고
`--p-color-bg-surface`라는 이름으로는 정의하지 않으므로, `tokens.css`가 없으면
`var(--p-color-bg-surface)`는 아무 값으로도 해석되지 않습니다. 해시는 Shopify 빌드마다 바뀌므로
해시가 붙은 이름도 사용할 수 없습니다. 임베디드 앱은 iframe 안에서 실행되기 때문에 admin 자체의
CSS는 앱에 적용되지 않습니다.

### 이 변수로 Polaris 컴포넌트의 스타일을 바꿀 수 있나요?

아니요. 각 컴포넌트는 자체 shadow root 안에서 렌더링되고 runtime 자체의 해시가 붙은 변수를
읽으므로, 페이지에 `--p-color-bg-fill-brand`를 설정해도 `<SButton>`은 바뀌지 않습니다.
`tone`, `variant` 같은 컴포넌트의 props를 사용하세요. 이 변수들은 컴포넌트 주변에 있는 여러분의
요소를 위한 것입니다.

### DevTools에서 보이는 변수 이름이 `-6e076` 같은 해시로 끝나는 이유는 무엇인가요?

runtime은 모든 이름에 빌드별 접미사를 붙이며(`--p-color-bg-surface-6e076`), 이 접미사는 빌드마다
바뀝니다. 그런 이름을 CSS에 복사하지 마세요. `tokens.css`는 접미사를 제거하므로 Shopify가 새
빌드를 배포한 뒤에도 `var(--p-color-bg-surface)`는 계속 동작합니다.

### `@shopify/polaris-tokens`와 무엇이 다른가요?

`@shopify/polaris-tokens`는 Polaris React용 토큰 패키지입니다. 이 목록은 web components runtime
자체에서 가져오므로, 새 admin 디자인(`admin-next`) 값을 포함해 컴포넌트가 실제로 사용하는 토큰을
담고 있습니다. 대부분의 이름은 같으며, 차이점은
[`@shopify/polaris-tokens`에서 마이그레이션하기](/ko/css-variables/migration#migrating-from-polaris-tokens)를 참고하세요.

### 변수가 다크 모드를 지원하나요?

페이지 테마로서는 지원하지 않습니다. runtime에는 다크 값 세트(`admin-next-dark`)가 있지만, 일부
컴포넌트 내부의 특정 부분에만 적용하고 페이지에는 절대 적용하지 않으므로 `tokens.css`에는 다크
theme이 없습니다. 직접 만들고 싶다면 `tokens.json`의 `themes["admin-next-dark"]`에서 값을 찾을 수
있습니다.
