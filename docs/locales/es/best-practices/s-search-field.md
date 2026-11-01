- **Úsalo para filtrar en el mismo lugar.** Es adecuado para acotar el contenido de una sección o lista concreta. La navegación global o las búsquedas complejas de varios pasos requieren un patrón de búsqueda más robusto.
- **Indica qué se busca.** Escribe un `label` y un `placeholder` específicos que digan a los comerciantes qué contenido abarca la búsqueda y por qué atributos pueden buscar.
- **Responde mientras los comerciantes escriben.** Siempre que puedas, actualiza los resultados o el contenido filtrado mientras los comerciantes escriben, para que puedan afinar su consulta y confiar en que la búsqueda funciona.
- **Prevé las búsquedas borradas y sin resultados.** Cuando se vacíe el campo, vuelve a mostrar la lista completa. Cuando nada coincida, muestra un mensaje que sugiera otra acción o una búsqueda más amplia.
- **Espera a tener suficiente texto.** Evita lanzar búsquedas que devolverían demasiados resultados o resultados sin sentido; empezar a partir de dos o tres caracteres basta para devolver coincidencias útiles.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

Consulta [las buenas prácticas de Shopify para `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (en inglés) para ver todas las recomendaciones.
