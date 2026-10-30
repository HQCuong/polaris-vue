- **간격이 관계를 반영하게 하세요.** 작은 `gap`은 항목들이 함께 속한다는 신호이고, 큰 간격은 서로 다른 그룹을 구분합니다. 콘텐츠 위계에 맞는 간격을 고릅니다.
- **인라인 스택은 줄바꿈된다는 점을 염두에 두세요.** `direction="inline"`에서는 공간이 부족하면 항목이 다음 줄로 넘어갑니다. 대개 원하는 동작이지만, 줄바꿈이나 여러 행을 정확히 제어해야 한다면 다른 레이아웃 방식을 사용합니다.
- **정렬을 의도적으로 설정하세요.** 기본 정렬은 대부분의 레이아웃에 적합합니다. 항목 크기가 다르거나 특정 위치가 필요할 때 `alignItems`나 `justifyContent`를 조정합니다.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

전체 가이드는 [`<s-stack>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices)(영어)를 참고하세요.
