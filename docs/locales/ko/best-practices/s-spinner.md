- **느린 비동기 작업에 표시하세요.** 폼 저장, 데이터 가져오기, 액션 처리처럼 약 500ms보다 오래 걸리는 작업에 spinner를 사용합니다. 즉시 끝나는 액션에서는 spinner가 깜빡이기만 하고 주의를 흐트러뜨립니다.
- **로딩 중인 부분에만 국한하세요.** 인터페이스 전체를 막지 말고, 저장 중인 버튼이나 데이터를 가져오는 섹션처럼 페이지에서 로딩 중인 부분에 spinner를 둡니다.
- **무엇을 로딩 중인지 밝히세요.** 항상 "Loading products"나 "Saving changes"처럼 `accessibilityLabel`을 설정해 스크린 리더 사용자가 무슨 일이 일어나는지 알 수 있게 합니다.
- **끝난 뒤에는 결과를 알려 주세요.** spinner가 사라지면 명확한 성공 또는 오류 메시지를 보여 줘 판매자가 작업이 끝났는지, 어떻게 되었는지 알 수 있게 합니다.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

전체 가이드는 [`<s-spinner>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices)(영어)를 참고하세요.
