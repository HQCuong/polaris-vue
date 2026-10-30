- **意味に合った `type` を選ぶ。** 重要な語句を示すには `"strong"`、郵便の住所やメールアドレスには `"address"`、同じ内容がすでに画面上に表示されている場合にスクリーンリーダーのユーザーに文脈を伝えるテキストには `"redundant"` を選びます。適切な type を選ぶことで、支援技術がテキストの意味を伝えられるようになります。
- **強調は控えめにする。** `type="strong"` は文全体ではなく、文中の重要な語や数値に適用します。強調が多すぎると効果が薄れ、テキストが読み取りにくくなります。
- **インラインのステータスにはトーンを使う。** `"critical"`、`"success"`、`"caution"` のようなトーンはステータスに注目を集めますが、色だけにメッセージを担わせず、明確な文言と組み合わせます。
- **重要なものを目立たなくしない。** `color="subdued"` はタイムスタンプやメタデータに適していますが、マーチャントが必ず読むべき重要な情報には使わないでください。

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

詳しいガイダンスについては、[`<s-text>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices)（英語）を参照してください。
