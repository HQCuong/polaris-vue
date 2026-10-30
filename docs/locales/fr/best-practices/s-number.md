- **N'encapsulez que le chiffre.** Placez la valeur numérique elle-même dans `SNumber` et laissez les mots qui l'entourent dans `SText` ou `SParagraph`. Les chiffres tabulaires alignent proprement les nombres, mais rendent les mots ordinaires irréguliers.
- **Formatez d'abord les valeurs dans votre app.** `SNumber` contrôle l'apparence des chiffres, pas le formatage de la valeur : ajoutez vous-même les symboles monétaires, les décimales et les séparateurs de milliers selon la locale du marchand.
- **N'utilisez le ton que lorsque le chiffre a un statut.** Définissez `tone` lorsque le nombre lui-même signale quelque chose, comme un stock épuisé. Si tous les chiffres ont un ton, aucun ne ressort.
- **Dimensionnez les chiffres selon leur importance.** Donnez une `fontSize` plus grande au nombre que les marchands doivent lire en premier, comme un total, et laissez les chiffres secondaires à la taille par défaut.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

Consultez [les bonnes pratiques de Shopify pour `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (en anglais) pour l'ensemble des recommandations.
