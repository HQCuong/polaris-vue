- **Donnez un titre à chaque page.** Définissez `heading` sur un titre qui décrit la page sur laquelle se trouve le marchand.
- **Ajoutez un fil d'Ariane au sein d'un parcours.** Lorsque la page est une étape d'un parcours plus large, placez des liens de retour dans le slot `breadcrumb-actions`.
- **Réservez les actions de l'en-tête à la page entière.** Ne placez des actions dans l'en-tête que si elles concernent toute la page, pas une seule de ses parties.
- **Limitez le nombre d'actions.** Utilisez au plus une action principale et trois actions secondaires par page.
- **Ne placez aucune action en bas de page.** N'ajoutez pas d'actions à la fin de la page.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

Consultez [les bonnes pratiques de Shopify pour `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (en anglais) pour l'ensemble des recommandations.
