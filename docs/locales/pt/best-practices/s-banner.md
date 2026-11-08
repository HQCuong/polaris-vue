- **Trate de um único assunto por banner.** Cada banner deve trazer uma única mensagem ou uma única ação necessária, para que os lojistas não fiquem se perguntando do que se trata.
- **Escreva para uma leitura rápida.** Mantenha o texto curto o bastante para que os lojistas entendam a mensagem e o que fazer em seguida num piscar de olhos.
- **Dê aos lojistas um próximo passo.** Banners com `tone="info"`, `tone="warning"` ou `tone="critical"` devem incluir uma chamada para ação que diga exatamente como prosseguir.
- **Deixe os lojistas fecharem os banners.** Defina `dismissible`, a menos que a mensagem exija ação imediata, e evite banners que ficam na tela sem nenhuma forma de fechá-los.
- **Posicione os banners conforme o escopo.** Coloque um banner fora de qualquer seção para uma mensagem sobre a página inteira, ou dentro de uma seção quando ele se referir ao conteúdo dessa seção.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Veja [as boas práticas da Shopify para `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (em inglês) para todas as recomendações.
