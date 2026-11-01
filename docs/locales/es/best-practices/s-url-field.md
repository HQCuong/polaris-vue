- **Valida las URL por tu cuenta.** La validación de URL integrada en el navegador es mínima y varía entre navegadores, así que añade tus propias comprobaciones de estructura, protocolos permitidos y los formatos que acepta tu caso de uso.
- **Muestra el formato que esperas.** Indica a los comerciantes si deben incluir un protocolo, qué protocolos se permiten y qué tipo de URL quieres. Una URL de ejemplo completa en el `placeholder` lo deja claro.
- **Decide cómo gestionar un protocolo que falta.** Los comerciantes suelen omitir `https://`. Elige si añadirlo por ellos, aceptar URL sin él o mostrar un `error` que explique qué falta.
- **Elige límites de longitud según dónde se use la URL.** Los navegadores y los servidores admiten longitudes máximas distintas, así que define `maxLength` según el destino de la URL en lugar de un número arbitrario y menciona el límite cuando sea relevante.
- **Explica para qué sirve la URL.** Usa `label` y `details` para dejar claro su propósito, ya que una URL de imagen de producto, un enlace a un perfil social y una referencia externa requieren cada uno algo diferente.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

Consulta [las buenas prácticas de Shopify para `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) (en inglés) para ver todas las recomendaciones.
