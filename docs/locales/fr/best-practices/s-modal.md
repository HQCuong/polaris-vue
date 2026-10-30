- **Réservez les modales aux décisions qui demandent de la concentration.** Ouvrez-en une lorsque les marchands doivent faire un choix précis ou prendre connaissance d'une information critique. Si la tâche ou l'outil peut figurer directement sur la page, laissez-le plutôt là.
- **Utilisez-les avec parcimonie.** Chaque modale interrompt le marchand : traitez-la comme un dernier recours pour les moments importants plutôt que comme un modèle par défaut.
- **Faites ressortir l'action principale.** Donnez à la modale un appel à l'action clair et bien visible dans le slot `primary-action`.
- **Utilisez des verbes précis pour les actions.** Des boutons comme "Delete", "Save" ou "Continue" disent aux marchands ce qui va se passer ; évitez les libellés génériques comme "Yes", "OK" ou "Submit".
- **Explicitez les conséquences des actions destructives.** Lorsque l'action supprime ou abandonne quelque chose, décrivez dans le corps de la modale ce que les marchands vont perdre.
- **N'imbriquez pas les modales.** Évitez d'ouvrir une seconde modale depuis une modale déjà ouverte.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

Consultez [les bonnes pratiques de Shopify pour `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (en anglais) pour l'ensemble des recommandations.
