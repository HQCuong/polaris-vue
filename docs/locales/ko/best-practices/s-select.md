- **정해진 선택지에 사용하세요.** select는 판매자가 미리 정의된 목록에서 고를 때 적합합니다. 판매자가 직접 값을 입력하거나 긴 목록을 뒤져야 한다면, 입력하는 동안 일치 항목을 제안하는 텍스트 필드나 검색할 수 있는 드롭다운이 더 잘 맞습니다.
- **옵션 순서를 의도적으로 정하세요.** 관련 옵션을 묶거나, 가장 많이 쓰는 옵션을 먼저 두거나, 자연스러운 순서가 없다면 알파벳순으로 정렬해 판매자가 원하는 항목을 빨리 찾게 합니다.
- **훑어보기 쉬운 레이블을 작성하세요.** 각 옵션에 충분한 맥락을 담아, 판매자가 여러 옵션을 열어 읽어 보지 않고도 구분할 수 있게 합니다.
- **초기 상태를 의도적으로 고르세요.** 명확한 기본값이 있다면 옵션을 미리 선택하고, 판매자가 신중하게 골라야 한다면 `placeholder`를 사용합니다. 초기 상태를 모호하게 두지 마세요.
- **검증 문제를 설명하세요.** 선택이 필수이거나 유효하지 않을 때 `error`로 판매자가 무엇을 해야 하는지 구체적으로 알려 줍니다. 상황에 맞는 메시지는 일반적인 메시지보다 폼을 더 빨리 완료하도록 돕습니다.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

전체 가이드는 [`<s-select>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices)(영어)를 참고하세요.
