- **Escolha o tamanho de acordo com o contexto.** Use `size="base"` em células de tabela, itens de lista ou qualquer lugar onde vários badges fiquem juntos. Reserve `size="large"` para um único badge que mereça destaque, como o status principal exibido no topo de uma página.
- **Use rótulos de uma ou duas palavras.** Rótulos curtos como "Processado" ou "Esgotado" são lidos rapidamente. Escreva os status no particípio, ou seja, "Reembolsado" em vez de "Reembolso".
- **Combine o tom com o status.** Use `tone="critical"` para erros ou problemas urgentes que exigem ação, `tone="warning"` para problemas que precisam de atenção, `tone="success"` para confirmações positivas e `tone="info"` para status neutros. Dê ao mesmo status o mesmo tom em todo o seu app.
- **Mantenha os badges junto ao que descrevem.** Em um item de lista, coloque o badge perto do título. Em uma tabela, dê aos badges uma coluna própria para que os lojistas possam percorrê-la com o olhar.
- **Use badges apenas para status do sistema.** Badges são indicadores estáticos definidos pelo sistema, então não os use para tags criadas pelos lojistas nem para itens que eles possam remover.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

Veja [as boas práticas da Shopify para `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (em inglês) para todas as recomendações.
