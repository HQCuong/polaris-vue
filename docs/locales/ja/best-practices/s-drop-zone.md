- **`accept` でファイルの制限を示す。** ドロップゾーンが受け付けるファイル形式に明確な制限を設定します。
- **`droprejected` には役立つメッセージで対応する。** ファイルが検証に失敗したときは、このイベントをリッスンし、何が問題だったのかをマーチャントに伝えます。
- **処理中は `disabled` を検討する。** アップロード中にドロップゾーンを無効にすると、その間にマーチャントがさらにファイルを追加するのを防げます。

```vue
<SDropZone label="Product images" accept="image/*" />
```

詳しいガイダンスについては、[`<s-drop-zone>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices)（英語）を参照してください。
