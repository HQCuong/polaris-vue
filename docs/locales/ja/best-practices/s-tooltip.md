- **ツールチップは必須ではない補足情報に使う。** 理解を深めるものの、必須ではない情報に適しています。エラー、重要な情報、必須の手順をツールチップの中に隠さないでください。
- **アイコンのみのボタンと組み合わせる。** アイコンボタンには、何をするのかを説明するツールチップが必要です。アクションと、キーボードショートカットがあればそれも含めます。
- **テキストは簡潔にする。** 短いフレーズか 1 文が理想です。内容が長くなる場合は、UI 上のもっと目立つ場所に置くべきでしょう。
- **ツールチップが多いのは危険信号と考える。** インターフェースを理解するのにツールチップが大量に必要なら、代わりにラベル、レイアウト、情報設計を改善します。
- **タッチデバイスを忘れない。** ツールチップはデスクトップでしか機能せず、タッチスクリーンでは表示されないため、モバイルでは重要な情報をデフォルトで表示します。

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

詳しいガイダンスについては、[`<s-tooltip>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices)（英語）を参照してください。
