- **순서에 의미가 있을 때 사용하세요.** 번호 목록은 순서, 우선순위, 순위를 전달하므로 단계별 안내나 순위가 매겨진 추천에 적합합니다. 순서가 중요하지 않다면 대신 `SUnorderedList`를 사용합니다.
- **항목을 같은 방식으로 작성하세요.** 모든 항목의 문법과 구조를 맞추면 목록이 쉽게 읽힙니다. 항목마다 스타일이 바뀌면 읽는 사람이 더 애써야 합니다.
- **각 항목을 짧게 유지하세요.** 목록은 빠르게 훑어볼 수 있기 때문에 효과적입니다. 항목이 길어지거나 복잡해지면 별도 섹션으로 나누는 것을 고려합니다.
- **너무 깊이 중첩하지 마세요.** 한 단계의 중첩은 관련된 내용을 정리하는 데 도움이 되지만, 두 단계를 넘어가면 따라가기 어렵고 콘텐츠에 다른 구조가 필요하다는 신호입니다.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

전체 가이드는 [`<s-ordered-list>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices)(영어)를 참고하세요.
