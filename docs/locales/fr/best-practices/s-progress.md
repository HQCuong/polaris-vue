- **Utilisez-la pour un travail mesurable.** Optez pour une barre de progression lorsque vous pouvez exprimer le travail comme une partie d'un tout. Lorsque vous ne savez pas combien de temps une tâche prendra ni où elle en est, un spinner est le choix le plus léger.
- **Nommez ce qui progresse.** Donnez à `accessibilityLabel` une description précise, par exemple "Importing products" ou "Storage used". Les lecteurs d'écran annoncent la barre sous ce libellé, et il n'existe aucune valeur par défaut si vous l'omettez.
- **Ajoutez du texte lorsque les chiffres comptent.** La barre n'affiche elle-même ni libellé ni pourcentage : placez un texte à côté lorsque les marchands ont besoin des chiffres, et gardez ce texte synchronisé avec `value`.
- **Définissez `max` sur le total réel.** Utilisez le nombre ou le plafond réel, comme le nombre de fichiers ou la taille d'un quota, plutôt que de tout convertir en pourcentage. Il est alors simple de mettre à jour `value` à mesure que le travail avance.
- **N'utilisez le ton que pour signaler un problème.** Réservez `tone="critical"` et `tone="warning"` aux progressions qui révèlent un problème, comme une limite atteinte. Laissez le travail en cours ordinaire sur le ton par défaut.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

Consultez [les bonnes pratiques de Shopify pour `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (en anglais) pour l'ensemble des recommandations.
