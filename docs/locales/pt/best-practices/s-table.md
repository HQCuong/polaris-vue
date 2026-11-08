- **Use tabelas para dados que os lojistas comparam.** Tabelas são adequadas para muitos registros que compartilham os mesmos atributos e precisam ser analisados lado a lado. Para uma lista simples sem nada para comparar, escolha um componente mais simples.
- **Planeje para o layout de lista no mobile.** No mobile, a tabela vira uma lista, então verifique se os cabeçalhos e os valores continuam legíveis como pares de rótulo e valor empilhados, em vez de uma grade.
- **Mantenha poucas colunas.** Muitas colunas tornam a tabela difícil de percorrer e forçam a rolagem horizontal. Mostre apenas as colunas de que os lojistas precisam para a tarefa e considere revelar o restante sob demanda.
- **Escreva cabeçalhos de coluna claros.** Mantenha cada `STableHeader` curto e descritivo para que os lojistas saibam exatamente quais dados a coluna contém.
- **Planeje para grandes conjuntos de dados.** Tabelas grandes prejudicam o desempenho e a usabilidade. Ative `paginate` quando houver mais de cerca de 50 a 100 linhas, ou pense em adicionar filtros ou busca para que os lojistas cheguem aos registros certos mais rápido.

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

Veja [as boas práticas da Shopify para `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (em inglês) para todas as recomendações.
