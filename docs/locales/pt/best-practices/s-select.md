- **Use para um conjunto conhecido de opções.** Um select funciona quando os lojistas escolhem a partir de uma lista predefinida. Quando eles precisarem inserir um valor personalizado ou procurar em uma lista longa, um campo de texto que sugira correspondências enquanto digitam, ou um dropdown com busca, é mais adequado.
- **Ordene as opções de forma deliberada.** Agrupe opções relacionadas, coloque as mais comuns primeiro ou ordene alfabeticamente quando não houver uma ordem natural, para que os lojistas encontrem a escolha rapidamente.
- **Escreva rótulos fáceis de percorrer.** Dê a cada opção contexto suficiente para que os lojistas consigam diferenciá-las sem precisar abrir a lista e ler várias delas.
- **Escolha o estado inicial de propósito.** Pré-selecione uma opção quando houver um padrão óbvio, e use um `placeholder` quando os lojistas precisarem fazer uma escolha consciente. Não deixe o estado inicial ambíguo.
- **Explique os problemas de validação.** Quando uma seleção for obrigatória ou inválida, use `error` para dizer aos lojistas especificamente o que fazer, já que mensagens personalizadas os ajudam a concluir formulários mais rápido do que mensagens genéricas.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

Veja [as boas práticas da Shopify para `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (em inglês) para todas as recomendações.
