- **메뉴는 보조 액션에 사용하세요.** "Save" 같은 주요 액션은 페이지에 그대로 보이게 둡니다. 메뉴는 "Archive"나 "Export data"처럼 판매자가 덜 자주 쓰거나 파괴적이어서 고정된 자리가 필요 없는 액션에 적합합니다.
- **레이블은 동사와 명사로 작성하세요.** "Edit details"나 "Export as CSV" 같은 레이블은 무슨 일이 일어나는지 정확히 말해 줍니다. "Options", "More", "Settings"처럼 모호한 레이블은 피합니다.
- **긴 메뉴는 섹션으로 나누세요.** 메뉴 항목이 네 개 이상이면 관련 액션을 `heading`이 있는 `SSection`으로 묶습니다. 예를 들어 일상적인 액션은 "Manage", 파괴적인 액션은 "Danger zone"으로 묶을 수 있습니다.
- **레이블을 뒷받침하는 아이콘을 추가하세요.** 편집에 `edit`, 삭제에 `delete`, 내보내기에 `download` 같은 아이콘은 판매자가 액션을 알아보는 데 도움이 되지만, 텍스트를 보강해야 하며 결코 대신해서는 안 됩니다.
- **지금 사용할 수 없는 항목만 비활성화하세요.** 이미 환불된 주문을 환불하는 것처럼 현재 맥락에서 해당되지 않는 액션에는 `disabled`를 설정합니다. 어떤 경우에도 해당되지 않는 액션이라면 메뉴에서 빼세요.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

전체 가이드는 [`<s-menu>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices)(영어)를 참고하세요.
