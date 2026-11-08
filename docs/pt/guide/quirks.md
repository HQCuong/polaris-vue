---
title: Web components do Shopify Polaris no Vue — peculiaridades conhecidas
description: Peculiaridades verificadas no navegador dos web components do Shopify Polaris usados a partir do Vue 3 — requisitos de slots, momento dos events e comportamentos de v-model que diferem das bibliotecas de componentes Vue comuns.
---

# Peculiaridades e armadilhas {#known-quirks-gotchas}

Estes são comportamentos reais, verificados no navegador, dos web components do Polaris
subjacentes que nem sempre correspondem ao que você esperaria vindo de uma biblioteca
de componentes Vue típica. Ler isto antes de se deparar com eles vai poupar algum
tempo de depuração.

## 1. `<SBanner>` precisa de conteúdo no slot {#_1-sbanner-needs-slot-content}

Apenas o atributo `heading` não basta — `<s-banner>` é renderizado vazio a menos que
também tenha conteúdo no slot padrão.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Os slots de ação do modal só aceitam variantes específicas de botão {#_2-modal-action-slots-only-accept-specific-button-variants}

O slot `primary-action` do `SModal` só aceita um único botão com
`variant="primary"`. Internamente, o Polaris atribui o conteúdo dos slots manualmente, e
qualquer nó que não corresponda é **descartado silenciosamente** — sem aviso, sem erro, ele
simplesmente não é renderizado. `secondary-actions` aceita botões com `variant`
`secondary` ou `auto`.

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

## 3. Props do tipo número precisam de bind, não de atributos de texto {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

A documentação do próprio Polaris mostra atributos HTML simples (por exemplo, `rows="3"`),
mas isso engana no Vue: para props tipadas como `number`, o `vue-tsc` espera uma
expressão com bind, não uma string literal.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. A atribuição de slots acontece uma única vez, na conexão {#_4-slot-assignment-happens-once-at-connect-time}

Alterar o atributo `slot` de um filho depois que o pai foi montado não faz
a reatribuição. Se você precisa que um elemento mude entre slots nomeados, renderize-o
novamente (por exemplo, com `v-if`/`:key`) em vez de alterar `slot` de forma reativa.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. O runtime do Polaris é versionado no CDN — a versão desta biblioteca não é a versão do runtime {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

Desde agosto de 2026, o CDN do Polaris segue o versionamento semântico
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Escolha o canal que combina com o seu processo de release:

| URL | O que ele serve |
| --- | --- |
| `polaris-2.js` | Canal estável 2.x — o novo estilo visual do admin da Shopify; recebe atualizações compatíveis (minor) automaticamente. **Recomendado.** |
| `polaris-2.0.js` | Versão fixada — nenhuma mudança de funcionalidade, correção ou visual até você mover a versão fixada. |
| `polaris-1.js` | Canal estável 1.x anterior. |
| `polaris.js` | URL legada — atualmente serve o mesmo build que `polaris-1.js` e nunca passa sozinha para uma nova versão major. |

Uma nova versão major (como a 2.0) é sempre opcional: é você quem troca a URL do script. O Polaris
2.0 é uma atualização visual: seu Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) declara as mesmas tags, props, events e slots
da 1.1, com algumas adições (a prop `loading` do `SThumbnail`, mais ícones do `STextField`),
então estes wrappers também funcionam com `polaris-1.js`.

Seja qual for o canal que você carrega, o runtime é atualizado de forma independente da versão
do `polaris-vue-elements` que você tem instalada. A versão desta biblioteca só
reflete o quão atualizados estão os seus **tipos e wrappers** gerados:

- Um wrapper desatualizado nunca quebra componentes que já existem — ele só pode
  não ter props/events tipados para recursos que a Shopify adicionou depois que o wrapper
  foi gerado pela última vez.
- Props desconhecidas continuam funcionando: elas passam sem tipo via `$attrs` para o
  elemento subjacente.
- Componentes desconhecidos/novos continuam funcionando: use a tag do custom element diretamente
  (por exemplo, `<s-new-component>`) até que um wrapper tipado seja gerado para ele.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
