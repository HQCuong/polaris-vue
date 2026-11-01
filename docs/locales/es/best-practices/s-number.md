- **Envuelve solo la cifra.** Coloca el valor numérico en `SNumber` y deja las palabras que lo rodean en `SText` o `SParagraph`. Los dígitos tabulares alinean las cifras con precisión, pero hacen que las palabras normales se vean irregulares.
- **Da formato a los valores primero en tu app.** `SNumber` controla el aspecto de los dígitos, no el formato del valor, así que añade tú mismo los símbolos de moneda, los decimales y los separadores de miles según la configuración regional del comerciante.
- **Usa el tono solo cuando la cifra tenga un estado.** Define `tone` cuando el propio número indique algo, como un stock agotado. Si todas las cifras tienen tono, ninguna destaca.
- **Dimensiona las cifras según su importancia.** Asigna un `fontSize` mayor al número que los comerciantes deben leer primero, como un total, y deja las cifras secundarias en el tamaño predeterminado.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

Consulta [las buenas prácticas de Shopify para `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (en inglés) para ver todas las recomendaciones.
