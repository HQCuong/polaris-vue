- **Dê um título a cada página.** Defina `heading` com um título que descreva a página em que o lojista está.
- **Adicione breadcrumbs dentro de um fluxo.** Quando a página for uma etapa de um fluxo maior, coloque links de volta no slot `breadcrumb-actions`.
- **Reserve as ações do cabeçalho para a página inteira.** Coloque ações no cabeçalho apenas quando elas se aplicarem à página toda, e não a uma parte dela.
- **Limite o número de ações.** Use no máximo uma ação principal e três ações secundárias por página.
- **Deixe o final da página livre de ações.** Não coloque nenhuma ação no fim da página.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

Veja [as boas práticas da Shopify para `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (em inglês) para todas as recomendações.
