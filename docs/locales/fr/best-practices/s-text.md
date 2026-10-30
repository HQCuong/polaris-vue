- **Choisissez un `type` sémantique.** Choisissez `"strong"` pour mettre en valeur des mots ou expressions clés, `"address"` pour une adresse postale ou e-mail, et `"redundant"` pour un texte qui donne du contexte aux utilisateurs de lecteur d'écran lorsque le même contenu figure déjà à l'écran. Le bon type permet aux technologies d'assistance de restituer le sens du texte.
- **Mettez en valeur avec parcimonie.** Appliquez `type="strong"` à des mots ou des nombres clés au sein d'une phrase, pas à des phrases entières ; trop d'emphase perd son effet et rend le texte plus difficile à parcourir.
- **Utilisez le ton pour un statut en ligne.** Des tons comme `"critical"`, `"success"` ou `"caution"` attirent l'attention sur un statut, mais associez-les à une formulation claire plutôt que de laisser la couleur porter le message.
- **N'atténuez pas ce qui compte.** `color="subdued"` convient aux horodatages et aux métadonnées, mais évitez-le pour les informations critiques que les marchands doivent lire.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

Consultez [les bonnes pratiques de Shopify pour `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (en anglais) pour l'ensemble des recommandations.
