- **Choisissez la taille selon le contexte.** Utilisez `size="base"` dans les cellules de tableau, les éléments de liste ou partout où plusieurs badges se côtoient. Réservez `size="large"` à un badge unique qui mérite d'être mis en avant, comme le statut principal affiché en haut d'une page.
- **Limitez les libellés à un ou deux mots.** Des libellés courts comme "Fulfilled" ou "Out of stock" se lisent d'un coup d'œil. Formulez les statuts au passé, donc "Refunded" plutôt que "Refund".
- **Accordez le ton au statut.** Utilisez `tone="critical"` pour les erreurs ou les problèmes urgents qui exigent une action, `tone="warning"` pour les problèmes qui méritent l'attention, `tone="success"` pour les confirmations positives et `tone="info"` pour les statuts neutres. Donnez le même ton au même statut partout dans votre app.
- **Placez les badges à côté de ce qu'ils décrivent.** Dans un élément de liste, mettez le badge près du titre. Dans un tableau, donnez aux badges leur propre colonne pour que les marchands puissent la parcourir rapidement.
- **N'utilisez les badges que pour les statuts système.** Les badges sont des indicateurs statiques définis par le système : ne les utilisez donc pas pour des étiquettes créées par les marchands ni pour des éléments qu'ils peuvent supprimer.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

Consultez [les bonnes pratiques de Shopify pour `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (en anglais) pour l'ensemble des recommandations.
