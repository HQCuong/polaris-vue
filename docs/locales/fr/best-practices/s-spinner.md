- **Affichez-le pour les opérations asynchrones plus lentes.** Utilisez un spinner lorsqu'une opération comme l'enregistrement d'un formulaire, la récupération de données ou le traitement d'une action prend plus d'environ 500 ms. Pour les actions instantanées, un spinner ne fait que clignoter et distraire.
- **Limitez-le à ce qui charge.** Placez le spinner dans la partie de la page en cours de chargement, comme un bouton en train d'enregistrer ou une section qui récupère ses données, plutôt que de bloquer toute l'interface.
- **Indiquez ce qui charge.** Définissez toujours `accessibilityLabel`, par exemple "Loading products" ou "Saving changes", pour que les utilisateurs de lecteur d'écran sachent ce qui se passe.
- **Communiquez le résultat ensuite.** Une fois le spinner disparu, affichez un message clair de réussite ou d'erreur pour que les marchands sachent que l'opération est terminée et comment elle s'est déroulée.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (en anglais) pour l'ensemble des recommandations.
