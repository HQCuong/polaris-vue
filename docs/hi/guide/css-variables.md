---
title: Shopify Polaris CSS variables और design tokens (web components)
description: Shopify web components runtime में परिभाषित हर Polaris design token, live previews, search और copy के साथ। अपने app के CSS के लिए इन्हें tokens.css के रूप में import करें।
schema: TechArticle
---

# Polaris CSS variables (design tokens) {#css-variables}

Polaris web components अपनी styling ख़ुद करते हैं, लेकिन आमतौर पर आपके app का भी कुछ अपना CSS
होता है: page grid, कोई custom card, chart का legend, दो components के बीच का gap। Polaris CSS
variables की मदद से वह CSS आसपास के components जैसे ही colors, spacing, radii और fonts
इस्तेमाल कर सकता है, ताकि वह अंदाज़े से hard-code की गई values के बजाय admin के design से
मेल खाए।

`polaris-vue-elements` इन्हें एक ही stylesheet, `tokens.css`, के रूप में देता है, जो आपके app
द्वारा लोड किए जाने वाले Polaris runtime से निकाली गई है।

::: warning अनौपचारिक
Shopify, Polaris web components के लिए CSS variables की कोई सूची प्रकाशित नहीं करता। ये नाम और
values Shopify के runtime (`polaris-2.js`) से निकाली गई हैं, इसलिए values CDN के साथ बदलती हैं,
और अगर Shopify किसी नाम को बदल दे तो वह नाम बदल या ग़ायब हो सकता है। इस सूची की हर दिन जाँच
होती है (देखें [यह कैसे up to date रहती है](#how-it-stays-up-to-date))।
:::

## इन्हें कब इस्तेमाल करें {#when-to-use}

- **करें:** इन्हें उन elements के लिए इस्तेमाल करें जो आपके app के अपने हैं: wrappers, layout
  containers, custom widgets, और वह text जिसे आप Polaris components के बाहर render करते हैं।
- **न करें:** इनसे Polaris components को restyle करने की कोशिश न करें। हर component अपने
  shadow root के अंदर render होता है, इसलिए अपने page पर `--p-color-bg-fill-brand` set करने से
  `<SButton>` का रंग नहीं बदलेगा। इसके बजाय component के props (`tone`, `variant`, `padding`, …)
  इस्तेमाल करें।
- **पहले layout components को प्राथमिकता दें।** `<SStack>`, `<SGrid>` और `<SBox>` पहले से ही
  Polaris spacing, padding और border values को props के रूप में लेते हैं। जब वे आपकी ज़रूरत पूरी
  न करें, तब CSS variables का सहारा लें।

## इंस्टॉल करें {#install}

Stylesheet को एक बार import करें, उदाहरण के लिए `main.ts` में:

```ts
import 'polaris-vue-elements/tokens.css'
```

फिर किसी भी CSS में variables इस्तेमाल करें:

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

Tooling या CSS-in-JS के लिए raw नाम और values JSON के रूप में भी उपलब्ध हैं:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Themes {#themes}

Runtime के दो रूप हैं। जो store admin के पिछले design पर है, उसे base values मिलती हैं
(`tokens.css` का `:root` block)। जो store admin के नए design पर है, और Shopify admin के बाहर का
कोई भी page, उसे `admin-next` theme मिलता है: जब पहला Polaris component render होता है, तो
runtime `<html>` में `p-partial-theme-admin-next` class जोड़ देता है, और `tokens.css` उसी class
के तहत अलग values को override करता है। आपका CSS बिना किसी अतिरिक्त काम के उसी theme का पालन
करता है जिसे runtime ने चुना है। नीचे, किसी भी set की values देखने के लिए **बेस** और
**admin-next** के बीच switch करें; आधा भरा हुआ dot उन variables को दिखाता है जिनकी value
दोनों में अलग है।

जो values runtime सिर्फ़ अतिरिक्त शर्तों के तहत लागू करता है (wide-gamut P3 colors, mobile type
sizes, high-contrast mode, `corner-shape` support), वे शामिल नहीं हैं; `tokens.css` में हर एक की
default value है।

## यह कैसे up to date रहती है {#how-it-stays-up-to-date}

एक scheduled job हर दिन Shopify के CDN से `polaris-2.js` पढ़ता है, variables निकालता है और कुछ भी
जोड़े, हटाए या बदले जाने पर एक pull request खोलता है। `polaris-vue-elements` की हर release में
सूची वैसी ही होती है जैसी वह उस release के समय थी।

<div class="css-variables-list">

## सभी variables {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### रंग: पृष्ठभूमि {#color-bg}

<CssVariables group="color-bg" />

### रंग: टेक्स्ट {#color-text}

<CssVariables group="color-text" />

### रंग: बॉर्डर {#color-border}

<CssVariables group="color-border" />

### रंग: आइकन {#color-icon}

<CssVariables group="color-icon" />

### रंग: अन्य {#color-other}

<CssVariables group="color-other" />

### स्पेसिंग {#space}

<CssVariables group="space" />

### बॉर्डर रेडियस {#border-radius}

<CssVariables group="border-radius" />

### बॉर्डर की चौड़ाई {#border-width}

<CssVariables group="border-width" />

### फ़ॉन्ट {#font}

<CssVariables group="font" />

### शैडो {#shadow}

<CssVariables group="shadow" />

### मोशन {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### चौड़ाई {#width}

<CssVariables group="width" />

### ऊँचाई {#height}

<CssVariables group="height" />

### ब्रेकपॉइंट {#breakpoints}

Breakpoint variables में widths होती हैं, लेकिन CSS किसी media query के अंदर `var()` इस्तेमाल
नहीं कर सकता, इसलिए value सीधे लिखें: `@media (min-width: 48rem)`।

<CssVariables group="breakpoints" />

### अन्य {#other}

<CssVariables group="other" />

</div>

## `@shopify/polaris-tokens` से migrate करना {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens`, Polaris React का token package है। Polaris web components इसका
इस्तेमाल नहीं करते: runtime अपने ख़ुद के variables परिभाषित करता है, और ज़्यादातर नाम वैसे ही
रहते हैं। अगर आपके app का CSS किसी Polaris React app से आया है, तो उसे इन सूचियों से मिलाकर
देखें। जो नाम सिर्फ़ legacy package में है, उसकी web components app में कोई value नहीं होती,
इसलिए उसे इस्तेमाल करने वाले CSS को आपका लिखा हुआ `var()` fallback मिलता है, या कुछ भी नहीं।

<CssVariablesMigration />

## अक्सर पूछे जाने वाले सवाल {#faq}

### क्या Polaris web components में CSS variables होते हैं?

हाँ। Polaris runtime (`polaris-2.js`) `:root` पर लगभग 700 `--p-*` custom properties परिभाषित
करता है और उन्हें अपने components के अंदर इस्तेमाल करता है। Shopify इनका documentation नहीं
देता, और runtime के नामों में एक build hash होता है। `tokens.css` आपको यही values स्थिर नामों के
साथ देता है।

### क्या मैं इन variables से किसी Polaris component को restyle कर सकता हूँ?

नहीं। हर component अपने shadow root के अंदर render होता है और runtime के अपने hashed variables
पढ़ता है, इसलिए अपने page पर `--p-color-bg-fill-brand` set करने से `<SButton>` नहीं बदलता।
Component के props इस्तेमाल करें, जैसे `tone` और `variant`। ये variables components के आसपास के
आपके अपने elements के लिए हैं।

### DevTools में variables के नाम `-6e076` जैसे hash पर क्यों ख़त्म होते हैं?

Runtime हर नाम में एक build-specific suffix जोड़ता है (`--p-color-bg-surface-6e076`), और यह
suffix हर build के साथ बदल जाता है। इन नामों को अपने CSS में copy न करें: `tokens.css` suffix
हटा देता है, इसलिए Shopify के नया build ship करने के बाद भी `var(--p-color-bg-surface)` काम
करता रहता है।

### यह `@shopify/polaris-tokens` से कैसे अलग है?

`@shopify/polaris-tokens`, Polaris React का token package है। यह सूची ख़ुद web components
runtime से आती है, इसलिए इसमें वही tokens हैं जिन्हें components वास्तव में इस्तेमाल करते हैं,
नए admin design (`admin-next`) की values सहित। ज़्यादातर नाम दोनों में एक जैसे हैं; अंतर के लिए
[`@shopify/polaris-tokens` से migrate करना](#migrating-from-polaris-tokens) देखें।

### क्या variables dark mode को support करते हैं?

Page theme के रूप में नहीं। Runtime में values का एक dark set (`admin-next-dark`) है, लेकिन वह
उसे सिर्फ़ कुछ components के अंदर के हिस्सों पर लागू करता है, page पर कभी नहीं, इसलिए
`tokens.css` में कोई dark theme नहीं है। अगर आप ख़ुद एक बनाना चाहें, तो values `tokens.json` में
`themes["admin-next-dark"]` के तहत मौजूद हैं।
