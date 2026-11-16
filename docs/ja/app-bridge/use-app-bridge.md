---
title: "useAppBridge() – Vue 3 向け Shopify App Bridge"
description: "Vue 3 の useAppBridge() は、@shopify/app-bridge-react と同様に Shopify App Bridge の shopify グローバルを ShopifyGlobal 型で返します。Shopify 埋め込みアプリ向けです。"
---

# useAppBridge() {#use-app-bridge}

`shopify` グローバルは App Bridge スクリプトが定義します。Shopify の [useAppBridge リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge)では、`toast` や `resourcePicker` などの App Bridge API を使うための手段として説明されています。

`useAppBridge()` は `shopify` グローバルを返します。型は `ShopifyGlobal` です。

```vue
<script setup lang="ts">
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const shopify = useAppBridge()

function generate(): void {
  shopify.toast.show('Blog post template generated')
}
</script>

<template>
  <button @click="generate">Generate blog post</button>
</template>
```

`@shopify/app-bridge-react` と同様です。

- サーバー上では、いずれかのプロパティを読み取ると例外を投げるオブジェクトを返します。API は
  `onMounted()` またはイベントハンドラーから呼び出してください。
- ブラウザーでは、`shopify` が定義されていない場合に例外を投げます。これは "likely means the App
  Bridge script tag was not added correctly to this page" ということです。

埋め込みアプリガイドのように `shopify` グローバルを直接使うこともできます。

## API {#reference}

`@shopify/app-bridge-types` の `ShopifyGlobal` のトップレベルのメンバーです。説明は型の JSDoc から、JSDoc がないメンバーはリンク先の shopify.dev ページの概要から取っています。

| メンバー | 型 | 説明 |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | アプリの設定：`apiKey`（`<meta name="shopify-api-key">` タグで指定するアプリのクライアント ID）、`appOrigins`、`debug`、`disabledFeatures`、`host`、`locale`、`shop`。 |
| `origin` | `string` | 型に説明はありません。 |
| `ready` | `Promise<void>` | 型に説明はありません。 |
| `setSignals` | `(RealSignal: any) => void` | シグナルの実装（例：`@preact/signals`）を登録し、App Bridge が返すリアクティブな値が組み込みの shim ではなくアプリ自身の Signal クラスを使うようにします。 |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`、`embedded`、`pos`、`intent`：アプリが Shopify Mobile アプリで動作しているか、Shopify 管理画面に埋め込まれているか、Shopify POS で動作しているか、インテントとして動作しているか。 |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | 時間のかかる処理の間、読み込みインジケーターを表示します。 |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | サーバー間認証と API リクエスト用の ID トークンを生成します。 |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | ログイン中のマーチャントの情報（名前、メールアドレス、ロケールなど）。 |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` は Shopify 管理画面にトースト通知を表示してその ID を返し、`hide(id)` はそれを非表示にします。 |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | マーチャントが商品、コレクション、バリエーションなどの Shopify リソースを検索して選択できるようにします。 |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` はバーコードをスキャンするためにデバイスのカメラを開き、`ScannerPayload` で resolve されます。 |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`、`hide(id)`、`toggle(id)` は ID を指定してモーダルを表示、非表示、切り替えします。 |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`、`hide(id)`、`toggle(id)` は ID を指定して保存バーを表示、非表示、切り替えします。`leaveConfirmation()` は未保存の変更があるとき、ページを離れる前にマーチャントに確認を求めます。 |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`、`close`、`device`、`location`：現在の POS カートの読み取りと変更、アプリを閉じて POS 画面に戻ること、POS デバイスとロケーションの情報の取得。 |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request`（現在のインテントリクエスト。インテントのワークフロー外では `null`）、インテントを呼び出す `invoke()`、インテントを完了する `response`、そして `register()`。 |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` は Web Vitals のパフォーマンスデータを受け取るコールバックを登録します。`null` で登録を解除します。 |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` はマーチャントがサポートボタンをクリックしたときに実行する関数を登録します。`null` で登録を解除します。 |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` はアプリレビューのモーダルを要求します。このモーダルは頻度の制限と資格条件を満たす場合にのみ表示されます。結果には `success`、`code`、`message` があります。 |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` はショップでアプリに付与済み、必須、任意のアクセススコープを返し、`request(scopes)` はマーチャントに任意のスコープの付与を求め、`revoke(scopes)` は付与済みの任意のスコープを取り消します。 |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | ファイル、日付、その他の一般的なデータ型の選択インターフェースを表示します。 |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` はアプリの拡張機能の一覧とそのステータス情報で resolve されます。 |
| `shopifyQL` | `ShopifyQLApi` | `available()` と `ready()`。それ以外は型に説明がありません。 |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | アプリからマーチャントのために Sidekick の会話を開始します。常に定義されていますが、アプリで Sidekick を利用できない場合はメソッドが reject されます。`isEnabled()` でこれを確認します。 |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`、`unregister`、`clear` は、アプリ拡張機能の設定で宣言済みのツールにハンドラー関数を結び付けます。プラットフォームはアプリに代わってそれらを呼び出せます。 |
