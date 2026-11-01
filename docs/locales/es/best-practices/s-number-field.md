- **Úsalo solo para valores puramente numéricos.** Recurre a él para cosas como cantidades, medidas o porcentajes. Si un valor puede incluir letras o símbolos, como un código de producto o un número de teléfono, usa `STextField` en su lugar.
- **Muestra la unidad.** Usa `prefix` o `suffix` para indicar qué mide el número, de modo que los comerciantes no tengan que adivinar si están escribiendo dólares, kilogramos o un porcentaje.
- **Define límites acordes con tus reglas de negocio.** Asigna a `min` y `max` valores que reflejen lo que realmente está permitido, lo que orienta a los comerciantes hacia entradas válidas antes de enviar el formulario.
- **Valida y explica los errores.** Comprueba cada entrada numérica y, cuando una falle, usa `error` para indicar exactamente qué está mal y cómo corregirlo en lugar de mostrar un mensaje genérico.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

Consulta [las buenas prácticas de Shopify para `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) (en inglés) para ver todas las recomendaciones.
