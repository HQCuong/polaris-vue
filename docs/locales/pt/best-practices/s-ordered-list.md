- **Use quando a sequência tiver significado.** Listas numeradas transmitem ordem, prioridade ou classificação, então são adequadas para instruções passo a passo ou recomendações classificadas. Se a ordem for irrelevante, use `SUnorderedList` no lugar.
- **Escreva os itens da mesma forma.** Dê a todos os itens a mesma gramática e estrutura para que a lista seja fácil de ler. Mudar de estilo de um item para outro exige mais esforço de quem lê.
- **Mantenha cada item curto.** Listas funcionam porque são rápidas de percorrer. Se os itens ficarem longos ou complexos, considere separá-los em seções próprias.
- **Não aninhe demais.** Um nível de aninhamento pode organizar pontos relacionados, mas passar de dois níveis torna a lista difícil de acompanhar e sugere que o conteúdo precisa de outra estrutura.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

Veja [as boas práticas da Shopify para `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (em inglês) para todas as recomendações.
