- **Gardez des libellés courts.** Visez un à trois mots, par exemple "Electronics" ou "Summer sale".
- **Choisissez `color` selon l'importance.** Utilisez `color="subdued"` pour les chips secondaires et conservez la valeur par défaut `"base"` pour les sélections standard.
- **Rendez la suppression facile à repérer.** Lorsqu'un chip est `removable`, vérifiez que son bouton de suppression est visible et qu'il a des états de survol et de focus clairs.
- **Regroupez les chips liés.** Disposez-les dans un `SStack` en ligne pour qu'ils s'alignent horizontalement avec un espacement régulier.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Consultez [les bonnes pratiques de Shopify pour `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (en anglais) pour l'ensemble des recommandations.
