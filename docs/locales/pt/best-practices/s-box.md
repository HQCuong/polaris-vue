- **Use-o como um contêiner genérico.** `SBox` cuida de espaçamento, bordas e fundos para agrupar conteúdo. Quando você precisar de uma disposição específica, como linhas ou colunas, use `SStack` ou `SGrid`.
- **Verifique primeiro se há um componente mais significativo.** Se algo como `SSection` ou `SBanner` já descreve o que o conteúdo é, prefira-o. Componentes feitos para um propósito transmitem uma intenção mais clara e oferecem melhor acessibilidade.
- **Pense nas telas menores.** Um layout que fica bem no desktop pode quebrar no celular, então ajuste o espaçamento e o layout com valores responsivos em vez de fixar tamanhos.
- **Descreva regiões e conteúdo interativo.** Quando uma box marca uma região distinta ou contém conteúdo interativo, defina `accessibilityRole` e `accessibilityLabel` para que os usuários de leitores de tela possam entender e navegar pela estrutura.
- **Evite aninhamento profundo.** Empilhar boxes dentro de boxes deixa o markup complexo e a estilização difícil de manter. Procure uma estrutura mais simples ou um componente de layout mais adequado.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

Veja [as boas práticas da Shopify para `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (em inglês) para todas as recomendações.
