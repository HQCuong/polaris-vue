- **Utilisez les chips pour décrire, pas pour agir.** Les chips conviennent aux étiquettes, statuts et catégories qui renseignent les marchands sur le contenu. Ce ne sont pas des boutons : lorsqu'un chip doit être cliqué ou supprimé, utilisez plutôt `SClickableChip`.
- **Gardez des libellés courts.** Un texte bref comme "Featured" ou "On sale" se lit d'un coup d'œil, alors que les libellés longs ralentissent la lecture et risquent d'être tronqués.
- **Adaptez le poids visuel au contenu.** Utilisez `color="subdued"` pour les métadonnées secondaires et la couleur par défaut pour les étiquettes et catégories ordinaires.
- **Placez les chips à côté de ce qu'ils décrivent.** Gardez-les près de l'élément qu'ils qualifient et, dans les listes, placez-les au même endroit sur chaque ligne pour que les marchands puissent parcourir rapidement.
- **Ajoutez une icône lorsque c'est utile.** Un `SIcon` dans le slot `graphic` peut rendre un statut ou une catégorie familière plus facile à reconnaître.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

Consultez [les bonnes pratiques de Shopify pour `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (en anglais) pour l'ensemble des recommandations.
