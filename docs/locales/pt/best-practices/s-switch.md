- **Não combine switches com um botão de salvar.** Um switch entra em vigor no momento em que é alternado, então adicionar um botão de salvar deixa os lojistas sem saber quando a alteração realmente é aplicada.
- **Deixe a configuração óbvia.** Escreva um `label` que diga aos lojistas o que o switch controla e o que significam ligado e desligado, para que eles não precisem alterná-lo só para descobrir.
- **Descreva as consequências.** Use `details` para explicar o que muda quando o switch é alternado, principalmente em configurações que afetam recursos ou dados importantes, para que os lojistas possam decidir com confiança.
- **Agrupe e ordene switches relacionados.** Quando uma página tiver vários switches, mantenha as configurações relacionadas juntas e em uma ordem lógica para que os lojistas consigam encontrá-las e configurá-las facilmente.
- **Explique por que um switch está indisponível.** Quando um switch estiver `disabled` por causa de permissões, dependências ou limites do plano, diga aos lojistas o motivo, se é temporário e o que eles precisam fazer para desbloqueá-lo.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

Veja [as boas práticas da Shopify para `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (em inglês) para todas as recomendações.
