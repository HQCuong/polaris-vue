- **Use ícones para informar, não para decorar.** Um ícone deve explicar o que uma ação faz ou mostrar um estado, como um ícone de lixeira em uma ação de excluir ou um check para algo concluído. Não adicione ícones só pela aparência.
- **Seja consistente.** Depois que um ícone passar a representar uma ação ou um conceito, mantenha esse significado em todo o seu app. Se `edit` significa editar em um lugar, use-o para editar em todos os lugares.
- **Combine ícones com texto sempre que puder.** Sozinhos, até ícones conhecidos podem ser interpretados de mais de uma forma. Use um ícone sozinho apenas onde o espaço for limitado, como em um botão só com ícone que tenha um `accessibilityLabel`.
- **Escolha ícones amplamente reconhecidos.** Prefira ícones com significados consolidados, como `search`, `delete` e `plus`. Se um ícone precisa de explicação, escolha outro.
- **Deixe o `tone` transmitir significado.** Use `tone="critical"` para ações destrutivas, `tone="success"` para estados positivos e `tone="warning"` para cautela. Os tons devem comunicar algo, não decorar.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

Veja [as boas práticas da Shopify para `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (em inglês) para todas as recomendações.
