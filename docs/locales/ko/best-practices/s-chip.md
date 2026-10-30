- **칩은 동작이 아니라 설명에 사용하세요.** 칩은 콘텐츠에 관한 정보를 판매자에게 알려 주는 태그, 상태, 카테고리에 적합합니다. 칩은 버튼이 아니므로, 클릭하거나 닫을 수 있어야 한다면 대신 `SClickableChip`을 사용합니다.
- **레이블을 짧게 유지하세요.** "Featured"나 "On sale" 같은 짧은 텍스트는 한눈에 읽히지만, 긴 레이블은 훑어보기를 느리게 하고 잘릴 수도 있습니다.
- **콘텐츠에 맞는 시각적 무게를 사용하세요.** 부차적인 메타데이터에는 `color="subdued"`를, 일반적인 태그와 카테고리에는 기본 색상을 사용합니다.
- **칩은 설명하는 대상 옆에 두세요.** 칩을 레이블이 붙는 항목 옆에 두고, 목록에서는 모든 행에서 같은 위치에 배치해 판매자가 빠르게 훑어볼 수 있게 합니다.
- **도움이 될 때 아이콘을 추가하세요.** `graphic` 슬롯에 `SIcon`을 넣으면 상태나 익숙한 카테고리를 더 쉽게 알아볼 수 있습니다.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

전체 가이드는 [`<s-chip>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices)(영어)를 참고하세요.
