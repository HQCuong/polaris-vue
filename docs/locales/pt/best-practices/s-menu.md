- **Use menus para ações secundárias.** Mantenha ações principais como "Salvar" visíveis na própria página. Menus são adequados para ações que os lojistas usam com menos frequência ou para as destrutivas, como "Arquivar" ou "Exportar dados", que não precisam de espaço permanente.
- **Escreva os rótulos como verbo mais substantivo.** Rótulos como "Editar detalhes" ou "Exportar como CSV" dizem exatamente o que acontece; evite rótulos vagos como "Opções", "Mais" ou "Configurações".
- **Divida menus longos em seções.** Quando um menu tiver quatro ou mais itens, agrupe as ações relacionadas em um `SSection` com um `heading`, por exemplo "Gerenciar" para ações do dia a dia e "Zona de perigo" para as destrutivas.
- **Adicione ícones que reforcem o rótulo.** Ícones como `edit` para editar, `delete` para excluir ou `download` para exportar ajudam os lojistas a reconhecer uma ação, mas devem reforçar o texto, nunca substituí-lo.
- **Desative apenas o que está indisponível no momento.** Defina `disabled` em um item quando a ação não se aplicar ao contexto atual, como reembolsar um pedido que já foi reembolsado. Se uma ação nunca se aplica, deixe-a fora do menu.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Veja [as boas práticas da Shopify para `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (em inglês) para todas as recomendações.
