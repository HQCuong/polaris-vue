- **Utilisez-le pour filtrer sur place.** Il convient pour affiner le contenu d'une section ou d'une liste précise. La navigation globale ou les recherches complexes en plusieurs étapes demandent un modèle de recherche plus robuste.
- **Indiquez ce qui est recherché.** Rédigez un `label` et un `placeholder` précis qui indiquent aux marchands le contenu couvert par la recherche et les attributs sur lesquels ils peuvent chercher.
- **Réagissez pendant la saisie.** Lorsque c'est possible, mettez à jour les résultats ou le contenu filtré pendant que les marchands tapent, pour qu'ils puissent affiner leur requête et avoir confiance dans le fonctionnement de la recherche.
- **Prévoyez les recherches effacées et sans résultat.** Lorsque le champ est vidé, réaffichez la liste complète. Lorsque rien ne correspond, affichez un message qui suggère une autre action ou une recherche plus large.
- **Attendez une saisie suffisante.** Évitez de lancer des recherches qui renverraient trop de résultats ou des résultats sans intérêt ; commencer après deux ou trois caractères suffit pour renvoyer des correspondances utiles.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (en anglais) pour l'ensemble des recommandations.
