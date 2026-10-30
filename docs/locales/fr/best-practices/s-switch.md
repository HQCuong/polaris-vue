- **N'associez pas les interrupteurs à un bouton d'enregistrement.** Un interrupteur prend effet dès qu'il est basculé : ajouter un bouton d'enregistrement laisse les marchands dans le doute quant au moment où leur modification s'applique réellement.
- **Rendez le paramètre évident.** Rédigez un `label` qui indique aux marchands ce que contrôle l'interrupteur et ce que signifient activé et désactivé, pour qu'ils n'aient pas à le basculer juste pour le découvrir.
- **Décrivez les conséquences.** Utilisez `details` pour expliquer ce qui change lorsque l'interrupteur est basculé, en particulier pour les paramètres qui touchent des fonctionnalités ou des données importantes, afin que les marchands décident en toute confiance.
- **Regroupez et ordonnez les interrupteurs liés.** Lorsqu'une page comporte plusieurs interrupteurs, gardez les paramètres liés ensemble dans un ordre logique pour que les marchands puissent les trouver et les configurer facilement.
- **Expliquez pourquoi un interrupteur est indisponible.** Lorsqu'un interrupteur est `disabled` en raison de permissions, de dépendances ou des limites d'un forfait, dites aux marchands pourquoi, si c'est temporaire et ce qu'ils doivent faire pour le débloquer.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

Consultez [les bonnes pratiques de Shopify pour `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (en anglais) pour l'ensemble des recommandations.
