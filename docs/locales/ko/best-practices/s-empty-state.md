- **원인을 설명한 뒤 해결 방법을 제시하세요.** "No products"라는 제목만 있으면 판매자는 추측할 수밖에 없습니다. `heading`으로 왜 아무것도 없는지 말하고, 다음 단계는 액션이 담당하게 합니다.
- **하나의 주요 액션을 앞세우세요.** 판매자가 빈 상태에서 벗어나게 해 주는 단 하나의 단계에는 `primary-action` 슬롯을 사용하고, 다른 선택지는 `secondary-actions`에 둡니다.
- **필터 결과는 다르게 표현하세요.** 아무것도 없는 리소스와 일치하는 항목이 없는 필터는 서로 다른 상황입니다. 필터 결과의 경우 판매자에게 필터를 어떻게 조정하면 되는지 알려 줍니다.
- **그래픽은 부가 요소로 취급하세요.** 핵심 역할은 제목과 액션이 하므로, 밀도가 높은 레이아웃에서는 `graphic` 슬롯을 비워 두고, 사용할 때는 아이콘이나 이미지 하나로 제한합니다.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

전체 가이드는 [`<s-empty-state>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices)(영어)를 참고하세요.
