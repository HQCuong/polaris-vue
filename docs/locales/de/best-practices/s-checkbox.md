- **Jede Checkbox unabhängig halten.** Händler sollten jede beliebige Kombination von Optionen ankreuzen können, ohne dass eine Checkbox eine andere beeinflusst.
- **Jeder Checkbox ein aussagekräftiges `label` geben.** Das ist besonders wichtig, wenn eine Checkbox eine Einstellung ein- oder ausschaltet, damit Händler genau wissen, was sie aktivieren.
- **Optionen logisch ordnen.** Sortieren Sie sie alphabetisch, numerisch oder zeitlich, damit Händler die gewünschte Option schnell finden.
- **`indeterminate` für teilweises „Alle auswählen“ reservieren.** Verwenden Sie es an einer „Alle auswählen“-Checkbox, wenn nur ein Teil der Elemente ihrer Gruppe ausgewählt ist.
- **`details` ergänzen, wenn Kontext hilft.** Nutzen Sie es für zusätzliche Erklärungen zur Wirkung einer Option, aber nur, wenn das Label allein nicht ausreicht.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (auf Englisch).
