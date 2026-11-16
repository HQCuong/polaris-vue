---
title: "useAppBridge() – Shopify App Bridge pour Vue 3"
description: "useAppBridge() pour Vue 3 renvoie l'objet global shopify de Shopify App Bridge, typé ShopifyGlobal, comme dans @shopify/app-bridge-react. Pour les apps Shopify intégrées."
---

# useAppBridge() {#use-app-bridge}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

Le global `shopify` est défini par le script App Bridge. La [référence useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) de Shopify le décrit comme le moyen d'utiliser les API App Bridge comme `toast` et `resourcePicker`.

`useAppBridge()` renvoie l'objet global `shopify`, typé `ShopifyGlobal` :

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

Comme dans `@shopify/app-bridge-react` :

- Côté serveur, il renvoie un objet qui lève une erreur dès que vous lisez une propriété. Appelez les
  API depuis `onMounted()` ou un gestionnaire d'événement.
- Dans le navigateur, il lève une erreur si `shopify` n'est pas défini, ce qui "likely means the App
  Bridge script tag was not added correctly to this page".

Utiliser directement l'objet global `shopify`, comme le fait le guide de l'app intégrée, fonctionne aussi.

## API {#reference}

Les membres de premier niveau de `ShopifyGlobal` dans `@shopify/app-bridge-types`. Les descriptions viennent du JSDoc des types ; quand un membre n'en a pas, du résumé de la page shopify.dev liée.

| Membre | Type | Description |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | La configuration de l'app : `apiKey` (l'ID client de l'app, fourni avec une balise `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` et `shop`. |
| `origin` | `string` | Non décrit dans les types. |
| `ready` | `Promise<void>` | Non décrit dans les types. |
| `setSignals` | `(RealSignal: any) => void` | Enregistre une implémentation de signals, par exemple de `@preact/signals`, pour que les valeurs réactives renvoyées par App Bridge utilisent la classe Signal de l'app au lieu du shim intégré. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` et `intent` : si l'app s'exécute dans l'app Shopify Mobile, est intégrée à l'interface d'administration Shopify, s'exécute dans Shopify POS ou s'exécute comme intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Affiche des indicateurs de chargement pendant les opérations longues. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Génère des jetons d'ID pour l'authentification de serveur à serveur et les requêtes API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Des informations sur le marchand connecté, dont son nom, son e-mail et sa locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` affiche une notification toast dans l'interface d'administration Shopify et renvoie son ID ; `hide(id)` la masque. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permet aux marchands de rechercher et sélectionner des ressources Shopify comme des produits, des collections ou des variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` ouvre la caméra de l'appareil pour scanner un code-barres et se résout en un `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` et `toggle(id)` affichent, masquent ou basculent un modal par son ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` et `toggle(id)` affichent, masquent ou basculent une barre d'enregistrement par son ID ; `leaveConfirmation()` demande au marchand de confirmer avant de quitter la page quand il y a des modifications non enregistrées. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` et `location` : lire et modifier le panier POS actuel, fermer l'app et revenir à l'écran POS, et obtenir des informations sur l'appareil et l'emplacement POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (la requête d'intent actuelle, `null` hors d'un workflow d'intent), `invoke()` pour invoquer un intent, `response` pour en résoudre un, et `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` enregistre un callback qui reçoit les données de performance Web Vitals ; `null` le désenregistre. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` enregistre une fonction qui s'exécute quand le marchand clique sur le bouton d'assistance ; `null` la désenregistre. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` demande un modal d'avis sur l'app, qui ne s'affiche que si les limites de fréquence et les conditions d'éligibilité sont respectées. Le résultat a `success`, `code` et `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` renvoie les scopes d'accès accordés, requis et optionnels de l'app sur la boutique ; `request(scopes)` demande au marchand d'accorder des scopes optionnels ; `revoke(scopes)` révoque des scopes optionnels accordés. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Affiche des interfaces de sélection pour les fichiers, les dates et d'autres types de données courants. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` se résout en la liste des extensions de l'app, avec leurs informations d'état. |
| `shopifyQL` | `ShopifyQLApi` | `available()` et `ready()`. Non décrit autrement dans les types. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Démarre des conversations Sidekick pour le marchand depuis votre app. Il est toujours défini, mais ses méthodes sont rejetées quand Sidekick n'est pas disponible pour l'app ; `isEnabled()` le vérifie. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` et `clear` associent des fonctions de traitement à des outils déjà déclarés dans la configuration de l'extension d'app, que la plateforme peut appeler au nom de l'app. |
