---
title: AI 코딩 에이전트와 함께 쓰는 Vue 3의 Shopify Polaris — llms.txt와 AGENTS.md
description: AI 코딩 에이전트에 polaris-vue-elements 문서를 Markdown으로 제공하세요 — llms.txt, llms-full.txt, 모든 페이지의 .md 사본, npm 패키지에 포함된 AGENTS.md 가이드.
---

# AI 에이전트와 함께 polaris-vue-elements 사용하기 {#using-polaris-vue-elements-with-ai-agents}

코딩 에이전트는 React 예제나 원래의 `<s-*>` 태그를 보고 추측하는 대신 이 라이브러리의 문서를
읽으면 더 나은 Vue 코드를 작성합니다. 문서는 에이전트가 읽을 수 있는 세 가지 형태로 제공되며,
npm 패키지에는 에이전트를 위해 작성된 짧은 가이드가 포함되어 있습니다.

## llms.txt와 llms-full.txt {#llms-txt-and-llms-full-txt}

[llms.txt](https://llmstxt.org/) 규약에 따라 사이트는 다음을 게시합니다.

| URL | 설명 |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | 영어 문서의 색인입니다. 가이드, 카테고리별 모든 컴포넌트, App Bridge, CSS 변수가 각각 한 줄 설명과 Markdown 사본 링크와 함께 나열됩니다. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | 모든 영어 페이지를 하나의 Markdown 파일로 합친 것입니다. |

`llms.txt`는 에이전트에 시작점으로 건네기에 충분히 작으며, 에이전트는 링크를 따라 필요한 페이지로 이동합니다. `llms-full.txt`는 크기가 크므로 전체 레퍼런스를 한 번에 컨텍스트에 넣어야 할 때 사용하세요.

## 모든 페이지의 Markdown 사본 {#a-markdown-copy-of-every-page}

모든 영어 페이지는 같은 경로에 `.md`를 붙인 Markdown으로도 존재합니다.

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

컴포넌트 페이지의 사본에는 라이브 데모를 제외한 import, `v-model` 바인딩, props, events, methods, slots가 들어 있습니다. 각 HTML 페이지는 `<link rel="alternate" type="text/markdown">`로 자신의 사본을 연결합니다.

## npm 패키지에 포함된 AGENTS.md {#agents-md-in-the-npm-package}

`polaris-vue-elements`에는 `AGENTS.md`가 포함되어 있습니다. 이 라이브러리로 Vue 3 앱을 작성하는 에이전트를 위한 간결한 가이드로, 설정, import, `v-model`, App Bridge, 알려진 특이 사항, 그리고 모든 컴포넌트와 태그 목록을 담고 있습니다. 패키지 안에 들어 있으므로 항상 설치된 버전과 일치합니다.

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## 에이전트가 읽도록 안내하기 {#point-your-agent-at-it}

대부분의 코딩 에이전트는 `AGENTS.md`, `CLAUDE.md`, Cursor 규칙 같은 프로젝트 지침 파일을 읽습니다. 에이전트가 UI 코드를 작성하기 전에 라이브러리 가이드를 읽도록, 사용 중인 에이전트의 파일에 몇 줄을 추가하세요.

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

에이전트가 `node_modules`의 파일을 읽을 수 없다면 대신 [`llms.txt`](https://polaris-vue-elements.dev/llms.txt) URL을 주세요.

## 다음 단계 {#next-steps}

- [시작하기](/ko/guide/getting-started): 설치, Polaris runtime, `v-model`.
- [알려진 특이 사항](/ko/guide/quirks): 에이전트에도 알려 줄 만한 동작.
- [전체 컴포넌트](/ko/components/): Markdown 사본의 원본이 되는 레퍼런스.
