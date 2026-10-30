- **예상되는 답변에 맞게 크기를 정하세요.** 보이는 `rows` 수는 얼마나 써야 하는지를 알려 줍니다. 짧은 영역은 간단한 답을, 높은 영역은 더 자세한 내용을 요청합니다.
- **실제 필요에 맞는 길이 제한을 설정하세요.** 콘텐츠에 실제로 필요한 만큼을 기준으로 `minLength`와 `maxLength`를 정하고, 그 제한을 판매자에게 미리 알려 줍니다.
- **placeholder를 예시로 사용하세요.** 필드의 용도를 반복하지 말고, 기대하는 콘텐츠의 종류, 형식, 어조를 보여 주는 `placeholder` 텍스트를 작성합니다.
- **남은 공간을 보여 주세요.** 최대 길이를 적용한다면, 판매자가 넘치지 않게 내용을 맞출 수 있도록 남은 글자 수를 보여 줍니다.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

전체 가이드는 [`<s-text-area>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices)(영어)를 참고하세요.
