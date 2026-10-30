- **명확한 동사로 레이블을 붙이세요.** "Save", "Edit", "Add tags"처럼 버튼이 하는 일을 정확히 말합니다. 문장형 대소문자(sentence case)를 사용하고, "a"나 "the" 같은 불필요한 단어와 문장 부호는 생략합니다.
- **`tone="critical"`은 파괴적인 액션에만 사용하세요.** 되돌리기 어렵거나 불가능한 액션에만 사용하고, 일반적으로 액션의 중요도에 맞는 tone을 고릅니다.
- **위계를 분명히 하세요.** 주요 액션에는 `variant="primary"`, 보조 액션에는 `variant="secondary"`, 부가 액션에는 `variant="tertiary"`를 지정해 판매자가 가장 중요한 액션을 알아볼 수 있게 합니다.
- **버튼을 일관된 위치에 두세요.** 앱 전체에서 버튼을 같은 위치에 배치하면 판매자가 어디서 찾아야 할지 익히게 됩니다.
- **아이콘만 있는 버튼에 레이블을 붙이세요.** 버튼에 아이콘만 있고 텍스트가 없다면, 스크린 리더 사용자에게 버튼의 기능을 알려 주는 `accessibilityLabel`을 지정합니다.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

전체 가이드는 [`<s-button>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices)(영어)를 참고하세요.
