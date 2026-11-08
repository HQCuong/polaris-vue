- **Deixe o espaçamento refletir as relações.** Um `gap` pequeno indica que os itens pertencem juntos, enquanto um maior separa grupos distintos. Escolha o espaçamento que corresponda à hierarquia do seu conteúdo.
- **Conte com a quebra de linha em stacks inline.** Com `direction="inline"`, os itens passam para uma nova linha quando falta espaço. Normalmente é isso que você quer, mas se precisar de controle exato sobre as quebras de linha ou várias linhas, recorra a outra abordagem de layout.
- **Defina o alinhamento de propósito.** O alinhamento padrão atende à maioria dos layouts. Ajuste `alignItems` ou `justifyContent` quando os itens tiverem tamanhos diferentes ou precisarem de um posicionamento específico.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

Veja [as boas práticas da Shopify para `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (em inglês) para todas as recomendações.
