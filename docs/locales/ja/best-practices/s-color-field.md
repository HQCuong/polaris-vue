- **色の用途を明示する。** 汎用的な「Color」ではなく、「Button background color」や「Heading text color」のような `label` を使います。
- **編集時は現在の色を表示する。** `value` に既存の色を設定し、マーチャントが何から変更するのかを確認できるようにします。

```vue
<SColorField label="Button background color" value="#1a1a1a" />
```

詳しいガイダンスについては、[`<s-color-field>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field#best-practices)（英語）を参照してください。
