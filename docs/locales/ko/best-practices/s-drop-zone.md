- **`accept`로 파일 제한을 명시하세요.** drop zone이 받는 파일 형식에 명확한 제한을 둡니다.
- **`droprejected`를 처리하고 도움이 되는 메시지를 보여 주세요.** 파일이 검증에 실패하면 이벤트를 수신해 판매자에게 무엇이 잘못되었는지 알려 줍니다.
- **처리 중에는 `disabled`를 고려하세요.** 업로드 중에 drop zone을 비활성화하면 판매자가 그 사이에 파일을 더 추가하는 것을 막을 수 있습니다.

```vue
<SDropZone label="Product images" accept="image/*" />
```

전체 가이드는 [`<s-drop-zone>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices)(영어)를 참고하세요.
