- **Indica los límites de archivos con `accept`.** Establece restricciones claras sobre los tipos de archivo que admite la zona de soltar.
- **Gestiona `droprejected` con un mensaje útil.** Cuando un archivo no supere la validación, escucha el evento e indica a los comerciantes qué salió mal.
- **Considera usar `disabled` durante el procesamiento.** Desactivar la zona de soltar durante una subida evita que los comerciantes añadan más archivos mientras tanto.

```vue
<SDropZone label="Product images" accept="image/*" />
```

Consulta [las buenas prácticas de Shopify para `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (en inglés) para ver todas las recomendaciones.
