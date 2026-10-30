- **Utilisez-le pour un ensemble de choix connu.** Un select convient lorsque les marchands choisissent dans une liste prédéfinie. Lorsqu'ils doivent saisir une valeur personnalisée ou chercher dans une longue liste, un champ de texte qui suggère des correspondances pendant la saisie, ou une liste déroulante avec recherche, est plus adapté.
- **Ordonnez les options de façon réfléchie.** Regroupez les options liées, placez les plus courantes en premier ou triez-les par ordre alphabétique lorsqu'il n'existe pas d'ordre naturel, pour que les marchands trouvent rapidement leur choix.
- **Rédigez des libellés faciles à parcourir.** Donnez à chaque option assez de contexte pour que les marchands puissent les distinguer sans ouvrir la liste et en lire plusieurs.
- **Choisissez délibérément l'état initial.** Présélectionnez une option lorsqu'il existe une valeur par défaut évidente, et utilisez un `placeholder` lorsque les marchands doivent faire un choix conscient. Ne laissez pas l'état initial ambigu.
- **Expliquez les problèmes de validation.** Lorsqu'une sélection est requise ou invalide, utilisez `error` pour dire précisément aux marchands quoi faire, car des messages adaptés les aident à remplir les formulaires plus vite que des messages génériques.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

Consultez [les bonnes pratiques de Shopify pour `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (en anglais) pour l'ensemble des recommandations.
