- **Úsala cuando el orden tenga significado.** Las listas numeradas transmiten orden, prioridad o clasificación, por lo que son adecuadas para instrucciones paso a paso o recomendaciones clasificadas. Si el orden no importa, usa `SUnorderedList` en su lugar.
- **Redacta los elementos de la misma forma.** Da a cada elemento la misma gramática y estructura para que la lista se lea con facilidad. Cambiar de estilo de un elemento a otro exige más esfuerzo a los lectores.
- **Mantén cada elemento breve.** Las listas funcionan porque se recorren rápido. Si los elementos se vuelven largos o complejos, considera separarlos en sus propias secciones.
- **No anides demasiado.** Un nivel de anidamiento puede organizar puntos relacionados, pero pasar de dos niveles hace que la lista sea difícil de seguir y sugiere que el contenido necesita otra estructura.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

Consulta [las buenas prácticas de Shopify para `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (en inglés) para ver todas las recomendaciones.
