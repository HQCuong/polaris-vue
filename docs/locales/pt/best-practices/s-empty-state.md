- **Explique a causa e depois a solução.** Um título seco como "Nenhum produto" deixa os lojistas tentando adivinhar. Use o `heading` para dizer por que não há nada ali e deixe a ação indicar o próximo passo.
- **Comece com uma única ação principal.** Use o slot `primary-action` para o passo que tira os lojistas do estado vazio e coloque as outras opções em `secondary-actions`.
- **Redija os resultados filtrados de outro jeito.** Um recurso sem nada e um filtro que não encontrou nada são situações diferentes. Para resultados filtrados, diga aos lojistas como ajustar o filtro.
- **Trate o gráfico como um extra.** O título e a ação fazem o trabalho, então deixe o slot `graphic` vazio em layouts densos e, quando usá-lo, limite-o a um ícone ou imagem.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Veja [as boas práticas da Shopify para `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (em inglês) para todas as recomendações.
