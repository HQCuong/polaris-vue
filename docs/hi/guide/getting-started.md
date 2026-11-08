---
title: Vue 3 में Shopify Polaris के साथ शुरुआत करें
description: polaris-vue-elements इंस्टॉल करें, Shopify Polaris web components का runtime लोड करें, और Vue app या Shopify app में v-model के साथ SButton और STextField जैसे typed Vue 3 wrappers इस्तेमाल करें।
---

# शुरुआत करें {#getting-started}

`polaris-vue-elements` typed Vue 3 components का एक सेट है, जो Shopify के Polaris web
components (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...) को wrap करता है। Web components
खुद runtime पर Shopify के CDN से लोड होते हैं — यह library बस उनके चारों ओर
एक typed और Vue के अनुकूल interface (props, events, v-model) देती है।

## 1. इंस्टॉल करें {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Polaris runtime लोड करें {#_2-load-the-polaris-runtime}

Wrapper components केवल presentation के लिए हैं — इनमें असली
custom element definitions शामिल नहीं होतीं। आपके host app को Shopify का Polaris runtime
script लोड करना होगा, जो `<s-*>` elements को globally register करता है:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

यह किसी भी Vue app में काम करता है, सिर्फ़ Shopify Admin के अंदर नहीं — components
सामान्य custom elements हैं और जहाँ भी script लोड हो, वहाँ render होते हैं।

`polaris-2.js` Shopify का stable channel है और production के लिए हम इसी की सलाह देते हैं।
इसके बजाय किसी exact release को pin करने के लिए, या यह समझने के लिए कि runtime का version
इस library के version से कैसे जुड़ा है, देखें
[ज्ञात quirks और सावधानियाँ](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)।

### Polaris 2.0 और admin का नया design {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 Shopify admin का नया visual design (रंग, typography,
spacing और icons) लाता है। यह 22 अक्टूबर 2026 को stable हुआ
([घोषणा](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable))।
1.x से आगे बढ़ना वैकल्पिक है: `polaris-1.js` की जगह `polaris-2.js` लगाएँ।

- **Code में कोई बदलाव ज़रूरी नहीं।** 2.0 एक visual update है: इसके components, props,
  events और slots वही हैं जो 1.1 में हैं, साथ में कुछ नई चीज़ें (जैसे
  `SThumbnail` का `loading` prop)। जो apps `polaris-1.js` पर रहते हैं, वे इन wrappers के साथ
  काम करते रहेंगे; सिर्फ़ नई चीज़ों के लिए runtime पर 2.x चाहिए।
- **यह हर store के design का पालन करता है।** Shopify admin के अंदर, जिस store में
  admin का नया design है उसे नया look मिलता है, और पुराने design वाला store
  1.x look ही रखता है। Admin के बाहर, नया look default रूप से इस्तेमाल होता है, जिससे
  local preview करना आसान हो जाता है।
- **Viewport के निचले हिस्से के पास fixed या sticky content** को
  `--shopify-safe-area-inset-bottom` CSS variable से जगह छोड़नी चाहिए
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  ताकि floating Sidekick bar उसे ढक न दे।
- **Built for Shopify apps** को **1 मई 2027** तक admin की नई visual style
  से मेल खाना होगा।

## 3. Vite कॉन्फ़िगर करें {#_3-configure-vite}

Vue के compiler को बताएँ कि किसी भी `s-*` tag को Vue component के रूप में resolve करने की
कोशिश करने के बजाय custom element माने:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 4. आपका पहला component {#_4-your-first-component}

`polaris-vue-elements` से components import करें और उन्हें किसी भी दूसरे Vue
component की तरह इस्तेमाल करें — props और events पूरी तरह typed हैं:

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. Form components पर v-model {#_5-v-model-on-form-components}

Form जैसे components `v-model` सपोर्ट करते हैं, जो उस element के सही underlying
prop/event जोड़े से map होता है (पूरी mapping के लिए `src/lib/overrides.ts` देखें —
text जैसे fields `value`/`input` इस्तेमाल करते हैं, `SCheckbox`/`SSwitch`
`checked`/`change` इस्तेमाल करते हैं, `SChoiceList` `values`/`change` इस्तेमाल करता है, आदि):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. Overlays को नियंत्रित करना (modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

`SModal` जैसे overlay components को दो तरीक़ों से नियंत्रित किया जा सकता है:

**Declarative तरीक़े से**, trigger button पर standard HTML `commandFor`/`command` attributes
के साथ — किसी script की ज़रूरत नहीं:

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**Imperative तरीक़े से**, एक typed template ref लेकर और `$el` के ज़रिए underlying
element का method call करके:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. Raw `<s-*>` tags को type करना (वैकल्पिक) {#_7-typing-raw-s-tags-optional}

अगर आप wrappers पर जाने के बजाय Polaris के अपने tags (`<s-button>`, `<s-text-field>`, …)
ही लिखते रहना चाहते हैं, तो package उन्हें भी type कर सकता है। इसे एक बार, अपने
`tsconfig.json` में चालू करें:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

या `env.d.ts` जैसी किसी `.d.ts` file में reference के ज़रिए:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

इससे हर Polaris tag Vue के `GlobalComponents` में जुड़ जाता है, ताकि Volar और `vue-tsc`
raw tags को उसी तरह check करें जैसे wrappers को करते हैं: union-typed props, typed `@click` /
`@aftershow` listeners, और imperative methods के लिए एक typed element।

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

यह सिर्फ़ types है: runtime पर कुछ भी register नहीं होता, इसलिए step 3 वाली `isCustomElement`
setting बनाए रखें। Wrappers से दो अंतर:

- **Raw tags पर `v-model` नहीं है।** `:value` को bind करें और `@input` / `@change`
  खुद सुनें, या wrapper component इस्तेमाल करें, जो हर form field की property और
  event को आपके लिए map करता है।
- **इसे अपने project में उन्हीं tags के लिए हाथ से लिखे shim के साथ न मिलाएँ** —
  अलग-अलग types वाले `GlobalComponents['s-button']` के दो declarations आपस में टकराते हैं।
  इसे चालू करते समय shim हटा दें।

## अगले कदम {#next-steps}

हर wrapper की props/events की पूरी सूची के लिए [component reference](/hi/components/)
देखें, या खुद इनसे टकराने से पहले [ज्ञात quirks और सावधानियाँ](/hi/guide/quirks)
पढ़ें।

Shopify app बना रहे हैं? Vue से App Bridge लोड करने, authenticated requests भेजने और App Bridge APIs
इस्तेमाल करने के लिए [Vue 3 के साथ Shopify embedded app बनाएँ](/hi/guide/shopify-embedded-app) देखें।
