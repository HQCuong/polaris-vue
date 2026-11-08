- **Use chips para descrever, não para agir.** Chips funcionam bem para tags, status e categorias que dizem algo aos lojistas sobre o conteúdo. Eles não são botões, então, quando um chip precisar ser clicado ou dispensado, use `SClickableChip`.
- **Mantenha os rótulos curtos.** Textos breves como "Destaque" ou "Em promoção" podem ser lidos num relance, enquanto rótulos longos atrasam a leitura e podem ser cortados.
- **Ajuste o peso visual ao conteúdo.** Use `color="subdued"` para metadados secundários e a cor padrão para tags e categorias comuns.
- **Coloque os chips junto ao que descrevem.** Mantenha-os ao lado do item que identificam e, em listas, coloque-os na mesma posição em todas as linhas para que os lojistas consigam percorrê-las rapidamente.
- **Adicione um ícone quando ajudar.** Um `SIcon` no slot `graphic` pode tornar um status ou uma categoria conhecida mais fácil de reconhecer.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

Veja [as boas práticas da Shopify para `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (em inglês) para todas as recomendações.
