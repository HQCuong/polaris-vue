- **Comece com uma data sensata.** Preencha `value` para que os lojistas façam a seleção mais rápido.
- **Ofereça atalhos para escolhas comuns.** Predefinições como "Hoje", "Últimos 7 dias" ou "Este mês" poupam os lojistas de navegar pelo calendário.
- **Use `type="range"` para datas de início e fim.** A seleção de intervalo é ideal para relatórios, análises e outros filtros baseados em um período.
- **Bloqueie as datas que não se aplicam.** Use `allow` e `disallow` para que os lojistas não possam escolher datas inválidas para o seu caso de uso.
- **Deixe espaço ao redor do seletor.** Dê a ele espaço suficiente para que não atrapalhe teclados na tela ou outros elementos interativos.
- **Pense em datas distantes.** Avançar mês a mês fica cansativo depois de alguns anos, então, para datas fora de uma janela de aproximadamente 5–10 anos, ofereça predefinições ou deixe os lojistas digitarem o ano diretamente.

```vue
<SDatePicker type="range" />
```

Veja [as boas práticas da Shopify para `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (em inglês) para todas as recomendações.
