- **Utilisez les icônes pour informer, pas pour décorer.** Une icône doit expliquer ce que fait une action ou montrer un état, comme une icône de suppression sur une action de suppression ou une coche pour un élément terminé. N'ajoutez pas d'icônes uniquement pour l'esthétique.
- **Soyez cohérent.** Une fois qu'une icône représente une action ou un concept, conservez ce sens dans toute votre app. Si `edit` signifie modifier à un endroit, utilisez-la pour la modification partout.
- **Associez les icônes à du texte lorsque c'est possible.** Seules, même les icônes familières peuvent être interprétées de plusieurs façons. N'utilisez une icône seule que lorsque la place manque, comme pour un bouton à icône seule doté d'un `accessibilityLabel`.
- **Choisissez des icônes largement reconnues.** Privilégiez les icônes au sens bien établi, comme `search`, `delete` et `plus`. Si une icône nécessite une explication, choisissez-en une autre.
- **Laissez `tone` porter le sens.** Utilisez `tone="critical"` pour les actions destructives, `tone="success"` pour les états positifs et `tone="warning"` pour inciter à la prudence. Les tons doivent communiquer quelque chose, pas décorer.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (en anglais) pour l'ensemble des recommandations.
