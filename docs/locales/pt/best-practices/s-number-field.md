- **Use apenas para valores puramente numéricos.** Recorra a ele para coisas como quantidades, medidas ou porcentagens. Se um valor puder incluir letras ou símbolos, como um código de produto ou um número de telefone, use `STextField` no lugar.
- **Mostre a unidade.** Use `prefix` ou `suffix` para indicar o que o número mede, para que os lojistas não fiquem tentando adivinhar se estão digitando dólares, quilos ou uma porcentagem.
- **Defina limites que correspondam às suas regras de negócio.** Atribua a `min` e `max` valores que reflitam o que é realmente permitido, o que orienta os lojistas a fazer entradas válidas antes de enviar o formulário.
- **Valide e explique os erros.** Verifique cada entrada numérica e, quando uma falhar, use `error` para dizer exatamente o que está errado e como corrigir, em vez de mostrar uma mensagem genérica.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

Veja [as boas práticas da Shopify para `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) (em inglês) para todas as recomendações.
