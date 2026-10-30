- **チップは操作ではなく説明に使う。** チップは、コンテンツについてマーチャントに何かを伝えるタグ、ステータス、カテゴリーに適しています。ボタンではないため、クリックや削除が必要なチップには代わりに `SClickableChip` を使います。
- **ラベルは短くする。** 「Featured」や「On sale」のような短いテキストはひと目で読めますが、長いラベルは読み取りを遅くし、途中で切れてしまうこともあります。
- **視覚的な重みをコンテンツに合わせる。** 二次的なメタデータには `color="subdued"` を、通常のタグやカテゴリーにはデフォルトの色を使います。
- **チップは説明する対象の横に置く。** ラベル付けする項目の横に配置し、リストではすべての行で同じ位置に置いて、マーチャントがすばやく見渡せるようにします。
- **役立つときはアイコンを追加する。** `graphic` スロットに `SIcon` を置くと、ステータスやよく知られたカテゴリーを認識しやすくなります。

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

詳しいガイダンスについては、[`<s-chip>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices)（英語）を参照してください。
