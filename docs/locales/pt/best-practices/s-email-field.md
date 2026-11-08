- **Use um `label` específico.** Nomes como "E-mail do cliente" ou "E-mail para notificações de pedidos" são mais claros do que um simples "E-mail" ou "Endereço de e-mail".
- **Adicione contexto em `details`.** Explique por que o endereço é necessário ou como ele é usado, por exemplo "Obrigatório para recibos digitais".
- **Mostre o formato em `placeholder`.** Um endereço de exemplo como "you@example.com" mostra o que digitar; não se limite a repetir o rótulo.
- **Torne as mensagens de `error` acionáveis.** Diga aos lojistas como corrigir o endereço, por exemplo "Insira um endereço de e-mail válido".

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Veja [as boas práticas da Shopify para `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (em inglês) para todas as recomendações.
