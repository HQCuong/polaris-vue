- **Mantén las etiquetas cortas.** El objetivo es de una a tres palabras, por ejemplo "Electronics" o "Summer sale".
- **Elige el `color` según la importancia.** Usa `color="subdued"` para los chips secundarios y conserva el valor predeterminado `"base"` para las selecciones estándar.
- **Haz que la opción de eliminar sea fácil de ver.** Cuando un chip sea `removable`, comprueba que su botón de eliminar sea visible y tenga estados de hover y foco claros.
- **Agrupa los chips relacionados.** Disponlos en un `SStack` inline para que se alineen horizontalmente con un espaciado uniforme.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Consulta [las buenas prácticas de Shopify para `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (en inglés) para ver todas las recomendaciones.
