- **Mantenha ações relacionadas juntas.** Agrupe as chamadas para ação que pertencem à mesma tarefa para que os lojistas vejam suas opções e como elas se relacionam.
- **Mantenha uma hierarquia visual.** Use `variant="primary"` no botão da ação principal e `variant="secondary"` ou `variant="tertiary"` nos de apoio para direcionar a atenção.
- **Não adicione botões demais.** Uma fileira longa de opções sobrecarrega os lojistas e dificulta a decisão.
- **Use um grupo segmentado para alternâncias.** Para opções muito relacionadas, como alternar visualizações ou filtros, defina `gap="none"` para unir os botões em um único controle segmentado.
- **Separe as ações destrutivas.** Posicione-as de forma deliberada e dê a elas `tone="critical"` para que seja mais difícil acioná-las por acidente.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

Veja [as boas práticas da Shopify para `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (em inglês) para todas as recomendações.
