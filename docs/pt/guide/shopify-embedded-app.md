---
title: Crie um app incorporado da Shopify com Vue 3
description: Crie um app da Shopify com Vue 3 e Vite — carregue o App Bridge e os web components do Polaris, autentique as chamadas fetch para o seu backend e use componentes s-* tipados no App Home.
---

# Crie um app incorporado da Shopify com Vue 3 {#build-a-shopify-embedded-app-with-vue-3}

Um app incorporado (a Shopify chama a interface dele de
[App Home](https://shopify.dev/docs/apps/build/app-home)) é um app web que você mesmo
hospeda e que a Shopify renderiza em um iframe dentro do admin. Você pode criá-lo com
qualquer framework web, incluindo o Vue 3.

Em tempo de execução, a Shopify fornece duas coisas a partir do seu CDN:

- **App Bridge** (`app-bridge.js`) conecta o seu iframe ao admin e expõe o objeto
  global `shopify` (toasts, modais, navegação, tokens de sessão, ...).
- **Web components do Polaris** (`polaris-2.js`) registram os custom elements `<s-*>`.

`polaris-vue-elements` adiciona componentes tipados do Vue 3 (`SPage`, `STextField`, `SModal`, ...)
sobre esses elementos. É um projeto da comunidade, não feito pela Shopify.

A documentação e os templates da própria Shopify são voltados para React, então este guia cobre as partes
específicas do Vue. Ele parte do princípio de que você já leu [Primeiros passos](/pt/guide/getting-started).

## Arquitetura {#architecture}

- **Frontend:** uma single-page app em Vue 3 + Vite, servida a partir de uma URL que você controla. A Shopify
  a carrega no iframe do admin.
- **Backend:** qualquer servidor capaz de validar os ID tokens da Shopify e chamar a Admin API.
  A autenticação usa
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  o frontend envia um ID token, o seu backend o valida e o troca por um
  access token.

`shopify app init` gera um app com React Router; a Shopify não oferece um template Vue nem qualquer outro
que não seja React. Para outra stack, a Shopify indica a sua documentação de autenticação
e a biblioteca de API oficial para a sua linguagem (existe uma para Node.js sem
dependência de framework). Uma organização prática é gerar o backend como você
preferir e criar o app Vue separadamente, como descrito abaixo.

No `shopify.app.toml`, o app é incorporado com `embedded = true` e `application_url`
apontando para onde o seu app é servido.

## 1. Carregue o App Bridge e o Polaris {#_1-load-app-bridge-and-polaris}

Adicione a meta tag `shopify-api-key` (o client ID do seu app) e os dois scripts ao
`<head>` do `index.html`:

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

O Vite substitui as variáveis `%VITE_*%` no `index.html` por valores do seu ambiente
(por exemplo, `VITE_SHOPIFY_API_KEY` no `.env`). Você também pode injetar a chave a partir do seu
servidor.

O App Bridge não é versionado junto com o Polaris: a URL dele não tem versão e sempre carrega o
App Bridge mais recente. Para os canais do Polaris (`polaris-2.js`, versões fixadas), consulte
[Peculiaridades e armadilhas](/pt/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Abra o app a partir do admin da Shopify (por exemplo, pela URL de preview exibida pelo
`shopify app dev`). Se ele for carregado diretamente em uma aba do navegador, não há admin ao redor e
os recursos do App Bridge não funcionam.

Para ter acesso tipado ao global `shopify`, instale o pacote de tipos da Shopify e
faça referência a ele (a Shopify documenta o `@shopify/app-bridge-types` para isso):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Configure o Vite {#_2-configure-vite}

Trate as tags `s-*` como custom elements. É a mesma configuração de
[Primeiros passos](/pt/guide/getting-started#_3-configure-vite):

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

## 3. Crie uma página {#_3-build-a-page}

Esta página tem um formulário com `v-model`, um botão de salvar que chama o seu backend e um modal
que confirma uma redefinição. O `SModal` é aberto de forma declarativa com `commandFor`/`command`;
veja [`SModal`](/pt/components/s-modal) e a
[peculiaridade dos slots de ação do modal](/pt/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

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

## 4. Converse com o seu backend {#_4-talk-to-your-backend}

Normalmente você não precisa anexar um token por conta própria. O App Bridge intercepta o `fetch()` e, nas
requisições para o domínio e os subdomínios do seu app, adiciona um ID token no cabeçalho `Authorization`
(e o idioma da loja em `Accept-Language`). Uma chamada relativa comum funciona:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

No servidor:

- Valide o ID token em toda requisição: assinatura HS256 com o seu client secret, `exp`
  e `nbf`, `aud` igual ao seu client ID, e hostnames de `iss` e `dest` correspondentes.
  Responda `401` em caso de falha.
- Os ID tokens expiram após um minuto e são credenciais do tipo bearer: envie-os apenas para o seu
  próprio backend.
- Troque o ID token por um access token para chamar a Admin API, e mantenha esse token
  no servidor.

Chame `shopify.idToken()` você mesmo apenas quando o interceptor não cobrir a requisição,
como em uma conexão WebSocket:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Se o seu app só precisa da GraphQL Admin API, o App Bridge pode encaminhar
`fetch('shopify:admin/api/graphql.json', ...)` pelo admin quando o Direct API access
está ativado na configuração do seu app, sem nenhum backend próprio. Veja
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Use as APIs do App Bridge a partir do Vue {#_5-use-app-bridge-apis-from-vue}

Tudo fica no global `shopify`; nenhum plugin do Vue é necessário.

### Toasts {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` aceita `duration` (ms), `isError`, `action`, `onAction` e
`onDismiss`, e retorna um id que você pode passar para `shopify.toast.hide(id)`.

### Modais por id {#modals-by-id}

Além do `commandFor`, o `shopify.modal` controla um `SModal` pelo seu `id`:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### Navegação do app {#app-navigation}

`<s-app-nav>` renderiza a navegação do app na barra lateral do admin. Mantenha-o montado perto
da raiz do seu app, por exemplo no `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

O item ativo é derivado da URL atual. Para navegar via código, a
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api) da Shopify
documenta âncoras, `open('/settings', '_self')` e a History API
(`history.pushState`).

### Save bar {#save-bar}

Adicione `data-save-bar` a um `<form>` e o admin mostra uma save bar quando o formulário tem
alterações não salvas; `submit` é disparado em Save e `reset` em Discard. Não combine isso com
os métodos programáticos de `shopify.saveBar` no mesmo formulário. Veja
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Próximos passos {#next-steps}

- Navegue por [todos os componentes](/pt/components/) e leia [Peculiaridades e armadilhas](/pt/guide/quirks).
- Volte a [Primeiros passos](/pt/guide/getting-started) para `v-model`, overlays e tipagem de tags sem wrapper.
- Leia a [documentação do App Home](https://shopify.dev/docs/apps/build/app-home) da Shopify e
  as [APIs do App Bridge](https://shopify.dev/docs/api/app-home/apis).
