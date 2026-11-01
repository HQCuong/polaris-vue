- **Úsalo para un conjunto de opciones conocido.** Un select funciona cuando los comerciantes eligen de una lista predefinida. Cuando necesiten introducir un valor personalizado o buscar en una lista larga, encaja mejor un campo de texto que sugiera coincidencias mientras escriben, o un desplegable con búsqueda.
- **Ordena las opciones de forma deliberada.** Agrupa las opciones relacionadas, pon primero las más habituales u ordénalas alfabéticamente cuando no haya un orden natural, para que los comerciantes encuentren su opción rápidamente.
- **Escribe etiquetas fáciles de recorrer.** Da a cada opción el contexto suficiente para que los comerciantes puedan distinguirlas sin abrir la lista y leer varias de ellas.
- **Elige el estado inicial a propósito.** Preselecciona una opción cuando haya un valor predeterminado obvio, y usa un `placeholder` cuando los comerciantes deban hacer una elección consciente. No dejes el estado inicial ambiguo.
- **Explica los problemas de validación.** Cuando una selección sea obligatoria o no válida, usa `error` para decir a los comerciantes concretamente qué hacer, ya que los mensajes adaptados les ayudan a completar los formularios más rápido que los genéricos.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

Consulta [las buenas prácticas de Shopify para `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (en inglés) para ver todas las recomendaciones.
