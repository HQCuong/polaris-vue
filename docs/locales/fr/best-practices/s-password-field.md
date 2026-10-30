- **Prenez en charge les gestionnaires de mots de passe.** Définissez une valeur `autocomplete` adaptée, comme `new-password` ou `current-password`, pour que les gestionnaires de mots de passe aident les marchands à générer et enregistrer des mots de passe robustes.
- **Annoncez les règles dès le départ.** Listez toutes les exigences du mot de passe avant que les marchands ne commencent à saisir, au lieu de ne les révéler qu'après une saisie invalide. Cela évite la frustration et les formulaires abandonnés.
- **Guidez les marchands qui créent un mot de passe.** Donnez un retour en temps réel sur la robustesse du mot de passe et expliquez ce qui le rendrait plus robuste, plutôt que d'imposer des règles sans contexte.
- **Autorisez le collage.** Les gestionnaires de mots de passe et outils similaires reposent sur le collage, et le bloquer pousse les marchands vers des mots de passe plus faibles qu'ils peuvent taper de mémoire.
- **Considérez les vérifications côté client comme un simple retour.** Validez toujours le mot de passe sur votre serveur, car les contraintes du navigateur sont faciles à contourner. La validation côté client sert à réagir rapidement, pas à assurer la sécurité.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

Consultez [les bonnes pratiques de Shopify pour `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (en anglais) pour l'ensemble des recommandations.
