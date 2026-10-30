- **Gardez des paragraphes courts.** Visez deux à quatre phrases en langage simple, sans jargon. Les marchands ont tendance à survoler : découpez les contenus longs en morceaux plus petits.
- **Utilisez le ton pour signaler l'intention.** `tone="critical"` convient aux erreurs, `"caution"` aux avertissements et `"success"` aux confirmations. Appuyez toujours la couleur par une formulation claire plutôt que de compter uniquement sur elle.
- **Concevez pour l'accessibilité.** Ajoutez un texte réservé aux lecteurs d'écran (`accessibilityVisibility="exclusive"`) pour le contexte que les marchands voyants déduisent de la mise en page ou des icônes, et assurez-vous que le texte coloré conserve un contraste suffisant pour être lu.
- **Limitez le nombre de lignes avec prudence.** `lineClamp` est utile dans les espaces restreints comme les cartes ou les aperçus, mais ne laissez jamais la troncature masquer une information critique.

Consultez [les bonnes pratiques de Shopify pour `<s-paragraph>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) (en anglais) pour l'ensemble des recommandations.
