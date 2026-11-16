---
title: "useAppBridge() – Shopify App Bridge para Vue 3"
description: "useAppBridge() para Vue 3 devuelve el global shopify de Shopify App Bridge, tipado como ShopifyGlobal, como en @shopify/app-bridge-react. Para apps integradas de Shopify."
---

# useAppBridge() {#use-app-bridge}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install).

El global `shopify` lo define el script de App Bridge. La [referencia de useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) de Shopify lo describe como la forma de usar las API de App Bridge como `toast` y `resourcePicker`.

`useAppBridge()` devuelve el global `shopify`, tipado como `ShopifyGlobal`:

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

Igual que en `@shopify/app-bridge-react`:

- En el servidor devuelve un objeto que lanza un error al leer cualquier propiedad. Llama a las
  API desde `onMounted()` o desde un manejador de eventos.
- En el navegador lanza un error si `shopify` no está definido, lo que "likely means the App
  Bridge script tag was not added correctly to this page".

También funciona usar directamente el global `shopify`, como hace la guía de apps integradas.

## API {#reference}

Los miembros de nivel superior de `ShopifyGlobal` en `@shopify/app-bridge-types`. Las descripciones vienen del JSDoc de los tipos; cuando un miembro no tiene, del resumen de la página de shopify.dev enlazada.

| Miembro | Tipo | Descripción |
| --- | --- | --- |
| [`config`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/config-api) | `AppBridgeConfig` | La configuración de la app: `apiKey` (el client ID de la app, proporcionado con una etiqueta `<meta name="shopify-api-key">`), `appOrigins`, `debug`, `disabledFeatures`, `host`, `locale` y `shop`. |
| `origin` | `string` | No se describe en los tipos. |
| `ready` | `Promise<void>` | No se describe en los tipos. |
| `setSignals` | `(RealSignal: any) => void` | Registra una implementación de signals, por ejemplo de `@preact/signals`, para que los valores reactivos que devuelve App Bridge usen la clase Signal de la propia app en lugar del shim integrado. |
| [`environment`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api) | `EnvironmentApi` | `mobile`, `embedded`, `pos` e `intent`: si la app se ejecuta en la app Shopify Mobile, está incrustada en el admin de Shopify, se ejecuta en Shopify POS o se ejecuta como intent. |
| [`loading`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/loading-api) | `LoadingApi` | Muestra indicadores de carga durante operaciones largas. |
| [`idToken`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/id-token-api) | `IdTokenApi` | Genera tokens de ID para la autenticación de servidor a servidor y las solicitudes a la API. |
| [`user`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/user-api) | `UserApi` | Información sobre el comerciante que ha iniciado sesión, incluidos su nombre, correo electrónico y locale. |
| [`toast`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) | `ToastApi` | `show(message, opts)` muestra una notificación toast en el admin de Shopify y devuelve su ID; `hide(id)` la oculta. |
| [`resourcePicker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/resource-picker-api) | `ResourcePickerApi` | Permite a los comerciantes buscar y seleccionar recursos de Shopify como productos, colecciones o variantes. |
| [`scanner`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/scanner-api) | `ScannerApi` | `capture()` abre la cámara del dispositivo para escanear un código de barras y se resuelve en un `ScannerPayload`. |
| [`modal`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/modal-api) | `ModalApi` | `show(id)`, `hide(id)` y `toggle(id)` muestran, ocultan o alternan un modal por su ID. |
| [`saveBar`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api) | `SaveBarApi` | `show(id)`, `hide(id)` y `toggle(id)` muestran, ocultan o alternan una barra de guardado por su ID; `leaveConfirmation()` pide al comerciante que confirme antes de salir de la página cuando hay cambios sin guardar. |
| [`pos`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/pos-api) | `PosApi` | `cart`, `close`, `device` y `location`: leer y cambiar el carrito POS actual, cerrar la app y volver a la pantalla de POS, y obtener información sobre el dispositivo y la ubicación de POS. |
| [`intents`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/intents-api) | `IntentsApi` | `request` (la solicitud de intent actual, `null` fuera de un flujo de intent), `invoke()` para invocar un intent, `response` para resolverlo y `register()`. |
| [`webVitals`](https://shopify.dev/docs/api/app-home/latest/apis/device-and-platform-integration/web-vitals-api) | `WebVitalsApi` | `onReport(callback)` registra un callback que recibe datos de rendimiento de Web Vitals; `null` lo da de baja. |
| [`support`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/support-api) | `SupportApi` | `registerHandler(callback)` registra una función que se ejecuta cuando el comerciante hace clic en el botón de soporte; `null` la da de baja. |
| [`reviews`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/reviews-api) | `ReviewsApi` | `request()` solicita un modal de reseña de la app, que solo se muestra si se cumplen los límites de frecuencia y las condiciones de elegibilidad. El resultado tiene `success`, `code` y `message`. |
| [`scopes`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/scopes-api) | `Scopes` | `query()` devuelve los scopes de acceso concedidos, obligatorios y opcionales de la app en la tienda; `request(scopes)` pide al comerciante que conceda scopes opcionales; `revoke(scopes)` revoca scopes opcionales concedidos. |
| [`picker`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/picker-api) | `PickerApi` | Muestra interfaces de selección para archivos, fechas y otros tipos de datos comunes. |
| [`app`](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api) | `AppApi` | `extensions()` se resuelve en las extensiones de la app, con su información de estado. |
| `shopifyQL` | `ShopifyQLApi` | `available()` y `ready()`. Por lo demás, no se describe en los tipos. |
| [`sidekick`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/sidekick-api) | `SidekickApi` | Inicia conversaciones de Sidekick para el comerciante desde tu app. Siempre está definido, pero sus métodos se rechazan cuando Sidekick no está disponible para la app; `isEnabled()` lo comprueba. |
| [`tools`](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/tools-api) | `Tools` | `register`, `unregister` y `clear` vinculan funciones manejadoras a herramientas ya declaradas en la configuración de la extensión de la app, que la plataforma puede llamar en nombre de la app. |
