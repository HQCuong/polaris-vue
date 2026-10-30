- **コンテキストに合わせてサイズを選ぶ。** テーブルのセル、リスト項目、複数のバッジが並ぶ場所では `size="base"` を使います。`size="large"` は、ページ上部に表示するメインのステータスなど、強調すべき単独のバッジに限って使います。
- **ラベルは 1〜2 語に収める。** 「Fulfilled」や「Out of stock」のような短いラベルはすばやく読み取れます。ステータスは過去形で書き、「Refund」ではなく「Refunded」とします。
- **ステータスに合ったトーンを使う。** 対応が必要なエラーや緊急の問題には `tone="critical"`、注意が必要な問題には `tone="warning"`、肯定的な確認には `tone="success"`、中立的なステータスには `tone="info"` を使います。同じステータスには、アプリ全体で同じトーンを使います。
- **バッジは説明する対象の近くに置く。** リスト項目ではタイトルの近くにバッジを置きます。テーブルではバッジ専用の列を設け、マーチャントがひと目で確認できるようにします。
- **バッジはシステムのステータスにだけ使う。** バッジはシステムが設定する静的なインジケーターです。マーチャントが作成するタグや、削除できる項目には使わないでください。

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

詳しいガイダンスについては、[`<s-badge>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices)（英語）を参照してください。
