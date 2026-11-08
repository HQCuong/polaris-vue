- **Escolha um `type` semântico.** Escolha `"strong"` para destacar palavras ou frases importantes, `"address"` para um endereço postal ou de e-mail e `"redundant"` para texto que dá contexto a usuários de leitores de tela quando o mesmo conteúdo já aparece na tela. Escolher o tipo certo permite que as tecnologias assistivas expressem o significado do texto.
- **Use ênfase com moderação.** Aplique `type="strong"` a palavras ou números importantes dentro de uma frase, e não a frases inteiras; ênfase demais perde o efeito e torna o texto mais difícil de percorrer.
- **Use tone para status inline.** Tons como `"critical"`, `"success"` ou `"caution"` chamam a atenção para um status, mas combine-os com um texto claro em vez de deixar a cor transmitir a mensagem.
- **Não atenue o que importa.** `color="subdued"` é adequado para datas, horários e metadados, mas evite usá-lo em informações críticas que os lojistas precisam ler.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

Veja [as boas práticas da Shopify para `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (em inglês) para todas as recomendações.
