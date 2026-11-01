- **Funciona con los gestores de contraseñas.** Define un valor de `autocomplete` adecuado, como `new-password` o `current-password`, para que los gestores de contraseñas ayuden a los comerciantes a generar y guardar contraseñas seguras.
- **Indica las reglas desde el principio.** Enumera todos los requisitos de la contraseña antes de que los comerciantes empiecen a escribir, en lugar de mostrarlos solo después de una entrada no válida. Así evitas la frustración y los formularios abandonados.
- **Guía a los comerciantes que crean una contraseña.** Ofrece información en tiempo real sobre la seguridad de la contraseña y explica qué la haría más segura, en lugar de simplemente imponer reglas sin contexto.
- **Permite pegar.** Los gestores de contraseñas y herramientas similares dependen de la acción de pegar, y bloquearla empuja a los comerciantes hacia contraseñas más débiles que puedan escribir de memoria.
- **Trata las comprobaciones del lado del cliente solo como información.** Valida siempre la contraseña en tu servidor, porque las restricciones del navegador son fáciles de eludir. La validación del lado del cliente sirve para responder rápido, no para aportar seguridad.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

Consulta [las buenas prácticas de Shopify para `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (en inglés) para ver todas las recomendaciones.
