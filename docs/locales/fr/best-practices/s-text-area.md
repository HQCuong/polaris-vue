- **Dimensionnez-la selon la réponse attendue.** Le nombre de `rows` visibles indique la quantité de texte attendue : une zone courte invite à une réponse brève, tandis qu'une zone plus haute demande davantage de détails.
- **Fixez des limites de longueur adaptées aux besoins réels.** Choisissez `minLength` et `maxLength` en fonction de ce que le contenu exige réellement, et informez les marchands de ces limites dès le départ.
- **Utilisez le placeholder comme exemple.** Rédigez un texte de `placeholder` qui montre le type de contenu, le format et le ton attendus, plutôt que de répéter l'usage du champ.
- **Indiquez la place restante.** Lorsque vous imposez une longueur maximale, montrez aux marchands combien de caractères il leur reste pour qu'ils puissent ajuster leur contenu sans dépasser.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

Consultez [les bonnes pratiques de Shopify pour `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (en anglais) pour l'ensemble des recommandations.
