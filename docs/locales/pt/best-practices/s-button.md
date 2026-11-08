- **Use um verbo claro no rótulo.** Diga exatamente o que o botão faz, como em "Salvar", "Editar" ou "Adicionar tags". Use apenas a primeira letra maiúscula, dispense palavras de preenchimento como artigos e não use pontuação.
- **Reserve `tone="critical"` para ações destrutivas.** Use-o apenas quando uma ação for difícil ou impossível de desfazer e, em geral, ajuste o tom à importância da ação.
- **Deixe a hierarquia evidente.** Dê à ação principal `variant="primary"`, às ações de apoio `variant="secondary"` e às complementares `variant="tertiary"`, para que os lojistas percebam qual ação importa mais.
- **Posicione os botões de forma consistente.** Coloque os botões nos mesmos lugares em todo o seu app para que os lojistas aprendam onde procurá-los.
- **Rotule botões só com ícone.** Se um botão tem um ícone e nenhum texto, dê a ele um `accessibilityLabel` que diga aos usuários de leitores de tela o que ele faz.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

Veja [as boas práticas da Shopify para `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (em inglês) para todas as recomendações.
