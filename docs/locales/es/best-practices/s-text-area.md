- **Dale el tamaño de la respuesta esperada.** El número de `rows` visibles indica cuánto escribir: un área corta invita a una respuesta breve, mientras que una más alta pide más detalle.
- **Fija límites de longitud que reflejen necesidades reales.** Elige `minLength` y `maxLength` según lo que el contenido requiera realmente e informa a los comerciantes de esos límites desde el principio.
- **Usa el placeholder como ejemplo.** Escribe un texto de `placeholder` que muestre el tipo de contenido, el formato y el tono que esperas, en lugar de repetir para qué sirve el campo.
- **Muestra cuánto espacio queda.** Cuando impongas una longitud máxima, deja que los comerciantes vean cuántos caracteres les quedan para que puedan ajustar su contenido sin pasarse.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

Consulta [las buenas prácticas de Shopify para `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (en inglés) para ver todas las recomendaciones.
