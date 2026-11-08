- **Adapte-se ao contêiner, não à viewport.** Um query container permite que os componentes respondam à largura do seu contêiner. Isso ajuda componentes que aparecem em lugares com larguras diferentes, como um card de produto na barra lateral ou na coluna principal.
- **Nomeie os contêineres quando houver mais de um.** Se vários query containers precisarem de queries diferentes, dê a cada um um `containerName` descritivo para poder direcioná-lo; contêineres sem nome respondem todos às mesmas queries.
- **Coloque os valores responsivos nas props.** O contêiner fornece o contexto que os componentes do Polaris usam para resolver valores responsivos de props, como `padding="@container (inline-size > 500px) large-500, none"`, então você não precisa escrever CSS de container query.
- **Use apenas onde for necessário.** Cada query container faz o navegador acompanhar o tamanho dele e aplicar estilos condicionais, então adicione um onde você precisar de responsividade baseada no contêiner, em vez de envolver todos os elementos.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

Veja [as boas práticas da Shopify para `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (em inglês) para todas as recomendações.
