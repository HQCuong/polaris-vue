- **Nommez l'usage de la couleur.** Utilisez un `label` comme "Button background color" ou "Heading text color" plutôt qu'un générique "Color".
- **Affichez la couleur actuelle lors de la modification.** Définissez `value` sur la couleur existante pour que les marchands voient ce qu'ils modifient.

```vue
<SColorField label="Button background color" value="#1a1a1a" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-color-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field#best-practices) (en anglais) pour l'ensemble des recommandations.
