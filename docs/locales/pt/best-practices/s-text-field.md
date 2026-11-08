- **Deixe óbvia a entrada esperada.** Escreva um `label` e um `placeholder` que digam aos lojistas o que digitar e em qual formato. Textos vagos levam a suposições, erros de validação e frustração.
- **Adicione contexto com um prefixo ou sufixo.** Use `prefix` e `suffix` para mostrar o tipo de valor e o formato dele, por exemplo se os lojistas devem digitar uma URL inteira ou apenas um subdomínio, ou um preço completo ou só o valor.
- **Baseie as restrições em requisitos reais.** Defina `minLength`, `maxLength` e as regras de validação de acordo com as necessidades reais do negócio, e não com números arbitrários, e informe aos lojistas quais são.
- **Dê feedback cedo e de forma específica.** Informe aos lojistas se a entrada é válida enquanto eles digitam, e não apenas ao enviar. Quando não for, use `error` para explicar o que está errado e como corrigir.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

Veja [as boas práticas da Shopify para `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (em inglês) para todas as recomendações.
