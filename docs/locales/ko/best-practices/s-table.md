- **판매자가 비교하는 데이터에 표를 사용하세요.** 표는 같은 속성을 공유하고 나란히 훑어봐야 하는 많은 레코드에 적합합니다. 비교할 것이 없는 단순한 목록이라면 더 단순한 컴포넌트를 고릅니다.
- **모바일 목록 레이아웃을 고려하세요.** 모바일에서는 표가 목록으로 바뀌므로, 헤더와 값이 그리드가 아니라 레이블과 값이 쌓인 형태로도 잘 읽히는지 확인합니다.
- **열 개수를 적게 유지하세요.** 열이 많으면 표를 훑어보기 어렵고 가로 스크롤이 생깁니다. 판매자의 작업에 필요한 열만 보여 주고, 나머지는 필요할 때 표시하는 방식을 고려합니다.
- **명확한 열 헤더를 작성하세요.** 각 `STableHeader`를 짧고 설명적으로 유지해 판매자가 그 열에 어떤 데이터가 있는지 정확히 알 수 있게 합니다.
- **대규모 데이터에 대비하세요.** 큰 표는 성능과 사용성을 떨어뜨립니다. 행이 대략 50~100개를 넘으면 `paginate`를 켜거나, 판매자가 원하는 레코드에 더 빨리 도달하도록 필터나 검색을 추가하는 것을 고려합니다.

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

전체 가이드는 [`<s-table>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices)(영어)를 참고하세요.
