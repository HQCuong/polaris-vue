<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | **한국어** | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/ko/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: Shopify Polaris web components를 위한 타입이 지정된 Vue 3 wrapper" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[문서](https://polaris-vue-elements.dev/ko/)** ·
[시작하기](https://polaris-vue-elements.dev/ko/guide/getting-started) ·
[컴포넌트](https://polaris-vue-elements.dev/ko/components/) ·
[임베디드 앱 가이드](https://polaris-vue-elements.dev/ko/guide/shopify-embedded-app) ·
[변경 로그](../../CHANGELOG.md)

</div>

---

> 이 번역은 영어 원문보다 늦게 갱신될 수 있습니다. 내용이 다를 경우 [영어 원문](../../README.md)이 기준입니다.

[Shopify Polaris web components](https://shopify.dev/docs/api/app-home/web-components)를 위한, 타입이 완전히 지정된 Vue 3 wrapper 컴포넌트입니다. Polaris web components는 Shopify App Home(Shopify 관리자에 임베드되는) 앱을 만드는 데 쓰이는 `s-*` custom element입니다.

Polaris runtime 자체는 Shopify의 CDN에서 로드됩니다(`polaris-2.js` 안정 채널은 호환되는 업데이트를 자동으로 받습니다). 이 라이브러리는 그 위에 Vue다운, 타입이 완전히 지정된 인터페이스를 제공합니다.

## 기능

- **62개 컴포넌트 전체에 타입이 지정된 props와 events.** Shopify의 공식 Custom Elements Manifest(`@shopify/polaris-types`)에서 생성됩니다. `variant` 같은 union 타입 props, 템플릿 자동 완성, 타입이 지정된 `@click` / `@aftershow` 리스너를 지원합니다.
- **17개 폼 컴포넌트에서 `v-model` 지원** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …). 각 컴포넌트는 올바른 property/event 쌍에 매핑됩니다.
- **명령형 오버레이 제어.** `SModal`은 타입이 지정된 `$el`(`ModalElement`)을 노출하므로 `modal.value?.$el.showOverlay()`가 타입 검사를 통과합니다. Polaris의 선언적 `commandFor` / `command` 패턴도 함께 쓸 수 있습니다.
- **기능이 줄어들 뿐, 막히지 않습니다.** 알 수 없는 props는 `$attrs`로 그대로 전달되고, slots도 그대로 전달되며, 새로 나온 Polaris 컴포넌트는 언제든 원래의 `s-*` 태그로 사용할 수 있습니다. wrapper가 오래되면 새 기능의 타입이 빠질 뿐, 기존 기능이 깨지지는 않습니다.

## 설치

```sh
npm install polaris-vue-elements
```

Vue `^3.5`는 peer dependency입니다.

### Runtime 설정 (필수)

wrapper는 표현만 담당합니다. 호스트 앱에서 Shopify의 CDN으로 Polaris runtime을 로드하고, `s-*` 태그가 custom element라는 것을 Vue에 알려야 합니다.

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **참고:** `polaris-2.js`는 Shopify의 안정 채널이며 Shopify 관리자의 새로운 비주얼 디자인을 제공합니다. 아직 `polaris-1.js`를 사용하는 앱도 계속 동작합니다. 2.0의 컴포넌트 API는 몇 가지 추가 사항을 제외하면 1.1과 같습니다. [Polaris 2.0과 새로운 관리자 디자인](https://polaris-vue-elements.dev/ko/guide/getting-started#polaris-2-0-and-the-new-admin-design)을 참고하세요.

## 빠른 시작

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **팁:** Polaris의 `<s-button>` 태그를 직접 쓰는 편이 좋으신가요? `tsconfig.json`에 `"types": ["polaris-vue-elements/elements"]`를 추가하면 Volar / `vue-tsc`가 원래의 `<s-*>` 태그도 타입 검사합니다(타입만 제공되며, `v-model`은 wrapper에서만 쓸 수 있습니다). [원래의 `<s-*>` 태그에 타입 지정하기](https://polaris-vue-elements.dev/ko/guide/getting-started#_7-typing-raw-s-tags-optional)를 참고하세요.

## 문서

모든 문서는 **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/ko/)** 사이트에 있습니다.

- [시작하기](https://polaris-vue-elements.dev/ko/guide/getting-started): 설정, `v-model`, 오버레이, 원래 태그의 타입 지정.
- [Vue 3로 Shopify 임베디드 앱 만들기](https://polaris-vue-elements.dev/ko/guide/shopify-embedded-app): App Bridge, 인증된 `fetch`, 내비게이션, 저장 바.
- [알려진 특이 사항](https://polaris-vue-elements.dev/ko/guide/quirks): 실제 브라우저에서 검증한 Polaris의 동작.
- [컴포넌트 레퍼런스](https://polaris-vue-elements.dev/ko/components/): 62개 컴포넌트 전체의 props, events, slots, 모범 사례와 라이브 예제.

사이트의 소스는 [`docs/`](../../docs)에 있습니다. `npm run docs:dev`로 로컬에서 실행할 수 있습니다.

## 동작 방식

Shopify의 manifest에서 도출할 수 있는 것은 모두 자동으로 생성되며, 사람의 판단이 필요한 부분은 작은 파일 하나에만 있습니다.

```
@shopify/polaris-types (custom-elements.json)   ← 기준 소스(source of truth)
        │  npm run generate
        ▼
src/lib/generated/        ← 메타데이터, Props/Events/Element 타입, 컴포넌트 (수정 금지)
src/lib/runtime/          ← createWrapper: 62개 컴포넌트 전체에 쓰이는 범용 팩토리 하나
src/lib/overrides.ts      ← 직접 작성: v-model 매핑만 포함
```

드리프트 방지(drift-guard) 테스트 덕분에 누락이 생길 수 없습니다. 생성된 코드가 오래되었거나, manifest의 컴포넌트에 wrapper가 없거나, 새로운 폼 형태 컴포넌트에 v-model override가 없으면 CI가 실패합니다. 예약된 워크플로([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml))는 새로운 `@shopify/polaris-types`가 게시되면 동기화 PR을 자동으로 엽니다.

<details>
<summary><strong>새 Polaris 버전으로 직접 업데이트하기</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## 개발

```sh
npm install
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
npm run test:unit      # vitest (drift guards + wrapper behavior)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # regenerate src/lib/generated/ from the manifest
npm run docs:generate  # regenerate docs/components/ from the manifest
npm run build:lib      # build the publishable package into dist/
```

## 기여하기

버그 리포트, 문서 수정, pull request 모두 환영합니다. 설정 방법, 기본 규칙, PR 전 체크리스트는 [기여 가이드](./CONTRIBUTING.md)를, 그리고 [행동 강령](./CODE_OF_CONDUCT.md)을 참고하세요. 취약점을 보고하려면 [보안 정책](./SECURITY.md)을 참고하세요.

## 릴리스

릴리스는 `main`에서 버전 태그를 push하여 만듭니다. 나머지는 [`release.yml`](../../.github/workflows/release.yml)이 처리합니다. 검사 실행, npm Trusted Publishing을 통한 provenance 포함 `npm publish`, 그리고 `CHANGELOG.md`에서 가져온 내용으로 GitHub Release를 생성합니다.

<details>
<summary><strong>릴리스 절차 (메인테이너용)</strong></summary>

1. [`CHANGELOG.md`](../../CHANGELOG.md)에서 `## [Unreleased]` 항목을 새 `## [x.y.z] - YYYY-MM-DD` 헤딩 아래로 옮기고, 파일 하단의 비교 링크를 업데이트합니다. polaris-types 동기화 PR이 새로 추가되거나 제거된 컴포넌트를 자동으로 기록하므로, prop, slot, 아이콘 변경 사항은 직접 추가합니다(제거는 breaking change입니다).
2. `npm version x.y.z --no-git-tag-version`을 실행하고, 두 파일을 커밋한 뒤 `main`에 push합니다.
3. `git tag vx.y.z && git push origin vx.y.z`. pre-release 접미사가 붙은 태그(예: `v0.3.0-rc.0`)는 `next` dist-tag로 게시됩니다.

</details>

## 라이선스

[MIT](../../LICENSE). Shopify와 제휴하거나 Shopify의 보증을 받은 프로젝트가 아닙니다.
