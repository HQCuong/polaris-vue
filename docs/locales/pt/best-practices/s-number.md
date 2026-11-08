- **Envolva apenas o número.** Coloque o próprio valor numérico em `SNumber` e deixe as palavras ao redor em `SText` ou `SParagraph`. Os dígitos tabulares alinham os números de forma organizada, mas deixam palavras comuns com aparência irregular.
- **Formate os valores primeiro no seu app.** `SNumber` controla a aparência dos dígitos, não a formatação do valor, então adicione você mesmo os símbolos de moeda, as casas decimais e os separadores de milhar de acordo com a localidade do lojista.
- **Use tone apenas quando o número tiver um status.** Defina `tone` quando o próprio número sinalizar algo, como um estoque esgotado. Aplicar tom a todos os números faz com que nenhum deles se destaque.
- **Dimensione os números por importância.** Dê um `fontSize` maior ao número que os lojistas devem ler primeiro, como um total, e deixe os números secundários no tamanho padrão.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

Veja [as boas práticas da Shopify para `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (em inglês) para todas as recomendações.
