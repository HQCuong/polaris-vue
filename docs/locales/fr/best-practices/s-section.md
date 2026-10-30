- **Regroupez ce qui va ensemble.** Donnez à chaque section un rôle unique et cohérent, qu'il s'agisse d'informations liées ou de contrôles liés ; elle sert alors de conteneur visuel et donne du sens à la structure de la page.
- **Rédigez des titres descriptifs.** Les marchands parcourent le `heading` pour s'orienter : indiquez ce que contient la section plutôt que de vous rabattre sur un titre générique.
- **N'imbriquez qu'autant que le contenu l'exige.** Une section imbriquée influe sur la hiérarchie des titres et le plan de la page plutôt que sur son apparence. Limitez-vous à deux ou trois niveaux au maximum, et n'imbriquez que lorsque la structure supplémentaire clarifie le contenu.
- **Supprimez le padding lorsque le contenu doit aller d'un bord à l'autre.** Utilisez `padding="none"` pour des éléments comme les tableaux ou les images qui doivent remplir la section, puis vérifiez que le contenu intérieur conserve un espacement suffisant.
- **Ajoutez un `accessibilityLabel` lorsque le titre ne suffit pas.** Lorsque le titre affiché laisse le rôle de la section flou pour les utilisateurs de lecteur d'écran, donnez-leur un libellé qui apporte le contexte manquant.
- **Choisissez le bon slot d'en-tête.** Placez les détails qui complètent le titre lui-même, comme une infobulle ou un compteur, dans `accessory`. Placez les informations sur la section dans son ensemble, comme un badge de statut, dans `supplemental`. Les actions telles qu'un bouton ou un menu vont dans `accessory`, car `supplemental` ne les accepte pas.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

Consultez [les bonnes pratiques de Shopify pour `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (en anglais) pour l'ensemble des recommandations.
