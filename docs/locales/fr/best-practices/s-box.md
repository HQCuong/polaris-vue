- **Utilisez-le comme conteneur générique.** `SBox` gère l'espacement, les bordures et les arrière-plans pour regrouper du contenu. Lorsque vous avez besoin d'une disposition précise, en lignes ou en colonnes par exemple, utilisez plutôt `SStack` ou `SGrid`.
- **Cherchez d'abord un composant plus parlant.** Si un composant comme `SSection` ou `SBanner` décrit déjà la nature du contenu, préférez-le. Les composants dédiés expriment une intention plus claire et offrent une meilleure accessibilité.
- **Pensez aux petits écrans.** Une mise en page correcte sur ordinateur peut se casser sur mobile : ajustez l'espacement et la disposition avec des valeurs responsives plutôt que de figer des tailles fixes.
- **Décrivez les régions et le contenu interactif.** Lorsqu'une box délimite une région distincte ou contient du contenu interactif, définissez `accessibilityRole` et `accessibilityLabel` pour que les utilisateurs de lecteur d'écran puissent comprendre la structure et s'y déplacer.
- **Limitez l'imbrication.** Empiler des box dans des box complique le balisage et rend les styles difficiles à maintenir. Cherchez une structure plus simple ou un composant de mise en page mieux adapté.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

Consultez [les bonnes pratiques de Shopify pour `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (en anglais) pour l'ensemble des recommandations.
