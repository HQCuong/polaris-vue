- **모든 페이지에 제목을 지정하세요.** `heading`에 판매자가 보고 있는 페이지를 설명하는 제목을 설정합니다.
- **흐름 안에서는 breadcrumb를 추가하세요.** 페이지가 더 큰 흐름의 한 단계라면 `breadcrumb-actions` 슬롯에 이전으로 돌아가는 링크를 넣습니다.
- **헤더 액션은 페이지 전체에 적용되는 것만 두세요.** 페이지의 일부가 아니라 페이지 전체에 적용되는 액션만 헤더에 배치합니다.
- **액션 수를 제한하세요.** 한 페이지에는 주요 액션 최대 1개, 보조 액션 최대 3개를 사용합니다.
- **페이지 하단에는 액션을 두지 마세요.** 페이지 끝에는 어떤 액션도 배치하지 않습니다.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

전체 가이드는 [`<s-page>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices)(영어)를 참고하세요.
