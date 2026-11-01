- **Usa tablas para los datos que los comerciantes comparan.** Las tablas son adecuadas para muchos registros que comparten los mismos atributos y deben revisarse uno al lado del otro. Para una lista sencilla sin nada que comparar, elige un componente más simple.
- **Ten en cuenta el diseño de lista en móvil.** En móvil, la tabla se convierte en una lista, así que comprueba que tus encabezados y valores se sigan leyendo bien como pares de etiqueta y valor apilados en lugar de una cuadrícula.
- **Mantén pocas columnas.** Muchas columnas hacen que una tabla sea difícil de revisar y obligan a desplazarse horizontalmente. Muestra solo las columnas que los comerciantes necesitan para su tarea y considera mostrar el resto bajo demanda.
- **Escribe encabezados de columna claros.** Mantén cada `STableHeader` breve y descriptivo para que los comerciantes sepan exactamente qué datos contiene la columna.
- **Prepárate para conjuntos de datos grandes.** Las tablas grandes perjudican el rendimiento y la usabilidad. Activa `paginate` en cuanto tengas más de unas 50 a 100 filas, o plantéate añadir filtros o búsqueda para que los comerciantes lleguen antes a los registros correctos.

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

Consulta [las buenas prácticas de Shopify para `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (en inglés) para ver todas las recomendaciones.
