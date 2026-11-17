---
title: Создание встроенного приложения Shopify на Vue 3
description: Создайте приложение Shopify на Vue 3 и Vite — подключите App Bridge и веб-компоненты Polaris, аутентифицируйте fetch-запросы к своему бэкенду и используйте типизированные компоненты s-* в App Home.
---

# Создание встроенного приложения Shopify на Vue 3 {#build-a-shopify-embedded-app-with-vue-3}

Встроенное приложение (Shopify называет его интерфейс
[App Home](https://shopify.dev/docs/apps/build/app-home)) — это веб-приложение, которое вы
размещаете сами, а Shopify показывает его в iframe внутри админки. Его можно создать на
любом веб-фреймворке, включая Vue 3.

Во время выполнения Shopify предоставляет из своего CDN две вещи:

- **App Bridge** (`app-bridge.js`) соединяет ваш iframe с админкой и предоставляет
  глобальный объект `shopify` (toast-уведомления, модальные окна, навигация, токены сессии, ...).
- **Веб-компоненты Polaris** (`polaris-2.js`) регистрируют пользовательские элементы `<s-*>`.

`polaris-vue-elements` добавляет типизированные компоненты Vue 3 (`SPage`, `STextField`, `SModal`, ...)
поверх этих элементов. Это проект сообщества, а не продукт Shopify.

Документация и шаблоны Shopify ориентированы на React, поэтому это руководство
охватывает то, что специфично для Vue. Оно предполагает, что вы уже прочитали [Начало работы](/ru/guide/getting-started).

## Архитектура {#architecture}

- **Фронтенд:** одностраничное приложение на Vue 3 + Vite, которое отдаётся с URL, который вы
  контролируете. Shopify загружает его в iframe админки.
- **Бэкенд:** любой сервер, который умеет проверять ID-токены Shopify и вызывать Admin API.
  Для аутентификации используется
  [обмен токенов](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  фронтенд отправляет ID-токен, ваш бэкенд проверяет его и обменивает на
  токен доступа.

`shopify app init` создаёт заготовку приложения на React Router; шаблона для Vue или
другого не-React стека Shopify не предлагает. Для другого стека Shopify отправляет вас к
своей документации по аутентификации и к официальной библиотеке API для вашего языка
(есть библиотека для Node.js без зависимостей от фреймворков). Один из практичных
вариантов — создать бэкенд как вам удобно, а приложение на Vue собрать отдельно, как
описано ниже.

В `shopify.app.toml` приложение становится встроенным с помощью `embedded = true`, а
`application_url` указывает на адрес, по которому отдаётся ваше приложение.

## 1. Подключите App Bridge и Polaris {#_1-load-app-bridge-and-polaris}

Добавьте метатег `shopify-api-key` (client ID вашего приложения) и оба скрипта в
`<head>` файла `index.html`:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite подставляет переменные `%VITE_*%` в `index.html` значениями из вашего окружения
(например, `VITE_SHOPIFY_API_KEY` в `.env`). Ключ можно вместо этого внедрять
с вашего сервера.

App Bridge не версионируется вместе с Polaris: в его URL нет версии, и он всегда загружает
последнюю версию App Bridge. О каналах Polaris (`polaris-2.js`, закреплённые релизы) читайте в
[Особенности и подводные камни](/ru/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Открывайте приложение из админки Shopify (например, по URL предпросмотра, который выводит
`shopify app dev`). Если загрузить его напрямую во вкладке браузера, вокруг не будет админки,
и возможности App Bridge работать не будут.

Для типизированного доступа к глобальному объекту `shopify` установите пакет типов Shopify и
подключите его (Shopify документирует для этого `@shopify/app-bridge-types`):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

Тот же пакет типизирует `polaris-vue-elements/app-bridge`, где есть компоненты Vue для
элементов App Bridge и composable `useAppBridge()`; см.
[Компоненты App Bridge](/ru/app-bridge/).

## 2. Настройте Vite {#_2-configure-vite}

Считайте теги `s-*` пользовательскими элементами. Это та же конфигурация, что и в
[Начале работы](/ru/guide/getting-started#_3-configure-vite):

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

Если в шаблонах вы пишете «сырые» теги App Bridge `ui-*` (например, `<ui-title-bar>`), добавьте
`|| tag.startsWith('ui-')`. Компонентам из
[`polaris-vue-elements/app-bridge`](/ru/app-bridge/#raw-tags) это не нужно.

## 3. Создайте страницу {#_3-build-a-page}

На этой странице есть форма с `v-model`, кнопка сохранения, которая обращается к вашему бэкенду, и
модальное окно, подтверждающее сброс. `SModal` открывается декларативно через `commandFor`/`command`;
см. [`SModal`](/ru/components/s-modal) и
[особенность слотов действий модального окна](/ru/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. Обращение к бэкенду {#_4-talk-to-your-backend}

Обычно токен прикреплять самому не нужно. App Bridge перехватывает `fetch()` и для
запросов к домену вашего приложения и его поддоменам добавляет ID-токен в заголовок
`Authorization` (а локаль магазина — в `Accept-Language`). Достаточно обычного
относительного вызова:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

На сервере:

- Проверяйте ID-токен в каждом запросе: подпись HS256 с вашим client secret, `exp`
  и `nbf`, `aud`, равный вашему client ID, и совпадающие имена хостов в `iss` и `dest`.
  При ошибке отвечайте `401`.
- ID-токены истекают через одну минуту и являются предъявительскими учётными данными: отправляйте их только на
  собственный бэкенд.
- Обменяйте ID-токен на токен доступа для вызова Admin API и храните этот токен
  на сервере.

Вызывайте `shopify.idToken()` самостоятельно, только когда перехватчик не покрывает запрос,
например при WebSocket-соединении:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Если вашему приложению нужен только GraphQL Admin API, App Bridge может направлять
`fetch('shopify:admin/api/graphql.json', ...)` через админку, когда в конфигурации приложения
включён Direct API access, без собственного бэкенда. См.
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Используйте API App Bridge из Vue {#_5-use-app-bridge-apis-from-vue}

Всё доступно через глобальный объект `shopify`; плагин Vue не нужен. `useAppBridge()` из
`polaris-vue-elements/app-bridge` возвращает тот же глобальный объект и выдаёт понятную ошибку на
сервере или когда скрипт App Bridge отсутствует; см.
[useAppBridge()](/ru/app-bridge/use-app-bridge).

### Toast-уведомления {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` принимает `duration` (мс), `isError`, `action`, `onAction` и
`onDismiss` и возвращает id, который можно передать в `shopify.toast.hide(id)`.

### Модальные окна по id {#modals-by-id}

Помимо `commandFor`, `shopify.modal` управляет `SModal` по его `id`:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### Навигация приложения {#app-navigation}

`<s-app-nav>` отображает навигацию приложения в боковой панели админки. Держите его смонтированным
рядом с корнем приложения, например в `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

Активный пункт определяется по текущему URL. Для навигации из кода в
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
Shopify описаны ссылки, `open('/settings', '_self')` и History API
(`history.pushState`).

### Панель сохранения (save bar) {#save-bar}

Добавьте `data-save-bar` к `<form>`, и админка покажет панель сохранения, когда в форме есть
несохранённые изменения; `submit` срабатывает при нажатии «Сохранить», а `reset` — при «Отменить». Не сочетайте это с
программными методами `shopify.saveBar` для той же формы. См.
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).
Об элементе `ui-save-bar`, привязанном к `v-model:open`, читайте в
[`SaveBar`](/ru/app-bridge/save-bar).

## Дальнейшие шаги {#next-steps}

- Просмотрите [все компоненты](/ru/components/) и прочитайте [Особенности и подводные камни](/ru/guide/quirks).
- Используйте [компоненты App Bridge](/ru/app-bridge/) (`Modal`, `SaveBar`, `AppWindow`, ...).
- Вернитесь к [Началу работы](/ru/guide/getting-started) за `v-model`, оверлеями и типизацией «сырых» тегов.
- Прочитайте [документацию App Home](https://shopify.dev/docs/apps/build/app-home) и
  [API App Bridge](https://shopify.dev/docs/api/app-home/apis) от Shopify.
