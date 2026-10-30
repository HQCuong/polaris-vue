- **囲むのは数値だけにする。** 数値そのものを `SNumber` に入れ、その前後の言葉は `SText` または `SParagraph` に残します。等幅数字は数値をきれいにそろえますが、通常の単語は不ぞろいに見えてしまいます。
- **値の書式はアプリ側で先に整える。** `SNumber` が制御するのは数字の見た目であり、値の書式ではありません。マーチャントのロケールに合わせて、通貨記号、小数点、桁区切りは自分で追加します。
- **トーンは数値にステータスがあるときだけ使う。** 在庫切れのように、数値そのものが何かを示す場合に `tone` を設定します。すべての数値にトーンを付けると、どれも目立たなくなります。
- **重要度に応じて数値のサイズを変える。** 合計のように、マーチャントが最初に読むべき数値には大きめの `fontSize` を設定し、二次的な数値はデフォルトのサイズのままにします。

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

詳しいガイダンスについては、[`<s-number>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices)（英語）を参照してください。
