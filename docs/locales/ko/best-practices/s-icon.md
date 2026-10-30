- **아이콘은 장식이 아니라 정보 전달에 사용하세요.** 삭제 액션의 삭제 아이콘이나 완료된 항목의 체크 표시처럼, 아이콘은 액션이 하는 일을 설명하거나 상태를 보여 줘야 합니다. 보기 좋으라고 아이콘을 추가하지 마세요.
- **일관성을 유지하세요.** 어떤 아이콘이 특정 액션이나 개념을 나타내게 되었다면 앱 전체에서 그대로 유지합니다. 한 곳에서 `edit`가 편집을 뜻한다면 모든 곳에서 편집에 사용합니다.
- **가능하면 아이콘과 텍스트를 함께 사용하세요.** 익숙한 아이콘이라도 단독으로 쓰이면 여러 가지로 해석될 수 있습니다. 아이콘 단독 사용은 `accessibilityLabel`이 있는 아이콘 전용 버튼처럼 공간이 부족한 곳으로 한정합니다.
- **널리 알려진 아이콘을 고르세요.** `search`, `delete`, `plus`처럼 의미가 정착된 아이콘을 우선합니다. 설명이 필요한 아이콘이라면 다른 아이콘을 고릅니다.
- **`tone`이 의미를 전달하게 하세요.** 파괴적인 액션에는 `tone="critical"`, 긍정적인 상태에는 `tone="success"`, 주의에는 `tone="warning"`을 사용합니다. tone은 장식이 아니라 무언가를 전달해야 합니다.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

전체 가이드는 [`<s-icon>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices)(영어)를 참고하세요.
