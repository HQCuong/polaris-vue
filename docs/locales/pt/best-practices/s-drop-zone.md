- **Declare os limites de arquivo com `accept`.** Defina restrições claras para os tipos de arquivo que a drop zone aceita.
- **Trate `droprejected` com uma mensagem útil.** Quando um arquivo falhar na validação, escute o event e diga aos lojistas o que deu errado.
- **Considere `disabled` durante o processamento.** Desativar a drop zone durante um upload impede que os lojistas adicionem mais arquivos enquanto isso.

```vue
<SDropZone label="Product images" accept="image/*" />
```

Veja [as boas práticas da Shopify para `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (em inglês) para todas as recomendações.
