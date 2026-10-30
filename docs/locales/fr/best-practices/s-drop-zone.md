- **Indiquez les limites de fichiers avec `accept`.** Définissez des restrictions claires sur les types de fichiers acceptés par la zone de dépôt.
- **Gérez `droprejected` avec un message utile.** Lorsqu'un fichier échoue à la validation, écoutez l'événement et expliquez aux marchands ce qui s'est mal passé.
- **Envisagez `disabled` pendant le traitement.** Désactiver la zone de dépôt pendant un téléversement empêche les marchands d'ajouter d'autres fichiers entre-temps.

```vue
<SDropZone label="Product images" accept="image/*" />
```

Consultez [les bonnes pratiques de Shopify pour `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (en anglais) pour l'ensemble des recommandations.
