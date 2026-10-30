- **Utilisez les menus pour les actions secondaires.** Gardez les actions principales comme "Save" visibles dans la page elle-même. Les menus conviennent aux actions que les marchands utilisent moins souvent ou aux actions destructives, comme "Archive" ou "Export data", qui n'ont pas besoin d'une place permanente.
- **Formulez les libellés avec un verbe et un nom.** Des libellés comme "Edit details" ou "Export as CSV" disent exactement ce qui va se passer ; évitez les libellés vagues comme "Options", "More" ou "Settings".
- **Découpez les menus plus longs en sections.** Dès qu'un menu compte quatre éléments ou plus, regroupez les actions liées dans un `SSection` avec un `heading`, par exemple "Manage" pour les actions courantes et "Danger zone" pour les actions destructives.
- **Ajoutez des icônes qui appuient le libellé.** Des icônes comme `edit` pour modifier, `delete` pour supprimer ou `download` pour exporter aident les marchands à reconnaître une action, mais elles doivent renforcer le texte, jamais le remplacer.
- **Ne désactivez que ce qui est momentanément indisponible.** Définissez `disabled` sur un élément lorsque l'action ne s'applique pas dans le contexte actuel, comme le remboursement d'une commande déjà remboursée. Si une action ne s'applique jamais, retirez-la du menu.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Consultez [les bonnes pratiques de Shopify pour `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (en anglais) pour l'ensemble des recommandations.
