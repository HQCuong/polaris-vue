- **Mostre para trabalhos assíncronos mais lentos.** Use um spinner quando algo como salvar um formulário, buscar dados ou processar uma ação levar mais de cerca de 500ms. Para ações que terminam instantaneamente, um spinner só pisca e distrai.
- **Mantenha-o junto ao que está carregando.** Coloque o spinner na parte da página que está carregando, como um botão que está salvando ou uma seção buscando seus dados, em vez de bloquear a interface inteira.
- **Diga o que está carregando.** Sempre defina `accessibilityLabel`, por exemplo "Carregando produtos" ou "Salvando alterações", para que os usuários de leitores de tela saibam o que está acontecendo.
- **Informe o resultado depois.** Quando o spinner desaparecer, mostre uma mensagem clara de sucesso ou de erro para que os lojistas saibam que a operação terminou e como ela correu.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

Veja [as boas práticas da Shopify para `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (em inglês) para todas as recomendações.
