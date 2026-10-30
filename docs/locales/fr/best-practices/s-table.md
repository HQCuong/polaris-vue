- **Utilisez les tableaux pour les données que les marchands comparent.** Les tableaux conviennent à de nombreux enregistrements qui partagent les mêmes attributs et doivent être parcourus côte à côte. Pour une simple liste sans rien à comparer, choisissez un composant plus simple.
- **Prévoyez la disposition en liste sur mobile.** Sur mobile, le tableau se transforme en liste : vérifiez que vos en-têtes et vos valeurs restent lisibles sous forme de paires libellé-valeur empilées plutôt que de grille.
- **Limitez le nombre de colonnes.** De nombreuses colonnes rendent un tableau difficile à parcourir et imposent un défilement horizontal. N'affichez que les colonnes dont les marchands ont besoin pour leur tâche, et envisagez d'afficher le reste à la demande.
- **Rédigez des en-têtes de colonnes clairs.** Gardez chaque `STableHeader` court et descriptif pour que les marchands sachent exactement quelles données contient la colonne.
- **Anticipez les grands jeux de données.** Les grands tableaux nuisent aux performances et à l'ergonomie. Activez `paginate` dès que vous dépassez environ 50 à 100 lignes, ou envisagez d'ajouter des filtres ou une recherche pour que les marchands atteignent plus vite les bons enregistrements.

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

Consultez [les bonnes pratiques de Shopify pour `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (en anglais) pour l'ensemble des recommandations.
