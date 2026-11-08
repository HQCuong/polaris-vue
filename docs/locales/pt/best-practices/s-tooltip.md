- **Use tooltips para detalhes extras e não essenciais.** Eles são adequados para informações que ajudam a entender, mas não são obrigatórias. Nunca esconda erros, informações essenciais ou instruções obrigatórias em um tooltip.
- **Combine-os com botões só de ícone.** Um botão de ícone precisa de um tooltip para explicar o que faz; inclua a ação e, se houver, o atalho de teclado correspondente.
- **Mantenha o texto breve.** Uma frase curta é o ideal. Se o conteúdo ficar longo, provavelmente ele merece um lugar mais visível na interface.
- **Trate muitos tooltips como um sinal de alerta.** Se a interface precisar de muitos deles para fazer sentido, melhore os rótulos, o layout ou a arquitetura da informação.
- **Lembre-se dos dispositivos de toque.** Tooltips só funcionam no desktop e não aparecem em telas sensíveis ao toque, então mostre as informações importantes por padrão no mobile.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

Veja [as boas práticas da Shopify para `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (em inglês) para todas as recomendações.
