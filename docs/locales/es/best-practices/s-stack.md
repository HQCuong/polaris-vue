- **Haz que el espaciado refleje las relaciones.** Un `gap` pequeño indica que los elementos van juntos, mientras que uno más grande separa grupos distintos. Elige el espaciado que corresponda a la jerarquía de tu contenido.
- **Cuenta con que los stacks en línea se ajusten.** Con `direction="inline"`, los elementos pasan a una nueva línea cuando se quedan sin espacio. Normalmente es lo que quieres, pero si necesitas un control exacto de los saltos de línea o varias filas, recurre a otro enfoque de diseño.
- **Define la alineación a propósito.** La alineación predeterminada sirve para la mayoría de los diseños. Ajusta `alignItems` o `justifyContent` cuando los elementos tengan tamaños distintos o necesiten un posicionamiento específico.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

Consulta [las buenas prácticas de Shopify para `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (en inglés) para ver todas las recomendaciones.
