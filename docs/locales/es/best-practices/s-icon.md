- **Usa los iconos para informar, no para decorar.** Un icono debe explicar lo que hace una acción o mostrar un estado, como un icono de eliminar en una acción de eliminar o una marca de verificación para algo completado. No añadas iconos solo por estética.
- **Sé coherente.** Una vez que un icono representa una acción o un concepto, mantén ese significado en toda tu app. Si `edit` significa editar en un lugar, úsalo para editar en todos los lugares.
- **Acompaña los iconos con texto cuando puedas.** Por sí solos, incluso los iconos conocidos pueden interpretarse de más de una forma. Usa un icono solo únicamente cuando falte espacio, como en un botón de solo icono con un `accessibilityLabel`.
- **Elige iconos ampliamente reconocidos.** Prefiere iconos con significados consolidados, como `search`, `delete` y `plus`. Si un icono necesita explicación, elige otro.
- **Deja que `tone` transmita el significado.** Usa `tone="critical"` para acciones destructivas, `tone="success"` para estados positivos y `tone="warning"` para indicar precaución. Los tonos deben comunicar algo, no decorar.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

Consulta [las buenas prácticas de Shopify para `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (en inglés) para ver todas las recomendaciones.
