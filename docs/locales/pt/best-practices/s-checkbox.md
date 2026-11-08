- **Mantenha cada checkbox independente.** Os lojistas devem poder marcar qualquer combinação de opções sem que um checkbox afete o outro.
- **Dê a cada checkbox um `label` descritivo.** Isso importa sobretudo quando um checkbox ativa ou desativa uma configuração, para que os lojistas saibam exatamente o que estão ativando.
- **Ordene as opções de forma lógica.** Organize-as em ordem alfabética, numérica ou cronológica para que os lojistas encontrem rapidamente a que procuram.
- **Reserve `indeterminate` para um "selecionar tudo" parcial.** Use-o em um checkbox de "selecionar tudo" quando apenas alguns dos itens do grupo estiverem marcados.
- **Adicione `details` quando o contexto ajudar.** Use-o para explicar melhor o que uma opção faz, apenas quando o rótulo sozinho não for suficiente.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

Veja [as boas práticas da Shopify para `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (em inglês) para todas as recomendações.
