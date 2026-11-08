- **Ajuste o modo de seleção às opções.** Mantenha a seleção única para opções mutuamente exclusivas, como formas de pagamento ou velocidades de envio, e defina `multiple` quando os lojistas puderem escolher mais de uma.
- **Faça os rótulos das opções descreverem o resultado.** "Notificações por e-mail para novos pedidos" diz mais do que "E-mail". Mantenha os rótulos curtos, mas claros o bastante para se sustentarem sozinhos.
- **Formule o `label` como uma pergunta ou uma afirmação.** Um título como "Qual forma de envio?" ou "Selecione as preferências de notificação" diz mais aos lojistas do que uma palavra vaga como "Opções" ou "Configurações".
- **Explique escolhas complexas no slot `details`.** Adicione detalhes a um `SChoice` específico quando os lojistas precisarem entender o que implica escolhê-lo.
- **Torne as mensagens de `error` específicas.** Diga aos lojistas exatamente o que está faltando, por exemplo "Selecione pelo menos uma preferência de notificação", em vez de um genérico "Campo obrigatório".

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

Veja [as boas práticas da Shopify para `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (em inglês) para todas as recomendações.
