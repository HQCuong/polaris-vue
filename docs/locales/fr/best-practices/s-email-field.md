- **Utilisez un `label` précis.** Des noms comme "Customer email" ou "Order notification email" sont plus clairs qu'un simple "Email" ou "Email address".
- **Ajoutez du contexte dans `details`.** Expliquez pourquoi l'adresse est nécessaire ou comment elle est utilisée, par exemple "Required for digital receipts".
- **Montrez le format dans `placeholder`.** Un exemple d'adresse comme "you@example.com" montre ce qu'il faut saisir ; ne vous contentez pas de répéter le libellé.
- **Rendez les messages d'`error` exploitables.** Dites aux marchands comment corriger l'adresse, par exemple "Enter a valid email address".

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Consultez [les bonnes pratiques de Shopify pour `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (en anglais) pour l'ensemble des recommandations.
