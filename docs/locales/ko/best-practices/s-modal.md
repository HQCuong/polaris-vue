- **모달은 집중이 필요한 결정에만 사용하세요.** 판매자가 특정한 선택을 하거나 중요한 사항을 확인해야 할 때 모달을 엽니다. 작업이나 도구가 페이지에 직접 있어도 된다면 페이지에 둡니다.
- **꼭 필요할 때만 사용하세요.** 모든 모달은 판매자의 흐름을 끊으므로, 기본 패턴이 아니라 중요한 순간을 위한 최후의 수단으로 취급합니다.
- **주요 액션을 돋보이게 하세요.** `primary-action` 슬롯에 명확하고 눈에 띄는 행동 유도 버튼 하나를 둡니다.
- **액션 레이블에 구체적인 동사를 사용하세요.** "Delete", "Save", "Continue" 같은 버튼은 무슨 일이 일어날지 판매자에게 알려 줍니다. "Yes", "OK", "Submit" 같은 일반적인 레이블은 피합니다.
- **파괴적인 액션의 결과를 분명히 밝히세요.** 액션이 무언가를 삭제하거나 폐기한다면, 판매자가 무엇을 잃게 되는지 모달 본문에서 설명합니다.
- **모달을 중첩하지 마세요.** 이미 열려 있는 모달 안에서 두 번째 모달을 여는 것은 피합니다.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

전체 가이드는 [`<s-modal>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices)(영어)를 참고하세요.
