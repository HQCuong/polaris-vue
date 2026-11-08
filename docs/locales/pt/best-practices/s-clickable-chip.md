- **Mantenha os rótulos curtos.** O ideal é de uma a três palavras, por exemplo "Eletrônicos" ou "Liquidação de verão".
- **Escolha `color` pela importância.** Use `color="subdued"` para chips secundários e mantenha o padrão `"base"` para seleções comuns.
- **Facilite a identificação da remoção.** Quando um chip for `removable`, verifique se o botão de remover está visível e tem estados de hover e foco claros.
- **Agrupe chips relacionados.** Disponha-os em um `SStack` inline para que fiquem alinhados horizontalmente com espaçamento uniforme.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Veja [as boas práticas da Shopify para `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (em inglês) para todas as recomendações.
