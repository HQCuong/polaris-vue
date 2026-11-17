<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md) | [Español](../es/CONTRIBUTING.md) | [हिन्दी](../hi/CONTRIBUTING.md) | [Português (Brasil)](../pt/CONTRIBUTING.md) | **Русский**</sub>

# Участие в проекте

> Этот перевод может отставать от английской версии. При расхождениях приоритет имеет [английская версия](../../CONTRIBUTING.md).

Спасибо за помощь. Отчёты об ошибках, исправления документации и pull request'ы приветствуются.

От всех участников ожидается соблюдение [кодекса поведения](./CODE_OF_CONDUCT.md).

## Прежде чем начать

- **Ошибка или небольшое исправление?** Откройте pull request сразу или issue, если не уверены, что это ошибка.
- **Новая функциональность или изменение публичного API?** Сначала откройте issue, чтобы мы согласовали подход
  до того, как вы напишете код.

## Настройка

Используйте версию Node из [`.nvmrc`](../../.nvmrc) (`nvm use`), затем:

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## Основные правила

1. **Никогда не редактируйте `src/lib/generated/` и `docs/components/` вручную.** Их перезаписывают
   генераторы. Вместо этого меняйте `scripts/generate.mjs` / `scripts/generate-docs.mjs`, затем запустите
   `npm run generate && npm run docs:generate` и закоммитьте результат.
2. **Новому компоненту формы нужен v-model?** Добавьте одну строку в `src/lib/overrides.ts` (drift guard
   в `overrides.spec.ts` указывает ровно на то, чего не хватает).
3. **Нужен кураторский пример для документации?** Добавьте `docs/examples/<tag>.md` (сложные живые демо кладите в
   `docs/examples/demos/*.vue`, так как SFC не портятся markdown-it); генератор документации
   подключает его автоматически. Рекомендации, написанные вручную, лежат в `docs/best-practices/<tag>.md`.
4. **Проверяйте поведение Polaris в реальном браузере.** Утверждения о компонентах Polaris (правила слотов,
   особенности рендеринга) нужно сверять с настоящим runtime из CDN (`polaris-2.js`), а не только с
   jsdom. Ранее проверенные находки смотрите в [`docs/guide/quirks.md`](../../docs/guide/quirks.md).
5. **Добавьте тест** для любого изменения поведения в `src/lib/runtime/` или в генераторах.

## Перед открытием pull request

Запустите те же проверки, что и CI:

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

Затем:

- **Добавьте строку в `CHANGELOG.md`** под `## [Unreleased]` (в `Added`, `Changed`, `Fixed` или
  `Removed`) для всего, что заметит пользователь пакета. Изменениям только в документации и внутренним
  изменениям она не нужна. CHANGELOG пишется на английском.
- **Назовите PR в стиле [Conventional Commits](https://www.conventionalcommits.org/)**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Ломающие изменения помечайте `!`
  (`feat!: ...`).
- Одно изменение — один pull request.

## Что происходит после открытия pull request

- Если это ваш первый вклад, GitHub Actions ждёт, пока мейнтейнер одобрит запуск CI.
  Это защита GitHub для pull request'ов из форков, а не оценка вашего изменения.
- Мейнтейнер проводит ревью, вливает и выпускает изменение в следующем релизе. Релизы создаёт
  мейнтейнер (см. [Выпуск релизов](./README.md#выпуск-релизов)).

## Безопасность

Нашли уязвимость? Не открывайте issue; см. [политику безопасности](./SECURITY.md).

## Лицензия

Участвуя в проекте, вы соглашаетесь, что ваш вклад распространяется под [лицензией MIT](../../LICENSE).
