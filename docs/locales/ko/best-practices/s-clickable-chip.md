- **레이블을 짧게 유지하세요.** "Electronics"나 "Summer sale"처럼 한두 단어에서 세 단어 정도가 목표입니다.
- **중요도에 따라 `color`를 고르세요.** 부차적인 칩에는 `color="subdued"`를 사용하고, 일반적인 선택에는 기본값 `"base"`를 유지합니다.
- **제거 버튼을 쉽게 알아볼 수 있게 하세요.** 칩이 `removable`이라면 제거 버튼이 잘 보이고 hover와 focus 상태가 분명한지 확인합니다.
- **관련된 칩을 묶으세요.** 인라인 `SStack`에 배치해 칩들이 균일한 간격으로 가로로 정렬되게 합니다.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

전체 가이드는 [`<s-clickable-chip>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices)(영어)를 참고하세요.
