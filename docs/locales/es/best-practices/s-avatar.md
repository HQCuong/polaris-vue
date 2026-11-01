- **Ajusta el tamaño al contexto.** Elige un `size` más pequeño para diseños densos como tablas y listas, y uno más grande en páginas de perfil donde la persona es el centro de atención.
- **Escribe un texto alternativo útil.** Indica en `alt` a quién o qué representa el avatar, por ejemplo el nombre de una persona o de una empresa. Si ese nombre ya aparece como texto junto al avatar, usa en su lugar un `alt` vacío.
- **Mantenlo junto a lo que representa.** Coloca el avatar justo al lado del nombre o la entidad que representa, para que la relación quede clara en listas, tablas y tarjetas.

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

Consulta [las buenas prácticas de Shopify para `<s-avatar>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices) (en inglés) para ver todas las recomendaciones.
