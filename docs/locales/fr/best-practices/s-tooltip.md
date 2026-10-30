- **Utilisez les infobulles pour des détails supplémentaires et non essentiels.** Elles conviennent aux informations qui aident à comprendre sans être indispensables. Ne cachez jamais d'erreurs, d'informations essentielles ou d'instructions obligatoires dans une infobulle.
- **Associez-les aux boutons à icône seule.** Un bouton à icône a besoin d'une infobulle pour expliquer ce qu'il fait ; indiquez l'action et, s'il existe, son raccourci clavier.
- **Gardez un texte bref.** Une courte expression ou phrase est idéale. Si le contenu s'allonge, il mérite probablement une place plus visible dans l'interface.
- **Voyez dans la multiplication des infobulles un signal d'alerte.** Si l'interface a besoin de nombreuses infobulles pour être compréhensible, améliorez plutôt les libellés, la mise en page ou l'architecture de l'information.
- **Pensez aux appareils tactiles.** Les infobulles ne fonctionnent que sur ordinateur et n'apparaissent pas sur les écrans tactiles : affichez par défaut les informations importantes sur mobile.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

Consultez [les bonnes pratiques de Shopify pour `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (en anglais) pour l'ensemble des recommandations.
