- **Empieza con una fecha razonable.** Rellena `value` de antemano para que los comerciantes hagan su selección más rápido.
- **Ofrece atajos para las opciones habituales.** Valores predefinidos como "Today", "Last 7 days" o "This month" evitan que los comerciantes tengan que recorrer el calendario.
- **Usa `type="range"` para fechas de inicio y fin.** La selección de rangos es adecuada para informes, analíticas y otros filtros basados en un periodo de tiempo.
- **Bloquea las fechas que no correspondan.** Usa `allow` y `disallow` para que los comerciantes no puedan elegir fechas no válidas para tu caso de uso.
- **Deja espacio alrededor del selector.** Dale suficiente espacio para que no estorbe a los teclados en pantalla ni a otros elementos interactivos.
- **Ten en cuenta las fechas lejanas.** Avanzar mes a mes se vuelve tedioso más allá de unos pocos años, así que para fechas fuera de un margen de aproximadamente 5 a 10 años, ofrece valores predefinidos o deja que los comerciantes escriban el año directamente.

```vue
<SDatePicker type="range" />
```

Consulta [las buenas prácticas de Shopify para `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (en inglés) para ver todas las recomendaciones.
