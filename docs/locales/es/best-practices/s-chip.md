- **Usa los chips para describir, no para actuar.** Los chips funcionan bien para etiquetas, estados y categorías que informan a los comerciantes sobre el contenido. No son botones, así que cuando un chip deba poder pulsarse o descartarse, usa en su lugar `SClickableChip`.
- **Mantén las etiquetas cortas.** Un texto breve como "Featured" u "On sale" se lee de un vistazo, mientras que las etiquetas largas ralentizan la lectura y pueden quedar cortadas.
- **Ajusta el peso visual al contenido.** Usa `color="subdued"` para metadatos secundarios y el color predeterminado para etiquetas y categorías comunes.
- **Coloca los chips junto a lo que describen.** Mantenlos al lado del elemento que etiquetan y, en las listas, ponlos en la misma posición en cada fila para que los comerciantes puedan recorrerlas rápidamente.
- **Añade un icono cuando ayude.** Un `SIcon` en el slot `graphic` puede hacer que un estado o una categoría conocida sea más fácil de reconocer.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

Consulta [las buenas prácticas de Shopify para `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (en inglés) para ver todas las recomendaciones.
