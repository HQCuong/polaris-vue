---
title: Primeiros passos com Shopify Polaris no Vue 3
description: Instale o polaris-vue-elements, carregue o runtime dos web components do Shopify Polaris e use wrappers tipados do Vue 3 como SButton e STextField com v-model em um app Vue ou em um app da Shopify.
---

# Primeiros passos {#getting-started}

`polaris-vue-elements` é um conjunto de componentes tipados do Vue 3 que funcionam como wrappers dos
web components do Polaris da Shopify (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). Os próprios
web components são carregados em tempo de execução a partir do CDN da Shopify — esta biblioteca só oferece
uma interface Vue tipada e idiomática (props, events, v-model) em torno deles.

## 1. Instalação {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Carregue o runtime do Polaris {#_2-load-the-polaris-runtime}

Os componentes wrapper são apenas de apresentação — eles não incluem as definições
reais dos custom elements. O seu app host precisa carregar o script de runtime do
Polaris da Shopify, que registra os elementos `<s-*>` globalmente:

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

Isso funciona em qualquer app Vue, não só dentro do Shopify Admin — os componentes são
custom elements comuns e são renderizados onde quer que o script esteja carregado.

`polaris-2.js` é o canal estável da Shopify e é o que recomendamos para produção.
Para fixar uma versão exata, ou para entender como a versão do runtime se relaciona
com a versão desta biblioteca, consulte
[Peculiaridades e armadilhas](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 e o novo design do admin {#polaris-2-0-and-the-new-admin-design}

O Polaris 2.0 traz o novo design visual do admin da Shopify (cores, tipografia,
espaçamento e ícones). Ele se tornou estável em 22 de outubro de 2026
([anúncio](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
A migração a partir da 1.x é opcional: troque `polaris-1.js` por `polaris-2.js`.

- **Nenhuma mudança de código necessária.** A 2.0 é uma atualização visual: seus componentes, props,
  events e slots são os mesmos da 1.1, com algumas adições (como a prop `loading`
  do `SThumbnail`). Apps que continuam no `polaris-1.js` seguem funcionando
  com estes wrappers; só as adições exigem a 2.x em tempo de execução.
- **Ele acompanha o design de cada loja.** Dentro do admin da Shopify, uma loja que tem
  o novo design do admin recebe o novo visual, e uma loja no design anterior mantém
  o visual da 1.x. Fora do admin, o novo visual é usado por padrão, o que facilita
  a visualização local.
- **Conteúdo fixo ou sticky perto da parte inferior da viewport** deve reservar espaço
  com a variável CSS `--shopify-safe-area-inset-bottom`
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  para que a barra flutuante do Sidekick não o cubra.
- **Apps Built for Shopify** precisam seguir o novo estilo visual do admin até
  **1º de maio de 2027**.

## 3. Configure o Vite {#_3-configure-vite}

Diga ao compilador do Vue para tratar qualquer tag `s-*` como custom element em vez de
tentar resolvê-la como um componente Vue:

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

## 4. Seu primeiro componente {#_4-your-first-component}

Importe componentes de `polaris-vue-elements` e use-os como qualquer outro componente
Vue — props e events são totalmente tipados:

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

## 5. v-model em componentes de formulário {#_5-v-model-on-form-components}

Componentes do tipo formulário suportam `v-model`, mapeado para o par prop/event
subjacente correto daquele elemento (veja `src/lib/overrides.ts` para o mapeamento
completo — campos de texto usam `value`/`input`, `SCheckbox`/`SSwitch` usam
`checked`/`change`, `SChoiceList` usa `values`/`change`, e assim por diante):

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

## 6. Controlando overlays (modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Componentes de overlay como `SModal` podem ser controlados de duas formas:

**De forma declarativa**, com os atributos HTML padrão `commandFor`/`command` em
um botão de disparo — sem nenhum script:

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

**De forma imperativa**, obtendo um template ref tipado e chamando o método do
elemento subjacente por meio de `$el`:

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

## 7. Tipando tags `<s-*>` sem wrapper (opcional) {#_7-typing-raw-s-tags-optional}

Se você prefere continuar escrevendo as tags do próprio Polaris (`<s-button>`, `<s-text-field>`, …)
em vez de migrar para os wrappers, o pacote também consegue tipá-las. Ative isso uma vez, no seu
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

ou com uma referência em um arquivo `.d.ts`, como `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Isso adiciona todas as tags do Polaris ao `GlobalComponents` do Vue, então o Volar e o `vue-tsc` verificam
as tags sem wrapper da mesma forma que verificam os wrappers: props com tipos union, listeners `@click` /
`@aftershow` tipados e um elemento tipado para os métodos imperativos.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

São apenas tipos: nada é registrado em tempo de execução, então mantenha a configuração
`isCustomElement` do passo 3. Duas diferenças em relação aos wrappers:

- **Sem `v-model` nas tags sem wrapper.** Faça o bind de `:value` e escute `@input` / `@change`
  você mesmo, ou use o componente wrapper, que mapeia a propriedade e o event de cada
  campo de formulário para você.
- **Não combine isso com um shim escrito à mão** para as mesmas tags no seu projeto —
  duas declarações de `GlobalComponents['s-button']` com tipos diferentes entram em conflito.
  Remova o shim ao ativar essa opção.

## Próximos passos {#next-steps}

Navegue pela [referência de componentes](/pt/components/) para ver a lista completa de props/events
de cada wrapper, ou leia [Peculiaridades e armadilhas](/pt/guide/quirks) antes de
esbarrar nelas você mesmo.

Está criando um app da Shopify? Veja [Crie um app incorporado da Shopify com Vue 3](/pt/guide/shopify-embedded-app)
para carregar o App Bridge, fazer requisições autenticadas e usar as APIs do App Bridge a partir do Vue.
