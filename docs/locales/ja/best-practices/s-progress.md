- **測定できる処理に使う。** 処理を全体の一部として表せる場合はプログレスバーを使います。完了までの時間や進捗状況がわからない場合は、スピナーのほうが軽い選択肢です。
- **何が進行中なのかを示す。** `accessibilityLabel` には、「Importing products」や「Storage used」のような正確な説明を設定します。スクリーンリーダーはこのラベルでバーを読み上げ、省略した場合のデフォルトはありません。
- **数値が重要なときはテキストを添える。** バー自体にはラベルもパーセンテージも表示されないため、マーチャントが数値を必要とする場合は横にテキストを置き、そのテキストを `value` と同期させます。
- **`max` には実際の合計を設定する。** すべてをパーセンテージに変換するのではなく、ファイルの数やクォータの大きさなど、実際の件数や上限を使います。そうすれば、処理が進むにつれて `value` を簡単に更新できます。
- **トーンは問題を示すときだけ使う。** `tone="critical"` と `tone="warning"` は、上限に達したなど、問題を示す進捗のためにとっておきます。通常の進行中の処理はデフォルトのトーンのままにします。

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

詳しいガイダンスについては、[`<s-progress>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices)（英語）を参照してください。
