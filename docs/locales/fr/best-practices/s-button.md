- **Utilisez un verbe clair comme libellé.** Dites exactement ce que fait le bouton, comme "Save", "Edit" ou "Add tags". N'utilisez une majuscule qu'en début de libellé, évitez les mots de remplissage comme "a" ou "the" et omettez la ponctuation.
- **Réservez `tone="critical"` aux actions destructives.** Ne l'utilisez que lorsqu'une action est difficile, voire impossible, à annuler et, plus généralement, adaptez le ton à l'importance de l'action.
- **Rendez la hiérarchie évidente.** Donnez `variant="primary"` à l'action principale, `variant="secondary"` aux actions secondaires et `variant="tertiary"` aux actions complémentaires, pour que les marchands sachent quelle action compte le plus.
- **Placez les boutons de façon cohérente.** Mettez les boutons aux mêmes endroits dans toute votre app pour que les marchands apprennent où les chercher.
- **Ajoutez un libellé aux boutons à icône seule.** Si un bouton a une icône sans texte, donnez-lui un `accessibilityLabel` qui indique aux utilisateurs de lecteur d'écran ce qu'il fait.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (en anglais) pour l'ensemble des recommandations.
