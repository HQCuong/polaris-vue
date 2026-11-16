---
title: "useAppBridge() – Shopify App Bridge für Vue 3"
description: "useAppBridge() für Vue 3 gibt das globale shopify von Shopify App Bridge zurück, typisiert als ShopifyGlobal, wie in @shopify/app-bridge-react. Für eingebettete Shopify-Apps."
---

# useAppBridge() {#use-app-bridge}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

Das globale Objekt `shopify` wird vom App-Bridge-Skript definiert. Shopifys [useAppBridge-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) beschreibt es als den Weg, App-Bridge-APIs wie `toast` und `resourcePicker` zu verwenden.

`useAppBridge()` gibt das globale Objekt `shopify` zurück, typisiert als `ShopifyGlobal`:

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

Wie in `@shopify/app-bridge-react`:

- Auf dem Server gibt es ein Objekt zurück, das beim Lesen jeder Eigenschaft einen Fehler wirft. Rufen Sie die
  APIs aus `onMounted()` oder einem Event-Handler auf.
- Im Browser wirft es einen Fehler, wenn `shopify` nicht definiert ist, was "likely means the App
  Bridge script tag was not added correctly to this page".

Das globale `shopify` direkt zu verwenden, wie es die Anleitung zu eingebetteten Apps tut, funktioniert ebenfalls.

## API {#reference}

Die Mitglieder der obersten Ebene von `ShopifyGlobal` in `@shopify/app-bridge-types`. Die Beschreibungen stammen aus dem JSDoc der Typen; wo ein Mitglied keines hat, aus der Zusammenfassung auf der verlinkten shopify.dev-Seite.

| Mitglied | Typ | Beschreibung |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | Die Konfiguration der App: `apiKey` (die Client-ID der App, angegeben mit einem `<meta name="shopify-api-key">`-Tag), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` und `shop`. |
| `origin` | `string` | In den Typen nicht beschrieben. |
| `ready` | `Promise<void>` | In den Typen nicht beschrieben. |
| `setSignals` | `(RealSignal: any) => void` | Registriert eine Signals-Implementierung, zum Beispiel aus `@preact/signals`, damit reaktive Werte, die App Bridge zurückgibt, die eigene Signal-Klasse der App statt des eingebauten Shims verwenden. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` und `intent`: ob die App in der Shopify-Mobile-App läuft, im Shopify-Adminbereich eingebettet ist, in Shopify POS läuft oder als Intent läuft. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Zeigt Ladeindikatoren während lang laufender Vorgänge an. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Erzeugt ID-Tokens für die Server-zu-Server-Authentifizierung und API-Anfragen. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Informationen über den angemeldeten Händler, darunter Name, E-Mail-Adresse und Locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` zeigt eine Toast-Benachrichtigung im Shopify-Adminbereich an und gibt ihre ID zurück; `hide(id)` blendet sie aus. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Lässt Händler Shopify-Ressourcen wie Produkte, Kollektionen oder Varianten suchen und auswählen. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` öffnet die Kamera des Geräts, um einen Barcode zu scannen, und wird mit einem `ScannerPayload` aufgelöst. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` und `toggle(id)` zeigen, verbergen oder wechseln ein Modal anhand seiner ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` und `toggle(id)` zeigen, verbergen oder wechseln eine Speicherleiste anhand ihrer ID; `leaveConfirmation()` bittet den Händler bei ungespeicherten Änderungen um Bestätigung, bevor er die Seite verlässt. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` und `location`: den aktuellen POS-Warenkorb lesen und ändern, die App schließen und zum POS-Bildschirm zurückkehren sowie Informationen über das POS-Gerät und den Standort abrufen. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (die aktuelle Intent-Anfrage, `null` außerhalb eines Intent-Ablaufs), `invoke()` zum Aufrufen eines Intents, `response` zum Abschließen eines Intents und `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registriert einen Callback, der Web-Vitals-Leistungsdaten erhält; `null` hebt die Registrierung auf. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registriert eine Funktion, die ausgeführt wird, wenn der Händler auf die Support-Schaltfläche klickt; `null` hebt die Registrierung auf. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` fordert ein Modal zur App-Bewertung an, das nur angezeigt wird, wenn Ratenlimits und Teilnahmebedingungen erfüllt sind. Das Ergebnis hat `success`, `code` und `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` gibt die gewährten, erforderlichen und optionalen Zugriffsbereiche der App im Shop zurück; `request(scopes)` bittet den Händler, optionale Bereiche zu gewähren; `revoke(scopes)` widerruft gewährte optionale Bereiche. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Zeigt Auswahloberflächen für Dateien, Daten und andere gängige Datentypen an. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` wird mit den Erweiterungen der App und ihren Statusinformationen aufgelöst. |
| `shopifyQL` | `ShopifyQLApi` | `available()` und `ready()`. Sonst in den Typen nicht beschrieben. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Startet Sidekick-Unterhaltungen für den Händler aus Ihrer App. Es ist immer definiert, aber seine Methoden werden abgelehnt (reject), wenn Sidekick für die App nicht verfügbar ist; `isEnabled()` prüft das. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` und `clear` binden Handler-Funktionen an Tools, die bereits in der Konfiguration der App-Erweiterung deklariert sind und die die Plattform im Namen der App aufrufen kann. |
