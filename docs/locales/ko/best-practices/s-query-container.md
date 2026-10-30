- **viewport가 아니라 컨테이너에 맞추세요.** query container를 사용하면 컴포넌트가 자신을 감싸는 컨테이너의 너비에 반응할 수 있습니다. 사이드바나 메인 열에 놓이는 상품 카드처럼 너비가 다른 여러 위치에 나타나는 컴포넌트에 유용합니다.
- **여러 개라면 컨테이너에 이름을 붙이세요.** 여러 query container에 서로 다른 쿼리가 필요하다면 각각에 설명적인 `containerName`을 지정해 대상으로 삼을 수 있게 합니다. 이름 없는 컨테이너는 모두 같은 쿼리에 반응합니다.
- **반응형 값은 props에 지정하세요.** 컨테이너는 Polaris 컴포넌트가 `padding="@container (inline-size > 500px) large-500, none"` 같은 반응형 prop 값을 해석하는 데 쓰는 맥락을 제공하므로, container query CSS를 직접 작성할 필요가 없습니다.
- **필요한 곳에만 사용하세요.** query container마다 브라우저가 크기를 추적하고 조건부 스타일을 적용해야 하므로, 모든 요소를 감싸지 말고 컨테이너 기반 반응형이 필요한 곳에만 추가합니다.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

전체 가이드는 [`<s-query-container>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices)(영어)를 참고하세요.
