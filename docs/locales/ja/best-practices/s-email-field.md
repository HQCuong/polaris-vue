- **具体的な `label` を使う。** 「Customer email」や「Order notification email」のような名前は、単なる「Email」や「Email address」よりもわかりやすくなります。
- **`details` で背景を補足する。** 「Required for digital receipts」のように、なぜアドレスが必要なのか、どう使われるのかを説明します。
- **`placeholder` で形式を示す。** 「you@example.com」のようなアドレスの例で入力内容を示します。ラベルを繰り返すだけにはしないでください。
- **`error` メッセージは対処方法がわかるようにする。** 「Enter a valid email address」のように、アドレスの直し方をマーチャントに伝えます。

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

詳しいガイダンスについては、[`<s-email-field>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices)（英語）を参照してください。
