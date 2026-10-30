- **Utilisez-la lorsque l'ordre a un sens.** Les listes numérotées expriment un ordre, une priorité ou un classement : elles conviennent aux instructions pas à pas ou aux recommandations classées. Si l'ordre n'a pas d'importance, utilisez plutôt `SUnorderedList`.
- **Rédigez les éléments de la même façon.** Donnez à chaque élément la même grammaire et la même structure pour que la liste se lise facilement. Changer de style d'un élément à l'autre demande plus d'effort au lecteur.
- **Gardez chaque élément court.** Les listes fonctionnent parce qu'elles se parcourent vite. Si les éléments deviennent longs ou complexes, envisagez de les transformer en sections distinctes.
- **N'imbriquez pas trop profondément.** Un niveau d'imbrication peut organiser des points liés, mais au-delà de deux niveaux la liste devient difficile à suivre, signe que le contenu a besoin d'une autre structure.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

Consultez [les bonnes pratiques de Shopify pour `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (en anglais) pour l'ensemble des recommandations.
