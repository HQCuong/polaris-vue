- **1 つのバナーで扱うのは 1 つのことだけ。** 各バナーには 1 つのメッセージ、または 1 つの必要なアクションだけを載せ、何についてのバナーなのかマーチャントが迷わないようにします。
- **ざっと読んで伝わるように書く。** テキストは短くし、マーチャントがメッセージと次にすべきことをひと目で把握できるようにします。
- **次のステップを示す。** `tone="info"`、`tone="warning"`、`tone="critical"` のバナーには、どう進めればよいかを具体的に示すコールトゥアクションを含めます。
- **マーチャントがバナーを閉じられるようにする。** メッセージがすぐの対応を必要としない限り `dismissible` を設定し、閉じる手段のないまま画面に残り続けるバナーは避けます。
- **範囲に応じてバナーを配置する。** ページ全体に関するメッセージならバナーをどのセクションの外にも置き、特定のセクションの内容に関するものならそのセクションの中に置きます。

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

詳しいガイダンスについては、[`<s-banner>` に関する Shopify のベストプラクティス](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices)（英語）を参照してください。
