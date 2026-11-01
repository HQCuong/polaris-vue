- **Elige un `type` semántico.** Elige `"strong"` para destacar palabras o frases clave, `"address"` para una dirección postal o de correo electrónico, y `"redundant"` para texto que da contexto a los usuarios de lectores de pantalla cuando el mismo contenido ya aparece en pantalla. Elegir el tipo correcto permite que las tecnologías de asistencia transmitan lo que significa el texto.
- **Enfatiza con moderación.** Aplica `type="strong"` a palabras o números clave dentro de una frase, no a frases enteras; el exceso de énfasis pierde su efecto y hace que el texto sea más difícil de revisar.
- **Usa el tono para estados en línea.** Tonos como `"critical"`, `"success"` o `"caution"` llaman la atención sobre un estado, pero acompáñalos de una redacción clara en lugar de dejar que el color transmita el mensaje.
- **No atenúes lo importante.** `color="subdued"` es adecuado para marcas de tiempo y metadatos, pero evítalo para información crítica que los comerciantes deben leer.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

Consulta [las buenas prácticas de Shopify para `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (en inglés) para ver todas las recomendaciones.
