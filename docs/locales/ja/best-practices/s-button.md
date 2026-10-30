- **明確な動詞でラベルを付ける。** 「Save」「Edit」「Add tags」のように、ボタンが何をするのかを正確に示します。センテンスケースを使い、「a」や「the」のような不要な語は省き、句読点も付けません。
- **`tone="critical"` は破壊的なアクションのためにとっておく。** 元に戻すのが難しい、または不可能なアクションにだけ使い、一般的にはアクションの重要度に合わせてトーンを選びます。
- **階層をはっきりさせる。** メインのアクションには `variant="primary"`、補助的なアクションには `variant="secondary"`、付加的なものには `variant="tertiary"` を付け、どのアクションが最も重要かをマーチャントが判断できるようにします。
- **ボタンを一貫した位置に置く。** アプリ全体で同じ場所にボタンを配置し、マーチャントがどこを見ればよいか覚えられるようにします。
- **アイコンのみのボタンにはラベルを付ける。** ボタンにアイコンがあってテキストがない場合は、何をするボタンかをスクリーンリーダーのユーザーに伝える `accessibilityLabel` を設定します。

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

詳しいガイダンスについては、[`<s-button>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices)（英語）を参照してください。
