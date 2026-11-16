---
title: "NavMenu (ui-nav-menu) – Vue 3 के लिए App Bridge"
description: "Vue 3 वाले Shopify embedded app का app navigation: Shopify s-app-nav को document करता है, जो raw tag के रूप में काम करता है; NavMenu पुराने App Bridge ui-nav-menu को render करता है।"
---

# App navigation {#app-nav}

App nav Shopify admin में आपके app के navigation items configure करता है, जैसा Shopify का [NavMenu reference](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) बताता है।

Shopify app navigation के लिए `<s-link>` children वाले `<s-app-nav>` को document करता है; देखें
[embedded-app guide](/hi/guide/shopify-embedded-app#app-navigation) और Shopify का
[app nav reference](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)।
इसका भी कोई React component नहीं है; Shopify की
[React migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
इसे सीधे render करने को कहती है। इसलिए इस library में इसके लिए कोई component नहीं है, और raw tag
मौजूदा `s-` वाले `isCustomElement` नियम के साथ काम करता है।

`NavMenu` पुराने `ui-nav-menu` को render करता है, उन apps के लिए जो अब भी इसे इस्तेमाल करते हैं:

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

दोनों में से कोई भी element Vue Router के साथ कैसे काम करता है, यह अभी verify नहीं किया गया है।

## Examples {#examples}

ये examples Shopify के documentation के अनुसार हैं और अभी live admin में test नहीं किए गए हैं।

### आपके Vue Router routes से app nav {#example-app-nav-routes}

इसे admin के app nav और अपने routes को एक ही जगह रखने के लिए इस्तेमाल करें: links route table से render होते हैं।

::: code-group

```ts [router.ts]
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** The label of the route in the app nav. Routes without one are not in the nav. */
    navLabel?: string
  }
}

export const HOME_PATH = '/app'

export const routes: RouteRecordRaw[] = [
  { path: HOME_PATH, component: () => import('./pages/HomePage.vue') },
  {
    path: '/app/templates',
    component: () => import('./pages/TemplatesPage.vue'),
    meta: { navLabel: 'Templates' },
  },
  {
    path: '/app/settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: { navLabel: 'Settings' },
  },
  // Not in the nav: reached from the templates list.
  { path: '/app/templates/:id', component: () => import('./pages/TemplatePage.vue') },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <s-app-nav>
    <s-link :href="HOME_PATH" rel="home">Home</s-link>
    <s-link v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

:::

- Sidebar में app का नाम पहले से `/` से link होता है। Shopify `rel="home"` वाला link तभी जोड़ता है जब home page कहीं और हो, जैसे `/app`; वह link menu से छिपा रहता है ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav))।
- Links nested नहीं हो सकते, और labels छोटे संज्ञा शब्द होने चाहिए, जैसे "Templates" या "Settings" (उसी page से)।
- `createWebHistory()` के साथ Vue Router `history.pushState()` से routes बदलता है, और App Bridge हर नया path admin के address bar को भेजता है ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync))।
- Shopify की [navigation migration guide](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation) कहती है कि direct loads, back और forward, और route बदलने पर active item का साथ चलना जाँचें।

### उन्हीं routes से NavMenu {#example-nav-menu-routes}

इसे तब इस्तेमाल करें जब आपका app अब भी `ui-nav-menu` इस्तेमाल करता है।

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NavMenu } from 'polaris-vue-elements/app-bridge'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <NavMenu>
    <a :href="HOME_PATH" rel="home">Home</a>
    <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
  </NavMenu>
  <RouterView />
</template>
```

- यह पिछले example के `router.ts` का इस्तेमाल करता है। `ui-nav-menu` के children `<a>` elements हैं; types उन्हें इससे ज़्यादा नहीं बताते।

### Shopify admin के pages से link करें {#example-admin-links}

इसे merchant को अपने app से admin में किसी product, order या customer तक भेजने के लिए इस्तेमाल करें।

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SStack } from 'polaris-vue-elements'

const props = defineProps<{ productGid: string }>()

// 'gid://shopify/Product/123' → '123'
const productId = computed(() => props.productGid.split('/').pop() ?? '')
</script>

<template>
  <SStack direction="inline" gap="base">
    <a :href="`shopify://admin/products/${productId}`" target="_top">View in Shopify admin</a>
    <a href="shopify://admin/orders" target="_top">Orders</a>
    <a href="https://help.example.com" target="_blank">Help center</a>
  </SStack>
</template>
```

- `target="_top"` के साथ `shopify:` protocol admin pages खोलता है: index pages जैसे `shopify://admin/orders`, या "by appending the resource ID" (resource ID जोड़कर) कोई resource ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api))।
- `target="_blank"` बाहरी URL को नए tab में खोलता है, और admin खुला रहता है (उसी page से)।

### Code से navigate करें {#example-navigate-from-code}

इसे किसी action के बाद किसी page पर जाने के लिए इस्तेमाल करें, जैसे अभी बनाया गया record खोलना।

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const router = useRouter()

async function createTemplate(): Promise<void> {
  const res = await fetch('/api/templates', { method: 'POST' })
  if (!res.ok) {
    useAppBridge().toast.show('Could not create the template', { isError: true })
    return
  }
  const { id } = (await res.json()) as { id: string }
  await router.push(`/app/templates/${encodeURIComponent(id)}`)
}
</script>

<template>
  <SButton variant="primary" @click="createTemplate">Create template</SButton>
</template>
```

- `router.push()` `history.pushState()` इस्तेमाल करता है, जिसे App Bridge follow करता है। Shopify relative path के लिए `open('/settings', '_self')` भी documented करता है ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api))।
- अगर save bar दिख रहा हो सकता है, तो उसे छिपाएँ या पहले पूछें; देखें [Vue Router के साथ छोड़ने से पहले पूछें](/hi/app-bridge/save-bar#example-leave-confirmation)।

## Props और events {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` में कोई prop नहीं है और यह कोई event emit नहीं करता: `UINavMenuAttributes` सिर्फ़ children define करता है, जिन्हें `NavMenu` अपने default slot से render करता है। Types इन children का वर्णन नहीं करते।

| Slot | विवरण |
| --- | --- |
| `default` | Navigation links, जैसे ऊपर के उदाहरण में `<a href="/" rel="home">`। |

### `s-app-nav` {#reference-app-nav}

Types में `s-app-nav` का कोई attribute नहीं है। इसके children navigation items हैं, जो link elements के रूप में दिए जाते हैं: हर link app के navigation menu में एक item बनाता है, और `rel="home"` वाला एक link default landing page set करता है।

Types इन links के attributes का वर्णन करते हैं:

| Attribute | Type | विवरण |
| --- | --- | --- |
| `href` | `string` (ज़रूरी) | Navigation item का path, आपके app के भीतर relative, जैसे `/products` या `/settings`। Click करने पर app पूरा page reload किए बिना इस route पर जाता है; यह आपके app की routing के किसी route से मेल खाना चाहिए। |
| `rel` | `"home"` | Link को app का default landing page बनाता है। वह link navigation menu में छिपा रहता है, और सिर्फ़ एक link में `rel="home"` होना चाहिए। |
| `children` | `string` | Item का दिखने वाला label। Types छोटे labels (एक या दो शब्द) की सलाह देते हैं जो destination का नाम बताएँ, जैसे "Products" या "Settings"। |
