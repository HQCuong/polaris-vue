- **順序に意味があるときに使う。** 番号付きリストは順序、優先度、ランキングを伝えるため、手順の説明やランク付けされたおすすめに適しています。順序が関係ない場合は、代わりに `SUnorderedList` を使います。
- **項目の書き方をそろえる。** すべての項目の文法と構造をそろえ、リストを読みやすくします。項目ごとにスタイルが変わると、読み手の負担が増えます。
- **各項目を短くする。** リストが役立つのは、すばやく見渡せるからです。項目が長くなったり込み入ったりする場合は、それぞれ独立したセクションに分けることを検討します。
- **ネストを深くしすぎない。** 1 段階のネストは関連する要点の整理に役立ちますが、2 段階を超えると追いにくくなり、コンテンツに別の構造が必要であることを示しています。

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

詳しいガイダンスについては、[`<s-ordered-list>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices)（英語）を参照してください。
