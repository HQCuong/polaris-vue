---
title: Начало работы с Shopify Polaris в Vue 3
description: Установите polaris-vue-elements, подключите рантайм веб-компонентов Shopify Polaris и используйте типизированные обёртки Vue 3, такие как SButton и STextField с v-model, в приложении на Vue или в приложении Shopify.
---

# Начало работы {#getting-started}

`polaris-vue-elements` — это набор типизированных компонентов Vue 3, которые оборачивают
веб-компоненты Shopify Polaris (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). Сами
веб-компоненты загружаются во время выполнения из CDN Shopify — эта библиотека лишь даёт
вам типизированный, идиоматичный интерфейс Vue (props, события, v-model) поверх них.

## 1. Установка {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Подключите рантайм Polaris {#_2-load-the-polaris-runtime}

Компоненты-обёртки только отображают данные — сами определения
пользовательских элементов в них не входят. Ваше приложение должно подключить скрипт
рантайма Shopify Polaris, который глобально регистрирует элементы `<s-*>`:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Это работает в любом приложении на Vue, а не только в админке Shopify: компоненты —
обычные пользовательские элементы и отображаются везде, где загружен скрипт.

`polaris-2.js` — стабильный канал Shopify, который мы рекомендуем для продакшена.
Чтобы закрепить точный релиз или понять, как версия рантайма связана с версией этой
библиотеки, прочитайте
[Особенности и подводные камни](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 и новый дизайн админки {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 приносит новый визуальный дизайн админки Shopify (цвета, типографику,
отступы и значки). Он стал стабильным 22 октября 2026 года
([анонс](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Переход с 1.x делается по желанию: замените `polaris-1.js` на `polaris-2.js`.

- **Менять код не нужно.** 2.0 — это визуальное обновление: его компоненты, props,
  события и слоты те же, что в 1.1, плюс несколько добавлений (например, prop `loading`
  у `SThumbnail`). Приложения, которые остаются на `polaris-1.js`, продолжают работать
  с этими обёртками; только для добавлений нужен рантайм 2.x.
- **Оформление следует дизайну каждого магазина.** В админке Shopify магазин с новым
  дизайном админки получает новый вид, а магазин с прежним дизайном сохраняет вид 1.x.
  Вне админки по умолчанию используется новый вид, поэтому его удобно просматривать
  локально.
- **Закреплённому или «липкому» содержимому у нижнего края окна** нужно резервировать
  место с помощью CSS-переменной `--shopify-safe-area-inset-bottom`
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  чтобы плавающая панель Sidekick его не перекрывала.
- **Приложения со статусом «Built for Shopify»** должны соответствовать новому
  визуальному стилю админки к **1 мая 2027 года**.

## 3. Настройте Vite {#_3-configure-vite}

Скажите компилятору Vue считать любой тег `s-*` пользовательским элементом, а не
пытаться разрешать его как компонент Vue:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 4. Ваш первый компонент {#_4-your-first-component}

Импортируйте компоненты из `polaris-vue-elements` и используйте их как любые другие
компоненты Vue — props и события полностью типизированы:

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. v-model в компонентах форм {#_5-v-model-on-form-components}

Компоненты форм поддерживают `v-model`, связанный с нужной парой prop/событие
соответствующего элемента (полное соответствие смотрите в `src/lib/overrides.ts` —
текстовые поля используют `value`/`input`, `SCheckbox`/`SSwitch` — `checked`/`change`,
`SChoiceList` — `values`/`change` и так далее):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. Управление оверлеями (модальное окно, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Оверлеями вроде `SModal` можно управлять двумя способами:

**Декларативно**, с помощью стандартных HTML-атрибутов `commandFor`/`command` на
кнопке-триггере — скрипт не нужен:

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**Императивно**: получите типизированную ссылку на шаблон и вызовите метод
базового элемента через `$el`:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. Типизация «сырых» тегов `<s-*>` (необязательно) {#_7-typing-raw-s-tags-optional}

Если вы предпочитаете писать собственные теги Polaris (`<s-button>`, `<s-text-field>`, …),
а не переходить на обёртки, пакет всё равно может их типизировать. Включите это один раз
в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

или директивой reference в файле `.d.ts`, например `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Это добавляет каждый тег Polaris в `GlobalComponents` Vue, поэтому Volar и `vue-tsc`
проверяют «сырые» теги так же, как обёртки: props с union-типами, типизированные
слушатели `@click` / `@aftershow` и типизированный элемент для императивных методов.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

Это только типы: во время выполнения ничего не регистрируется, поэтому оставьте
настройку `isCustomElement` из шага 3. Два отличия от обёрток:

- **В «сырых» тегах нет `v-model`.** Привяжите `:value` и подпишитесь на `@input` / `@change`
  самостоятельно либо используйте компонент-обёртку, которая сопоставляет свойство и
  событие каждого поля формы за вас.
- **Не сочетайте это с самодельной shim-декларацией** тех же тегов в вашем проекте —
  две декларации `GlobalComponents['s-button']` с разными типами конфликтуют.
  Удалите shim, когда включите эту возможность.

## Дальнейшие шаги {#next-steps}

Загляните в [справочник компонентов](/ru/components/), где перечислены все props и события
каждой обёртки, или прочитайте [Особенности и подводные камни](/ru/guide/quirks), пока
вы с ними не столкнулись сами.

Создаёте приложение Shopify? Прочитайте [Создание встроенного приложения Shopify на Vue 3](/ru/guide/shopify-embedded-app):
там о подключении App Bridge, аутентифицированных запросах и API App Bridge из Vue.

Используете App Bridge? В `polaris-vue-elements/app-bridge` есть компоненты Vue для Modal, SaveBar,
TitleBar и не только: см. [Компоненты App Bridge](/ru/app-bridge/).

Пишете собственный CSS вокруг компонентов? Используйте [CSS-переменные Polaris](/ru/css-variables/)
(`--p-space-*`, `--p-color-*`, …), чтобы ваша вёрстка совпадала с их отступами и цветами.
