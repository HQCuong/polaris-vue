- **Gardez chaque case à cocher indépendante.** Les marchands doivent pouvoir cocher n'importe quelle combinaison d'options sans qu'une case n'influe sur une autre.
- **Donnez à chaque case un `label` descriptif.** C'est essentiel lorsqu'une case active ou désactive un paramètre, pour que les marchands sachent exactement ce qu'ils activent.
- **Ordonnez les options de façon logique.** Triez-les par ordre alphabétique, numérique ou chronologique pour que les marchands trouvent rapidement celle qu'ils cherchent.
- **Réservez `indeterminate` à la sélection partielle « tout sélectionner ».** Utilisez-le sur une case « tout sélectionner » lorsque seule une partie des éléments de son groupe est cochée.
- **Ajoutez `details` lorsque le contexte aide.** Utilisez-le pour expliquer plus en détail ce que fait une option, uniquement lorsque le libellé seul ne suffit pas.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

Consultez [les bonnes pratiques de Shopify pour `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (en anglais) pour l'ensemble des recommandations.
