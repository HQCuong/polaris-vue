- **Validez les URL vous-même.** La validation d'URL intégrée au navigateur est minimale et varie selon les navigateurs : ajoutez vos propres vérifications de structure, de protocoles autorisés et des formats acceptés dans votre cas d'usage.
- **Montrez le format attendu.** Indiquez aux marchands s'ils doivent inclure un protocole, quels protocoles sont autorisés et quel type d'URL vous attendez. Un exemple d'URL complète dans le `placeholder` rend cela clair.
- **Décidez comment gérer un protocole manquant.** Les marchands omettent souvent `https://`. Choisissez de l'ajouter pour eux, d'accepter les URL sans protocole ou d'afficher une `error` qui explique ce qui manque.
- **Choisissez des limites de longueur selon l'usage de l'URL.** Les navigateurs et les serveurs acceptent des longueurs maximales différentes : définissez `maxLength` selon la destination de l'URL plutôt qu'un nombre arbitraire, et mentionnez la limite lorsqu'elle compte.
- **Expliquez à quoi sert l'URL.** Utilisez `label` et `details` pour clarifier son rôle, car une URL d'image produit, un lien vers un profil social et une référence externe demandent chacun quelque chose de différent.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

Consultez [les bonnes pratiques de Shopify pour `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) (en anglais) pour l'ensemble des recommandations.
