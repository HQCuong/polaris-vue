- **의미에 맞는 `type`을 고르세요.** 핵심 단어나 구절을 표시할 때는 `"strong"`, 우편 주소나 이메일 주소에는 `"address"`, 같은 내용이 이미 화면에 있을 때 스크린 리더 사용자에게 맥락을 주는 텍스트에는 `"redundant"`를 선택합니다. 올바른 type을 고르면 보조 기술이 텍스트의 의미를 전달할 수 있습니다.
- **강조는 아껴서 사용하세요.** `type="strong"`은 문장 전체가 아니라 문장 안의 핵심 단어나 숫자에 적용합니다. 강조가 지나치면 효과가 사라지고 텍스트를 훑어보기 어려워집니다.
- **인라인 상태에는 tone을 사용하세요.** `"critical"`, `"success"`, `"caution"` 같은 tone은 상태에 주의를 끌지만, 색상에만 메시지를 맡기지 말고 명확한 문구와 함께 사용합니다.
- **중요한 내용은 흐리게 처리하지 마세요.** `color="subdued"`는 타임스탬프와 메타데이터에 적합하지만, 판매자가 반드시 읽어야 하는 중요한 정보에는 피합니다.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

전체 가이드는 [`<s-text>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices)(영어)를 참고하세요.
