- **Empieza con una fecha razonable.** Rellena `value` de antemano con la fecha existente al editar, o con una opción probable cuando sugieras una.
- **Limita las fechas a las que tengan sentido.** Acota las fechas que los comerciantes pueden elegir con `allow` y `disallow`, por ejemplo restringiendo un campo de programación a fechas futuras o un campo laboral a los días de lunes a viernes.
- **Explica los límites en `details`.** Detalla los requisitos, como "Must be a future date", para que los comerciantes conozcan las reglas antes de elegir.
- **Haz que los mensajes de `error` sean útiles.** Cuando una fecha no sea válida, indica a los comerciantes cómo corregirla.

Consulta [las buenas prácticas de Shopify para `<s-date-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices) (en inglés) para ver todas las recomendaciones.
