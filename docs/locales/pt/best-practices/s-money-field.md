- **Defina `min` e `max` com limites realistas.** Por exemplo, o preço de um produto pode usar um `min` de 0.01 para não ser zero, um desconto pode ir de 0 até o total do pedido e um reembolso pode ser limitado ao valor pago. Sempre confira os valores também com as suas regras de negócio.
- **Informe o limite exato em `error`.** Em vez de "Valor inválido", diga algo como "O preço deve ser de pelo menos $0.01" para que os lojistas saibam qual restrição violaram.
- **Não coloque símbolos de moeda em `label` e `placeholder`.** Adicionar "$" ou algo semelhante pode conflitar com a formatação de moeda que o campo já faz.
- **Rotule o valor pela finalidade.** "Preço base do produto" ou "Valor do desconto" diz mais aos lojistas do que "Valor" ou "Preço".
- **Preencha `value` ao editar.** Mostre o valor atual quando ele já existir; para novas entradas, considere um padrão sensato como 0.00 ou um preço típico.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

Veja [as boas práticas da Shopify para `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (em inglês) para todas as recomendações.
