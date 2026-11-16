---
title: "useAppBridge() – Shopify App Bridge para Vue 3"
description: "useAppBridge() para Vue 3 retorna o global shopify do Shopify App Bridge, tipado como ShopifyGlobal, como no @shopify/app-bridge-react. Para apps incorporados da Shopify."
---

# useAppBridge() {#use-app-bridge}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

O global `shopify` é definido pelo script do App Bridge. A [referência do useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) da Shopify o descreve como a forma de usar as APIs do App Bridge, como `toast` e `resourcePicker`.

`useAppBridge()` retorna o global `shopify`, tipado como `ShopifyGlobal`:

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

Como no `@shopify/app-bridge-react`:

- No servidor, ele retorna um objeto que lança um erro quando você lê qualquer propriedade.
  Chame as APIs a partir de `onMounted()` ou de um manipulador de evento.
- No navegador, ele lança um erro se `shopify` não estiver definido, o que "likely means the App
  Bridge script tag was not added correctly to this page".

Usar diretamente o global `shopify`, como faz o guia de apps incorporados, também funciona.

## API {#reference}

Os membros de nível superior de `ShopifyGlobal` em `@shopify/app-bridge-types`. As descrições vêm do JSDoc dos tipos; quando um membro não tem, do resumo na página do shopify.dev vinculada.

| Membro | Tipo | Descrição |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | A configuração do app: `apiKey` (o client ID do app, informado com uma tag `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` e `shop`. |
| `origin` | `string` | Não descrito nos tipos. |
| `ready` | `Promise<void>` | Não descrito nos tipos. |
| `setSignals` | `(RealSignal: any) => void` | Registra uma implementação de signals, por exemplo de `@preact/signals`, para que os valores reativos retornados pelo App Bridge usem a classe Signal do próprio app em vez do shim embutido. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` e `intent`: se o app roda no app Shopify Mobile, está incorporado no admin da Shopify, roda no Shopify POS ou roda como intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Exibe indicadores de carregamento durante operações demoradas. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Gera tokens de ID para autenticação servidor a servidor e requisições de API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Informações sobre o lojista conectado, incluindo nome, e-mail e locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` exibe uma notificação toast no admin da Shopify e retorna o ID dela; `hide(id)` a oculta. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permite que lojistas pesquisem e selecionem recursos da Shopify, como produtos, coleções ou variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` abre a câmera do dispositivo para escanear um código de barras e é resolvido com um `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` e `toggle(id)` exibem, ocultam ou alternam um modal pelo ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` e `toggle(id)` exibem, ocultam ou alternam uma barra de salvamento pelo ID; `leaveConfirmation()` pede ao lojista que confirme antes de sair da página quando há alterações não salvas. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` e `location`: ler e alterar o carrinho atual do POS, fechar o app e voltar para a tela do POS, e obter informações sobre o dispositivo e o local do POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (a solicitação de intent atual, `null` fora de um fluxo de intent), `invoke()` para invocar um intent, `response` para resolver um, e `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registra um callback que recebe dados de desempenho do Web Vitals; `null` cancela o registro. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registra uma função que roda quando o lojista clica no botão de suporte; `null` cancela o registro. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` solicita um modal de avaliação do app, que só aparece se os limites de frequência e as condições de elegibilidade forem atendidos. O resultado tem `success`, `code` e `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` retorna os escopos de acesso concedidos, obrigatórios e opcionais do app na loja; `request(scopes)` pede ao lojista que conceda escopos opcionais; `revoke(scopes)` revoga escopos opcionais concedidos. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Exibe interfaces de seleção para arquivos, datas e outros tipos de dados comuns. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` é resolvido com as extensões do app e suas informações de status. |
| `shopifyQL` | `ShopifyQLApi` | `available()` e `ready()`. Fora isso, não descrito nos tipos. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Inicia conversas do Sidekick para o lojista a partir do seu app. Está sempre definido, mas seus métodos são rejeitados quando o Sidekick não está disponível para o app; `isEnabled()` verifica isso. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` e `clear` vinculam funções de tratamento a ferramentas já declaradas na configuração da extensão do app, que a plataforma pode chamar em nome do app. |
