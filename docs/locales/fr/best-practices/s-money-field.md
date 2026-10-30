- **Définissez `min` et `max` sur des limites réalistes.** Par exemple, un prix de produit peut utiliser un `min` de 0.01 pour ne pas pouvoir être nul, une remise peut aller de 0 au total de la commande et un remboursement peut être plafonné au montant payé. Vérifiez toujours aussi les valeurs par rapport à vos règles métier.
- **Indiquez la limite exacte dans `error`.** Au lieu de "Invalid amount", écrivez par exemple "Price must be at least $0.01" pour que les marchands sachent quelle contrainte ils n'ont pas respectée.
- **N'incluez pas de symbole monétaire dans `label` ni dans `placeholder`.** Ajouter "$" ou un symbole similaire peut entrer en conflit avec le formatage monétaire que le champ gère déjà.
- **Nommez le montant selon son usage.** "Product base price" ou "Discount amount" en dit plus aux marchands que "Amount" ou "Price".
- **Préremplissez `value` lors d'une modification.** Affichez le montant actuel pour les valeurs existantes ; pour les nouvelles saisies, envisagez une valeur par défaut raisonnable comme 0.00 ou un prix typique.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (en anglais) pour l'ensemble des recommandations.
