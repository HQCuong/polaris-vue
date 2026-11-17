<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md) | [Español](../es/README.md) | [हिन्दी](../hi/README.md) | [Português (Brasil)](../pt/README.md) | **Русский**</sub>

<br>

<a href="https://polaris-vue-elements.dev/ru/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: типизированные обёртки Vue 3 для web components Shopify Polaris" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Документация](https://polaris-vue-elements.dev/ru/)** ·
[Начало работы](https://polaris-vue-elements.dev/ru/guide/getting-started) ·
[Компоненты](https://polaris-vue-elements.dev/ru/components/) ·
[Руководство по встроенному приложению](https://polaris-vue-elements.dev/ru/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Этот перевод может отставать от английской версии. При расхождениях приоритет имеет [английская версия](../../README.md).

Типизированные обёртки Vue 3 для [web components Shopify Polaris](https://shopify.dev/docs/api/app-home/web-components): custom elements `s-*`, из которых собираются приложения Shopify App Home (встроенные в админку Shopify).

Сам runtime Polaris загружается с CDN Shopify (стабильный канал `polaris-2.js` автоматически получает совместимые обновления). Эта библиотека даёт поверх него идиоматичный и полностью типизированный интерфейс для Vue.

## Возможности

- **Типизированные пропсы и события для всех 62 компонентов**, сгенерированные из официального Custom Elements Manifest Shopify (`@shopify/polaris-types`): пропсы с union-типами, такие как `variant`, автодополнение в шаблонах, типизированные обработчики `@click` / `@aftershow`.
- **`v-model` на 17 компонентах форм** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), каждый сопоставлен с правильной парой свойство/событие.
- **Императивное управление оверлеями.** `SModal` предоставляет типизированный `$el` (`ModalElement`), поэтому `modal.value?.$el.showOverlay()` проходит проверку типов, а рядом остаётся декларативный паттерн Polaris `commandFor` / `command`.
- **Мягко деградирует и никогда не блокирует.** Неизвестные пропсы передаются через `$attrs`, слоты пробрасываются как есть, а совсем новые компоненты Polaris всегда можно использовать как «сырые» теги `s-*`. Устаревшая обёртка означает лишь отсутствие типов для новых возможностей, но не сломанные существующие.

## Установка

```sh
npm install polaris-vue-elements
```

Vue `^3.5` является peer-зависимостью.

### Настройка runtime (обязательно)

Обёртки отвечают только за представление. Ваше приложение само загружает runtime Polaris с CDN Shopify и сообщает Vue, что теги `s-*` являются custom elements:

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

> **Примечание:** `polaris-2.js` — стабильный канал Shopify, который приносит новый визуальный дизайн админки. Приложения, которые всё ещё используют `polaris-1.js`, продолжают работать: API компонентов в 2.0 совпадает с 1.1, за исключением нескольких дополнений. См. [Polaris 2.0 и новый дизайн админки](https://polaris-vue-elements.dev/ru/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Быстрый старт

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

> **Совет:** предпочитаете писать собственные теги Polaris `<s-button>`? Добавьте `"types": ["polaris-vue-elements/elements"]` в `tsconfig.json`, и Volar / `vue-tsc` будут проверять типы и «сырых» тегов `<s-*>` (только типы; `v-model` остаётся только у обёрток). См. [Типизация «сырых» тегов `<s-*>`](https://polaris-vue-elements.dev/ru/guide/getting-started#_7-typing-raw-s-tags-optional).

## Документация

Всё находится на **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/ru/)**:

- [Начало работы](https://polaris-vue-elements.dev/ru/guide/getting-started): настройка, `v-model`, оверлеи и типизированные «сырые» теги.
- [Создание встроенного приложения Shopify на Vue 3](https://polaris-vue-elements.dev/ru/guide/shopify-embedded-app): App Bridge, аутентифицированный `fetch`, навигация и панель сохранения (save bar).
- [Компоненты App Bridge](https://polaris-vue-elements.dev/ru/app-bridge/): `Modal`, `SaveBar`, `AppWindow`, `TitleBar`, `NavMenu` и `useAppBridge` из `polaris-vue-elements/app-bridge`, повторяющие `@shopify/app-bridge-react`.
- [Известные особенности](https://polaris-vue-elements.dev/ru/guide/quirks): поведение Polaris, проверенное в реальном браузере.
- [CSS-переменные](https://polaris-vue-elements.dev/ru/css-variables/): дизайн-токены Polaris (`--p-color-*`, `--p-space-*`, …) в виде импортируемого `polaris-vue-elements/tokens.css` для вашего собственного layout CSS.
- [Справочник компонентов](https://polaris-vue-elements.dev/ru/components/): пропсы, события, слоты, рекомендации и живые примеры для всех 62 компонентов.

Исходники сайта лежат в [`docs/`](../../docs); запустить его локально можно командой `npm run docs:dev`.

## Использование с AI-агентами для программирования

Пакет включает [`AGENTS.md`](../../AGENTS.md) — руководство для AI-агентов, которые пишут Vue-код с этой библиотекой. После установки он находится в `node_modules/polaris-vue-elements/AGENTS.md`, поэтому соответствует установленной у вас версии; направьте на него инструкции агента в вашем проекте.

Документация также публикуется в виде Markdown: [`llms.txt`](https://polaris-vue-elements.dev/llms.txt) (индекс), [`llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) (все английские страницы в одном файле) и `.md`-копия каждой страницы, например [`/components/s-button.md`](https://polaris-vue-elements.dev/components/s-button.md). См. [Использование polaris-vue-elements с AI-агентами](https://polaris-vue-elements.dev/ru/guide/ai-agents).

## Как это работает

Всё, что можно вывести из манифеста Shopify, генерируется автоматически; человеческое решение живёт в одном небольшом файле.

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 62 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

Тесты-стражи дрейфа (drift guards) не дают ничего забыть: CI падает, если сгенерированный код устарел, если у компонента из манифеста нет обёртки или если у нового компонента, похожего на форму, нет переопределения v-model. Запланированный workflow ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) автоматически открывает PR синхронизации, когда публикуется новая версия `@shopify/polaris-types`.

<details>
<summary><strong>Обновление до новой версии Polaris вручную</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## Разработка

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

## Участие в проекте

Отчёты об ошибках, исправления документации и pull request'ы приветствуются. Установку, основные правила и чек-лист перед PR смотрите в [руководстве для участников](./CONTRIBUTING.md), а также в [кодексе поведения](./CODE_OF_CONDUCT.md). О найденной уязвимости сообщайте согласно [политике безопасности](./SECURITY.md).

## Выпуск релизов

Релизы создаются из `main` отправкой тега версии. Остальное делает [`release.yml`](../../.github/workflows/release.yml): проверки, `npm publish` с provenance через npm Trusted Publishing и GitHub Release, заметки которого берутся из `CHANGELOG.md`.

<details>
<summary><strong>Шаги выпуска (для мейнтейнеров)</strong></summary>

1. В [`CHANGELOG.md`](../../CHANGELOG.md) перенесите записи из `## [Unreleased]` под новый заголовок `## [x.y.z] - YYYY-MM-DD` и обновите ссылки сравнения внизу файла. PR синхронизации polaris-types автоматически записывают туда добавленные и удалённые компоненты; изменения пропсов, слотов и иконок добавляйте вручную (удаления считаются ломающими изменениями).
2. `npm version x.y.z --no-git-tag-version`, закоммитьте оба файла и отправьте в `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Теги с суффиксом пре-релиза (например, `v0.3.0-rc.0`) публикуются под dist-тегом `next`.

</details>

## Лицензия

[MIT](../../LICENSE). Проект не связан с Shopify и не одобрен ею.
