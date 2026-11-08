- **Dimensione de acordo com a resposta esperada.** O número de `rows` visíveis indica quanto escrever: uma área curta convida a uma resposta breve, enquanto uma mais alta pede mais detalhes.
- **Defina limites de tamanho que reflitam necessidades reais.** Escolha `minLength` e `maxLength` com base no que o conteúdo realmente exige e informe esses limites aos lojistas logo de início.
- **Use o placeholder como exemplo.** Escreva um texto de `placeholder` que mostre o tipo de conteúdo, o formato e o tom que você espera, em vez de repetir para que serve o campo.
- **Mostre quanto espaço resta.** Quando você impuser um tamanho máximo, deixe os lojistas verem quantos caracteres restam para que consigam ajustar o conteúdo sem ultrapassar o limite.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

Veja [as boas práticas da Shopify para `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (em inglês) para todas as recomendações.
