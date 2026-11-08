- **Reserve os modais para decisões que exigem foco.** Abra um quando os lojistas precisarem fazer uma escolha específica ou tomar ciência de algo crítico. Se a tarefa ou a ferramenta puder ficar diretamente na página, mantenha-a lá.
- **Use-os com moderação.** Todo modal interrompe o lojista, então trate-o como último recurso para momentos importantes, e não como um padrão.
- **Destaque a ação principal.** Dê ao modal uma única chamada para ação clara e em evidência no slot `primary-action`.
- **Rotule as ações com verbos específicos.** Botões como "Excluir", "Salvar" ou "Continuar" dizem aos lojistas o que vai acontecer; evite rótulos genéricos como "Sim", "OK" ou "Enviar".
- **Deixe claras as consequências das ações destrutivas.** Quando a ação exclui ou descarta algo, descreva no corpo do modal o que os lojistas vão perder.
- **Não aninhe modais.** Evite abrir um segundo modal de dentro de um que já está aberto.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

Veja [as boas práticas da Shopify para `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (em inglês) para todas as recomendações.
