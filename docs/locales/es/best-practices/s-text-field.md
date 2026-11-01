- **Deja clara la entrada esperada.** Escribe un `label` y un `placeholder` que indiquen a los comerciantes qué introducir y en qué formato. Una redacción vaga lleva a suposiciones, errores de validación y frustración.
- **Añade contexto con un prefijo o sufijo.** Usa `prefix` y `suffix` para mostrar el tipo de valor y su formato, por ejemplo si los comerciantes deben escribir una URL completa o solo un subdominio, o un precio completo o solo el importe.
- **Basa las restricciones en requisitos reales.** Define `minLength`, `maxLength` y las reglas de validación según las necesidades reales del negocio en lugar de números arbitrarios, e indica a los comerciantes cuáles son.
- **Da comentarios pronto y de forma específica.** Haz saber a los comerciantes si su entrada es válida mientras escriben, no solo al enviar. Cuando no lo sea, usa `error` para explicar qué está mal y cómo corregirlo.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

Consulta [las buenas prácticas de Shopify para `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (en inglés) para ver todas las recomendaciones.
