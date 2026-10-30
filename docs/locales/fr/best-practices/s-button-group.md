- **Regroupez les actions liées.** Rassemblez les appels à l'action qui relèvent de la même tâche pour que les marchands voient leurs options et leurs relations.
- **Conservez une hiérarchie visuelle.** Utilisez `variant="primary"` sur le bouton de l'action principale et `variant="secondary"` ou `variant="tertiary"` sur les actions secondaires pour orienter l'attention.
- **N'ajoutez pas trop de boutons.** Une longue rangée de choix submerge les marchands et complique la décision.
- **Utilisez un groupe segmenté pour les bascules.** Pour des options étroitement liées, comme le changement de vue ou de filtre, définissez `gap="none"` afin de réunir les boutons en un seul contrôle segmenté.
- **Isolez les actions destructives.** Placez-les de façon réfléchie et donnez-leur `tone="critical"` pour qu'elles soient plus difficiles à déclencher par accident.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

Consultez [les bonnes pratiques de Shopify pour `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (en anglais) pour l'ensemble des recommandations.
