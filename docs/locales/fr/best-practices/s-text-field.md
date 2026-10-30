- **Rendez la saisie attendue évidente.** Rédigez un `label` et un `placeholder` qui indiquent aux marchands quoi saisir et dans quel format. Une formulation vague mène aux suppositions, aux erreurs de validation et à la frustration.
- **Ajoutez du contexte avec un préfixe ou un suffixe.** Utilisez `prefix` et `suffix` pour montrer le type de valeur et son format, par exemple si les marchands doivent saisir une URL complète ou seulement un sous-domaine, un prix complet ou seulement le montant.
- **Fondez les contraintes sur des exigences réelles.** Définissez `minLength`, `maxLength` et les règles de validation selon les besoins métier réels plutôt que des nombres arbitraires, et indiquez-les aux marchands.
- **Donnez un retour tôt et de façon précise.** Faites savoir aux marchands si leur saisie est valide pendant qu'ils tapent, pas seulement à la soumission. Si elle ne l'est pas, utilisez `error` pour expliquer ce qui ne va pas et comment le corriger.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (en anglais) pour l'ensemble des recommandations.
