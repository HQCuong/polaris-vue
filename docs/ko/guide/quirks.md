---
title: Vue에서 사용하는 Shopify Polaris web components — 알려진 특이 사항
description: Vue 3에서 Shopify Polaris web components를 사용할 때 브라우저에서 검증된 특이 사항 — 일반적인 Vue 컴포넌트 라이브러리와 다른 slot 요구 사항, 이벤트 타이밍, v-model 동작.
---

# 알려진 특이 사항 {#known-quirks-gotchas}

다음은 기반이 되는 Polaris web components의 실제 동작으로, 모두 브라우저에서 검증되었습니다.
일반적인 Vue 컴포넌트 라이브러리에 익숙하다면 예상과 다를 수 있습니다. 직접 겪기 전에
읽어 두면 디버깅 시간을 줄일 수 있습니다.

## 1. `<SBanner>`에는 slot 콘텐츠가 필요합니다 {#_1-sbanner-needs-slot-content}

`heading` 속성만으로는 충분하지 않습니다. `<s-banner>`는 기본 slot 콘텐츠가 없으면
비어 있는 상태로 렌더링됩니다.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. 모달 액션 slot은 특정 버튼 variant만 허용합니다 {#_2-modal-action-slots-only-accept-specific-button-variants}

`SModal`의 `primary-action` slot은 `variant="primary"`인 버튼 하나만 허용합니다.
Polaris는 내부적으로 slot 콘텐츠를 수동으로 할당하며, 조건에 맞지 않는 노드는
**조용히 버려집니다**. 경고도 오류도 없이 그냥 렌더링되지 않습니다. `secondary-actions`는
`variant`가 `secondary` 또는 `auto`인 버튼을 허용합니다.

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. 숫자 타입 props는 문자열 속성이 아니라 bind해야 합니다 {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Polaris 공식 문서는 일반 HTML 속성(예: `rows="3"`)을 보여 주지만, Vue에서는 오해의 소지가
있습니다. `number` 타입 prop에 대해 `vue-tsc`는 문자열 리터럴이 아니라 bind된 표현식을
기대합니다.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. slot 할당은 connect 시점에 한 번만 이루어집니다 {#_4-slot-assignment-happens-once-at-connect-time}

부모가 마운트된 후에 자식의 `slot` 속성을 바꿔도 다시 할당되지 않습니다. 요소를 이름 있는
slot 사이에서 옮겨야 한다면 `slot`을 반응형으로 변경하지 말고 다시 렌더링하세요
(예: `v-if`/`:key` 사용).

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Polaris runtime은 CDN에서 버전이 관리됩니다 — 이 라이브러리의 버전은 runtime의 버전이 아닙니다 {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

2026년 8월부터 Polaris CDN은 시맨틱 버저닝을 따릅니다
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
릴리스 프로세스에 맞는 채널을 선택하세요.

| URL | 제공 내용 |
| --- | --- |
| `polaris-2.js` | stable 2.x 채널 — 새로운 Shopify 관리자 시각 스타일이며, 호환되는(minor) 업데이트를 자동으로 받습니다. **권장.** |
| `polaris-2.0.js` | 고정 릴리스 — 고정 버전을 옮기기 전까지 기능, 수정, 시각적 변경이 없습니다. |
| `polaris-1.js` | 이전 stable 1.x 채널. |
| `polaris.js` | 레거시 URL — 현재 `polaris-1.js`와 같은 빌드를 제공하며, 스스로 새 메이저로 넘어가지 않습니다. |

새 메이저(예: 2.0)로의 전환은 항상 선택 사항이며, 스크립트 URL을 바꿔야 합니다. Polaris
2.0은 시각적 업데이트입니다. 해당 Custom Elements Manifest(`@shopify/polaris-types@2.0.0`)는
1.1과 같은 태그, props, events, slots에 몇 가지 추가 사항(`SThumbnail`의 `loading` prop,
더 많은 `STextField` 아이콘)만 더해 선언하므로, 이 wrapper는 `polaris-1.js`에서도 동작합니다.

어떤 채널을 로드하든 runtime은 설치한 `polaris-vue-elements` 버전과 무관하게
업데이트됩니다. 이 라이브러리의 버전은 생성된 **타입과 wrapper**가 얼마나 최신인지만
나타냅니다.

- 오래된 wrapper가 이미 존재하는 컴포넌트를 망가뜨리는 일은 없습니다. 다만 wrapper가 마지막으로
  생성된 이후 Shopify가 추가한 기능에 대해서는 타입이 지정된 props/events가 없을 수 있습니다.
- 알 수 없는 props도 동작합니다. 타입 없이 `$attrs`를 통해 실제 요소로 전달됩니다.
- 알 수 없거나 새로운 컴포넌트도 동작합니다. 타입이 지정된 wrapper가 생성되기 전까지는
  custom element 태그를 직접 사용하세요(예: `<s-new-component>`).

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
