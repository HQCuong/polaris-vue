---
title: Variáveis CSS e design tokens do Shopify Polaris (web components)
description: Todos os design tokens do Polaris que o runtime dos web components da Shopify define, com pré-visualizações ao vivo, busca e cópia. Importe-os como tokens.css para o CSS do seu próprio app.
schema: TechArticle
---

# Variáveis CSS do Polaris (design tokens) {#css-variables}

Os web components do Polaris aplicam os próprios estilos, mas o seu app geralmente tem algum
CSS próprio: um grid de página, um card personalizado, a legenda de um gráfico, um espaço entre
dois componentes. As variáveis CSS do Polaris permitem que esse CSS use as mesmas cores,
espaçamentos, raios e fontes dos componentes ao redor, para que ele combine com o design do
admin em vez de valores fixos escolhidos a olho.

O `polaris-vue-elements` as disponibiliza em uma única folha de estilos, `tokens.css`, extraída
do runtime do Polaris que o seu app carrega.

::: warning Não oficial
A Shopify não publica uma lista de variáveis CSS para os web components do Polaris. Esses nomes
e valores são extraídos do runtime da Shopify (`polaris-2.js`), então os valores acompanham o
CDN, e um nome pode mudar ou desaparecer se a Shopify o renomear. A lista é verificada
diariamente (veja [Como ela se mantém atualizada](#how-it-stays-up-to-date)).
:::

## Quando usá-las {#when-to-use}

- **Use** para elementos que pertencem ao seu app: wrappers, contêineres de layout, widgets
  personalizados, texto que você renderiza fora dos componentes do Polaris.
- **Não** tente reestilizar os componentes do Polaris com elas. Cada componente é renderizado
  dentro do próprio shadow root, então definir `--p-color-bg-fill-brand` na sua página não vai
  mudar a cor do `<SButton>`. Use as props do componente (`tone`, `variant`, `padding`, …) em
  vez disso.
- **Prefira primeiro os componentes de layout.** `<SStack>`, `<SGrid>` e `<SBox>` já aceitam
  valores de espaçamento, padding e borda do Polaris como props. Recorra às variáveis CSS quando
  eles não cobrirem o que você precisa.

## Instalação {#install}

Importe a folha de estilos uma única vez, por exemplo em `main.ts`. Você precisa dela mesmo que seu app rode dentro do admin da Shopify ([por quê](#need-tokens-in-admin)):

```ts
import 'polaris-vue-elements/tokens.css'
```

Depois use as variáveis em qualquer CSS:

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

Os nomes e valores brutos também estão disponíveis como JSON, para ferramentas ou CSS-in-JS:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Themes {#themes}

O runtime tem dois visuais. Uma loja no design anterior do admin recebe os valores base (o
bloco `:root` em `tokens.css`). Uma loja no novo design do admin, e qualquer página fora do
admin da Shopify, recebe o theme `admin-next`: quando o primeiro componente do Polaris é
renderizado, o runtime adiciona a classe `p-partial-theme-admin-next` ao `<html>`, e o
`tokens.css` sobrescreve, sob essa mesma classe, os valores que diferem. O seu CSS acompanha o
theme escolhido pelo runtime sem nenhum trabalho extra. Em [Todas as variáveis](/pt/css-variables/reference), alterne entre **Base** e **admin-next** para ver
cada conjunto de valores; um ponto preenchido pela metade marca as variáveis cujo valor difere
entre os dois.

Valores que o runtime só aplica sob condições extras (cores P3 de gama ampla, tamanhos de texto
no mobile, modo de alto contraste, suporte a `corner-shape`) não estão incluídos; o `tokens.css`
tem o valor padrão de cada um.

## Como ela se mantém atualizada {#how-it-stays-up-to-date}

Um job agendado lê o `polaris-2.js` do CDN da Shopify todos os dias, extrai as variáveis e abre
um pull request quando algo foi adicionado, removido ou alterado. Cada versão do
`polaris-vue-elements` inclui a lista como ela estava naquela versão.

- [Todas as variáveis](/pt/css-variables/reference)
- [Migrando do `@shopify/polaris-tokens`](/pt/css-variables/migration)

## Perguntas frequentes {#faq}

### Os web components do Polaris têm variáveis CSS?

Sim. O runtime do Polaris (`polaris-2.js`) define cerca de 700 custom properties `--p-*` no
`:root` e as usa dentro dos seus componentes. A Shopify não as documenta, e os nomes do runtime
carregam um hash de build. O `tokens.css` oferece os mesmos valores com nomes estáveis.

### Meu app roda dentro do admin da Shopify. Ainda preciso do `tokens.css`? {#need-tokens-in-admin}

Sim. O runtime define as variáveis somente com nomes com hash, como
`--p-color-bg-surface-6e076`, e nunca como `--p-color-bg-surface`, então, sem o `tokens.css`,
`var(--p-color-bg-surface)` não é resolvida para nada. O hash muda a cada build da Shopify,
então você também não pode usar os nomes com hash. O CSS próprio do admin não chega ao seu
app, porque um app incorporado roda em um iframe.

### Posso reestilizar um componente do Polaris com essas variáveis?

Não. Cada componente é renderizado dentro do próprio shadow root e lê as variáveis com hash do
próprio runtime, então definir `--p-color-bg-fill-brand` na sua página não altera o
`<SButton>`. Use as props do componente, como `tone` e `variant`. As variáveis são para os seus
próprios elementos ao redor dos componentes.

### Por que os nomes das variáveis no DevTools terminam com um hash como `-6e076`?

O runtime adiciona um sufixo específico do build a cada nome (`--p-color-bg-surface-6e076`), e o
sufixo muda de um build para outro. Não copie esses nomes para o seu CSS: o `tokens.css` remove
o sufixo, então `var(--p-color-bg-surface)` continua funcionando depois que a Shopify lança um
novo build.

### Qual é a diferença em relação ao `@shopify/polaris-tokens`?

O `@shopify/polaris-tokens` é o pacote de tokens do Polaris React. Esta lista vem do próprio
runtime dos web components, então tem os tokens que os componentes realmente usam, incluindo os
valores do novo design do admin (`admin-next`). A maioria dos nomes é compartilhada; veja
[Migrando do `@shopify/polaris-tokens`](/pt/css-variables/migration#migrating-from-polaris-tokens) para as diferenças.

### As variáveis têm suporte a modo escuro?

Não como theme de página. O runtime tem um conjunto escuro de valores (`admin-next-dark`), mas
só o aplica a partes dentro de alguns componentes, nunca à página, então o `tokens.css` não tem
um theme escuro. Os valores estão no `tokens.json` em `themes["admin-next-dark"]` se você
quiser montar um.
