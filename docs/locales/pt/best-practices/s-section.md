- **Agrupe o conteúdo que pertence junto.** Dê a cada seção uma única função coerente, seja reunir informações relacionadas ou controles relacionados; assim ela funciona como um contêiner visual e dá significado à estrutura da página.
- **Escreva títulos descritivos.** Os lojistas passam os olhos pelo `heading` para se orientar, então diga o que há dentro em vez de recorrer a um título genérico.
- **Aninhe só até onde o conteúdo precisar.** Uma seção aninhada afeta a hierarquia de títulos e a estrutura da página, e não a aparência dela. Limite-se a dois ou três níveis no máximo, e aninhe apenas quando a estrutura extra deixar o conteúdo mais claro.
- **Remova o padding quando o conteúdo deve ir de borda a borda.** Use `padding="none"` para coisas como tabelas ou imagens que devem preencher a seção, e depois verifique se o conteúdo interno mantém espaçamento suficiente por conta própria.
- **Adicione um `accessibilityLabel` quando o título não for suficiente.** Quando o título exibido na tela deixar o propósito da seção pouco claro para quem usa leitores de tela, dê a essas pessoas um rótulo que complete o contexto que falta.
- **Escolha o slot de cabeçalho certo.** Coloque em `accessory` os detalhes que modificam o próprio título, como um tooltip ou uma contagem. Coloque em `supplemental` as informações sobre a seção como um todo, como um badge de status. Ações como um botão ou menu pertencem a `accessory`, já que `supplemental` não as aceita.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

Veja [as boas práticas da Shopify para `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (em inglês) para todas as recomendações.
