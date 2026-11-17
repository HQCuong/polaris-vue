---
title: Веб-компоненты Shopify Polaris в Vue — известные особенности
description: Проверенные в браузере особенности веб-компонентов Shopify Polaris при использовании из Vue 3 — требования к слотам, момент срабатывания событий и поведение v-model, отличающиеся от типичных библиотек компонентов Vue.
---

# Особенности и подводные камни {#known-quirks-gotchas}

Это реальное, проверенное в браузере поведение базовых веб-компонентов Polaris, которое
не всегда совпадает с тем, чего вы ожидаете, придя из типичной библиотеки компонентов
Vue. Если прочитать об этом заранее, вы сэкономите время на отладке.

## 1. `<SBanner>` требует содержимого в слоте {#_1-sbanner-needs-slot-content}

Одного атрибута `heading` недостаточно — `<s-banner>` отображается пустым, если у него
нет содержимого в слоте по умолчанию.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Слоты действий модального окна принимают только определённые варианты кнопок {#_2-modal-action-slots-only-accept-specific-button-variants}

Слот `primary-action` у `SModal` принимает только одну кнопку с
`variant="primary"`. Polaris назначает содержимое слотов вручную, и любой
неподходящий узел **молча отбрасывается** — без предупреждения и ошибки он
просто не отображается. Слот `secondary-actions` принимает кнопки с `variant`
`secondary` или `auto`.

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

## 3. Props числового типа нужно привязывать, а не писать строковыми атрибутами {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

В собственной документации Polaris показаны обычные HTML-атрибуты (например, `rows="3"`),
но в Vue это вводит в заблуждение: для props типа `number` `vue-tsc` ожидает
привязанное выражение, а не строковый литерал.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Назначение слотов происходит один раз, при подключении {#_4-slot-assignment-happens-once-at-connect-time}

Если изменить атрибут `slot` дочернего элемента после монтирования родителя, элемент
не будет переназначен. Если элемент нужно переместить между именованными слотами,
пересоздайте его (например, через `v-if`/`:key`), а не меняйте `slot` реактивно.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Рантайм Polaris версионируется в CDN — версия этой библиотеки не совпадает с версией рантайма {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

С августа 2026 года CDN Polaris следует семантическому версионированию
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Выберите канал, который подходит вашему процессу релизов:

| URL | Что отдаёт |
| --- | --- |
| `polaris-2.js` | Стабильный канал 2.x — новый визуальный стиль админки Shopify; совместимые (минорные) обновления получает автоматически. **Рекомендуется.** |
| `polaris-2.0.js` | Закреплённый релиз — никаких новых возможностей, исправлений и визуальных изменений, пока вы не сдвинете закрепление. |
| `polaris-1.js` | Предыдущий стабильный канал 1.x. |
| `polaris.js` | Устаревший URL — сейчас отдаёт ту же сборку, что и `polaris-1.js`, и сам никогда не переходит на новую мажорную версию. |

Новая мажорная версия (например, 2.0) всегда подключается по желанию: вы меняете URL
скрипта. Polaris 2.0 — это визуальное обновление: его Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) объявляет те же теги, props, события и слоты,
что и 1.1, плюс несколько добавлений (prop `loading` у `SThumbnail`, больше значков
у `STextField`), поэтому эти обёртки работают и с `polaris-1.js`.

Какой бы канал вы ни загружали, рантайм обновляется независимо от установленной версии
`polaris-vue-elements`. Версия этой библиотеки отражает лишь актуальность её
сгенерированных **типов и обёрток**:

- Устаревшая обёртка никогда не ломает уже существующие компоненты — в ней
  просто могут отсутствовать типизированные props и события для возможностей, которые
  Shopify добавил после последней генерации обёртки.
- Неизвестные props по-прежнему работают: они передаются без типов через `$attrs` на
  базовый элемент.
- Неизвестные или новые компоненты по-прежнему работают: используйте тег
  пользовательского элемента напрямую (например, `<s-new-component>`), пока для него
  не будет сгенерирована типизированная обёртка.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
