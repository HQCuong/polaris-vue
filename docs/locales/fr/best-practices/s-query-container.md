- **Adaptez-vous au conteneur, pas au viewport.** Un query container permet aux composants de réagir à la largeur de leur conteneur. C'est utile pour les composants qui apparaissent dans des zones de largeurs différentes, comme une carte produit dans une barre latérale ou dans la colonne principale.
- **Nommez les conteneurs lorsqu'il y en a plusieurs.** Si plusieurs query containers ont besoin de requêtes différentes, donnez à chacun un `containerName` descriptif pour pouvoir le cibler ; les conteneurs sans nom répondent tous aux mêmes requêtes.
- **Placez les valeurs responsives sur les props.** Le conteneur fournit le contexte que les composants Polaris utilisent pour résoudre les valeurs de props responsives, comme `padding="@container (inline-size > 500px) large-500, none"`, si bien que vous n'avez pas à écrire vous-même le CSS des container queries.
- **Ne les utilisez que là où c'est nécessaire.** Chaque query container oblige le navigateur à suivre sa taille et à appliquer des styles conditionnels : ajoutez-en un là où vous avez besoin d'un comportement responsive basé sur le conteneur plutôt que d'envelopper chaque élément.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

Consultez [les bonnes pratiques de Shopify pour `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (en anglais) pour l'ensemble des recommandations.
