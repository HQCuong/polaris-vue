- **Auswahlmodus an die Optionen anpassen.** Behalten Sie die Einfachauswahl für Optionen bei, die sich gegenseitig ausschließen, etwa Zahlungsarten oder Versandgeschwindigkeiten, und setzen Sie `multiple`, wenn Händler mehrere wählen können.
- **Auswahl-Labels beschreiben das Ergebnis.** „Email notifications for new orders“ sagt mehr als „Email“. Halten Sie Labels kurz, aber klar genug, um für sich allein zu stehen.
- **`label` als Frage oder Aussage formulieren.** Ein Titel wie „Which shipping method?“ oder „Select notification preferences“ sagt Händlern mehr als ein vages Wort wie „Options“ oder „Settings“.
- **Komplexe Optionen im Slot `details` erklären.** Ergänzen Sie Details an einem einzelnen `SChoice`, wenn Händler verstehen müssen, was die Auswahl bedeutet.
- **`error`-Meldungen konkret formulieren.** Sagen Sie Händlern genau, was fehlt, zum Beispiel „Select at least one notification preference“, statt eines allgemeinen „Required field“.

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

Die vollständigen Richtlinien finden sich in [Shopifys Best Practices für `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (auf Englisch).
