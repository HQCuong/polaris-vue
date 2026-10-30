- **Un seul sujet par bannière.** Chaque bannière doit porter un seul message ou une seule action requise, pour que les marchands ne se demandent pas de quoi il s'agit.
- **Écrivez pour une lecture rapide.** Gardez un texte assez court pour que les marchands saisissent le message et la marche à suivre d'un seul coup d'œil.
- **Indiquez aux marchands l'étape suivante.** Les bannières avec `tone="info"`, `tone="warning"` ou `tone="critical"` doivent inclure un appel à l'action qui précise comment procéder.
- **Laissez les marchands fermer les bannières.** Définissez `dismissible`, sauf si le message exige une action immédiate, et évitez les bannières qui restent à l'écran sans aucun moyen de les fermer.
- **Placez les bannières selon leur portée.** Mettez une bannière en dehors de toute section pour un message qui concerne la page entière, ou à l'intérieur d'une section lorsqu'il porte sur le contenu de cette section.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Consultez [les bonnes pratiques de Shopify pour `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (en anglais) pour l'ensemble des recommandations.
