- **Ajuste o tamanho ao contexto.** Escolha um `size` menor para layouts densos, como tabelas e listas, e um maior em páginas de perfil, onde a pessoa é o foco.
- **Escreva um texto alternativo útil.** Defina em `alt` quem ou o que o avatar representa, como o nome de uma pessoa ou de uma empresa. Se esse nome já aparece como texto ao lado do avatar, use um `alt` vazio.
- **Mantenha-o junto ao que ele representa.** Coloque o avatar logo ao lado do nome ou da entidade que ele representa, para que a relação fique clara em listas, tabelas e cards.

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

Veja [as boas práticas da Shopify para `<s-avatar>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices) (em inglês) para todas as recomendações.
