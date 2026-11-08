- **Use para trabalhos que você consegue medir.** Recorra a uma barra de progresso quando puder expressar o trabalho como parte de um todo. Quando não for possível saber quanto tempo algo vai levar ou quanto já avançou, um spinner é a opção mais leve.
- **Diga o que está progredindo.** Dê a `accessibilityLabel` uma descrição precisa, por exemplo "Importando produtos" ou "Armazenamento usado". Os leitores de tela anunciam a barra com esse rótulo, e não há valor padrão se você omiti-lo.
- **Adicione texto quando os números importarem.** A barra não mostra rótulo nem porcentagem por si só, então coloque um texto ao lado dela quando os lojistas precisarem dos números, e mantenha esse texto sincronizado com `value`.
- **Defina `max` como o total real.** Use a contagem ou o limite verdadeiro, como a quantidade de arquivos ou o tamanho de uma cota, em vez de converter tudo em porcentagem. Isso torna `value` simples de atualizar à medida que o trabalho avança.
- **Use tone apenas para sinalizar problemas.** Reserve `tone="critical"` e `tone="warning"` para progressos que indiquem um problema, como um limite que já foi atingido. Deixe o trabalho em andamento comum no tom padrão.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

Veja [as boas práticas da Shopify para `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (em inglês) para todas as recomendações.
