- **各チェックボックスを独立させる。** マーチャントが、あるチェックボックスが別のチェックボックスに影響することなく、任意の組み合わせでオプションを選択できるようにします。
- **すべてのチェックボックスにわかりやすい `label` を付ける。** これはチェックボックスで設定のオン・オフを切り替える場合に特に重要で、マーチャントが何を有効にするのかを正確に把握できるようにします。
- **オプションを論理的な順序で並べる。** アルファベット順、数値順、時系列順などで並べ、マーチャントが目的のオプションをすばやく見つけられるようにします。
- **`indeterminate` は部分的な「すべて選択」に限って使う。** グループ内の一部の項目だけがチェックされているときに、「すべて選択」チェックボックスで使います。
- **補足が役立つときは `details` を追加する。** ラベルだけでは不十分な場合に限り、オプションの働きを追加で説明するために使います。

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

詳しいガイダンスについては、[`<s-checkbox>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices)（英語）を参照してください。
