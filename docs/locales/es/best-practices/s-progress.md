- **Úsala para trabajo que puedas medir.** Recurre a una barra de progreso cuando puedas expresar el trabajo como parte de un todo. Cuando no sepas cuánto tardará algo ni cuánto ha avanzado, un spinner es la opción más ligera.
- **Nombra lo que avanza.** Da a `accessibilityLabel` una descripción precisa, por ejemplo "Importing products" o "Storage used". Los lectores de pantalla anuncian la barra con esa etiqueta, y no hay ningún valor predeterminado si la omites.
- **Añade texto cuando las cifras importen.** La barra no muestra por sí misma ninguna etiqueta ni porcentaje, así que coloca texto junto a ella cuando los comerciantes necesiten las cifras, y mantén ese texto sincronizado con `value`.
- **Define `max` con el total real.** Usa el recuento o el límite real, como cuántos archivos hay o el tamaño de una cuota, en lugar de convertirlo todo en un porcentaje. Así resulta sencillo actualizar `value` a medida que avanza el trabajo.
- **Usa el tono solo para señalar problemas.** Reserva `tone="critical"` y `tone="warning"` para progresos que indiquen un problema, como un límite que se ha agotado. Deja el trabajo en curso habitual con el tono predeterminado.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

Consulta [las buenas prácticas de Shopify para `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (en inglés) para ver todas las recomendaciones.
