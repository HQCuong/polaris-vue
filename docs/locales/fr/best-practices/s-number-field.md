- **Réservez-le aux valeurs purement numériques.** Utilisez-le pour des quantités, des mesures ou des pourcentages. Si une valeur peut contenir des lettres ou des symboles, comme un code produit ou un numéro de téléphone, utilisez plutôt `STextField`.
- **Affichez l'unité.** Utilisez `prefix` ou `suffix` pour indiquer ce que mesure le nombre, afin que les marchands n'aient pas à deviner s'ils saisissent des dollars, des kilogrammes ou un pourcentage.
- **Fixez des limites conformes à vos règles métier.** Donnez à `min` et `max` des valeurs qui reflètent ce qui est réellement autorisé, ce qui oriente les marchands vers des saisies valides avant qu'ils ne soumettent le formulaire.
- **Validez et expliquez les erreurs.** Vérifiez chaque saisie numérique et, en cas d'échec, utilisez `error` pour dire exactement ce qui ne va pas et comment le corriger plutôt que d'afficher un message générique.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) (en anglais) pour l'ensemble des recommandations.
