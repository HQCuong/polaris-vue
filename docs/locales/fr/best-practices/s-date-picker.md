- **Commencez par une date pertinente.** Préremplissez `value` pour que les marchands fassent leur sélection plus vite.
- **Proposez des raccourcis pour les choix courants.** Des préréglages comme "Today", "Last 7 days" ou "This month" évitent aux marchands de parcourir le calendrier.
- **Utilisez `type="range"` pour les dates de début et de fin.** La sélection de plage convient aux rapports, aux analyses et aux autres filtres fondés sur une période.
- **Bloquez les dates non pertinentes.** Utilisez `allow` et `disallow` pour que les marchands ne puissent pas choisir des dates invalides dans votre cas d'usage.
- **Laissez de l'espace autour du sélecteur.** Donnez-lui assez de place pour qu'il ne gêne ni les claviers virtuels ni les autres éléments interactifs.
- **Anticipez les dates lointaines.** Naviguer mois par mois devient fastidieux au-delà de quelques années : pour des dates en dehors d'une fenêtre d'environ 5 à 10 ans, proposez des préréglages ou laissez les marchands saisir l'année directement.

```vue
<SDatePicker type="range" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (en anglais) pour l'ensemble des recommandations.
