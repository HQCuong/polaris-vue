---
title: Shopify Polaris в Vue 3 с ИИ-агентами для программирования — llms.txt и AGENTS.md
description: Дайте ИИ-агентам для программирования документацию polaris-vue-elements в формате Markdown — llms.txt, llms-full.txt, копию каждой страницы в .md и руководство AGENTS.md, которое входит в npm-пакет.
---

# Использование polaris-vue-elements с ИИ-агентами {#using-polaris-vue-elements-with-ai-agents}

Агенты для программирования пишут более качественный код на Vue с этой библиотекой, когда
читают её документацию, а не угадывают по примерам на React или «сырым» тегам `<s-*>`.
Документация доступна в трёх формах, которые агенты могут прочитать, а npm-пакет
содержит короткое руководство, написанное для них.

## llms.txt и llms-full.txt {#llms-txt-and-llms-full-txt}

Следуя соглашению [llms.txt](https://llmstxt.org/), сайт публикует:

| URL | Что это |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Индекс английской документации: руководства, каждый компонент по категориям, App Bridge и CSS-переменные — у каждого однострочное описание и ссылка на его копию в Markdown. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Все английские страницы в одном файле Markdown. |

`llms.txt` достаточно мал, чтобы дать его агенту как отправную точку; агент переходит по
ссылкам на нужные ему страницы. `llms-full.txt` велик, поэтому используйте его, когда
весь справочник должен находиться в контексте одновременно.

## Копия каждой страницы в Markdown {#a-markdown-copy-of-every-page}

Каждая английская страница существует и в виде Markdown по тому же пути с добавленным `.md`:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

В копии страницы компонента есть импорт, привязка `v-model`, props, события, методы и
слоты, но нет живых демо. Каждая HTML-страница ссылается на свою копию через
`<link rel="alternate" type="text/markdown">`.

## AGENTS.md в npm-пакете {#agents-md-in-the-npm-package}

`polaris-vue-elements` поставляется с `AGENTS.md` — компактным руководством для агента,
который пишет приложение на Vue 3 с этой библиотекой: настройка, импорты, `v-model`,
App Bridge, известные особенности и список всех компонентов с их тегами. Поскольку файл
находится внутри пакета, он всегда соответствует установленной у вас версии:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Укажите агенту на него {#point-your-agent-at-it}

Большинство агентов для программирования читают файл с инструкциями проекта, например
`AGENTS.md`, `CLAUDE.md` или правило Cursor. Добавьте несколько строк в тот файл, который
использует ваш агент, чтобы он читал руководство библиотеки перед написанием кода UI:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Если ваш агент не может читать файлы в `node_modules`, дайте ему вместо этого URL
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Дальнейшие шаги {#next-steps}

- [Начало работы](/ru/guide/getting-started): установка, рантайм Polaris и `v-model`.
- [Особенности и подводные камни](/ru/guide/quirks): поведение, о котором стоит рассказать и агенту.
- [Все компоненты](/ru/components/): справочник, из которого создаются копии в Markdown.
