- **Expliquez la cause, puis la solution.** Un simple titre "No products" laisse les marchands deviner. Utilisez le `heading` pour dire pourquoi il n'y a rien, et laissez l'action porter l'étape suivante.
- **Mettez en avant une seule action principale.** Utilisez le slot `primary-action` pour l'étape qui permet aux marchands de sortir de l'état vide, et placez les autres options dans `secondary-actions`.
- **Formulez différemment les résultats filtrés.** Une ressource vide et un filtre qui ne renvoie rien sont deux situations différentes. Pour les résultats filtrés, indiquez aux marchands comment ajuster le filtre.
- **Considérez l'illustration comme un plus.** Le titre et l'action font l'essentiel du travail : laissez le slot `graphic` vide dans les mises en page denses et, si vous l'utilisez, limitez-le à une seule icône ou image.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Consultez [les bonnes pratiques de Shopify pour `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (en anglais) pour l'ensemble des recommandations.
