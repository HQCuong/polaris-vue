- **時間のかかる非同期処理で表示する。** フォームの保存、データの取得、アクションの処理などに約 500ms 以上かかる場合にスピナーを使います。すぐに終わるアクションでは、スピナーは一瞬ちらつくだけで気が散ります。
- **読み込み中の部分に限定する。** インターフェース全体をブロックするのではなく、保存中のボタンやデータを取得中のセクションなど、読み込み中のページの部分にスピナーを置きます。
- **何を読み込んでいるのかを示す。** 必ず `accessibilityLabel` を「Loading products」や「Saving changes」のように設定し、スクリーンリーダーのユーザーが何が起きているかを把握できるようにします。
- **終わったら結果を伝える。** スピナーが消えたら、成功またはエラーのメッセージをはっきり表示し、処理が完了したことと、その結果をマーチャントに伝えます。

```vue
<SSpinner accessibilityLabel="Loading products" />
```

詳しいガイダンスについては、[`<s-spinner>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices)（英語）を参照してください。
