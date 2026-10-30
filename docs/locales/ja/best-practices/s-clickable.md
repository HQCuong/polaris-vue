- **表示テキストのない要素にはラベルを付ける。** クリック可能な領域の中に読み取れるテキストがない場合は、`accessibilityLabel` を設定して、スクリーンリーダーのユーザーに何のための要素かを伝えます。
- **用途に合ったモードを選ぶ。** アクションを実行するにはボタンとして使い、ナビゲーションには `href` を指定し、フォームを送信する場合は `type="submit"` を設定します。
- **無効状態の理由を説明する。** `disabled` を設定するときは、その状態を視覚的にはっきり示し、要素が使えない理由をマーチャントに伝えるテキストを添えます。

詳しいガイダンスについては、[`<s-clickable>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable#best-practices)（英語）を参照してください。
