- **Faites refléter les relations par l'espacement.** Un petit `gap` indique que des éléments vont ensemble, tandis qu'un plus grand sépare des groupes distincts. Choisissez l'espacement qui correspond à la hiérarchie de votre contenu.
- **Attendez-vous à ce que les stacks en ligne passent à la ligne.** Avec `direction="inline"`, les éléments passent à la ligne suivante lorsqu'ils manquent de place. C'est généralement ce que vous voulez, mais si vous avez besoin d'un contrôle précis des retours à la ligne ou de plusieurs rangées, optez pour une autre approche de mise en page.
- **Définissez l'alignement délibérément.** L'alignement par défaut convient à la plupart des mises en page. Ajustez `alignItems` ou `justifyContent` lorsque les éléments diffèrent en taille ou ont besoin d'un positionnement précis.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

Consultez [les bonnes pratiques de Shopify pour `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (en anglais) pour l'ensemble des recommandations.
