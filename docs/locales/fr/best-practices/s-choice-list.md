- **Accordez le mode de sélection aux options.** Conservez la sélection unique pour les options qui s'excluent mutuellement, comme les moyens de paiement ou les vitesses de livraison, et définissez `multiple` lorsque les marchands peuvent en choisir plusieurs.
- **Faites décrire le résultat par le libellé de chaque choix.** "Email notifications for new orders" en dit plus que "Email". Gardez des libellés courts, mais assez clairs pour se suffire à eux-mêmes.
- **Formulez le `label` comme une question ou une affirmation.** Un titre comme "Which shipping method?" ou "Select notification preferences" en dit plus aux marchands qu'un mot vague comme "Options" ou "Settings".
- **Expliquez les choix complexes dans le slot `details`.** Ajoutez des détails à un `SChoice` lorsque les marchands doivent comprendre ce qu'implique ce choix.
- **Rendez les messages d'`error` précis.** Dites exactement aux marchands ce qui manque, par exemple "Select at least one notification preference", plutôt qu'un générique "Required field".

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

Consultez [les bonnes pratiques de Shopify pour `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (en anglais) pour l'ensemble des recommandations.
