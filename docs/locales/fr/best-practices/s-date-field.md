- **Commencez par une date pertinente.** Préremplissez `value` avec la date existante lors d'une modification, ou avec un choix probable lorsque vous en suggérez un.
- **Limitez les dates à celles qui ont du sens.** Restreignez les dates que les marchands peuvent choisir avec `allow` et `disallow`, par exemple en limitant un champ de planification aux dates à venir ou un champ professionnel aux jours du lundi au vendredi.
- **Expliquez les limites dans `details`.** Précisez les exigences, comme "Must be a future date", pour que les marchands connaissent les règles avant de choisir.
- **Rendez les messages d'`error` exploitables.** Lorsqu'une date n'est pas valide, dites aux marchands comment corriger le problème.

Consultez [les bonnes pratiques de Shopify pour `<s-date-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices) (en anglais) pour l'ensemble des recommandations.
