- **इसे एक सामान्य container के रूप में इस्तेमाल करें।** `SBox` content को समूह में रखने के लिए spacing, borders और backgrounds संभालता है। जब आपको rows या columns जैसी कोई खास व्यवस्था चाहिए, तो इसके बजाय `SStack` या `SGrid` इस्तेमाल करें।
- **पहले देखें कि कोई ज़्यादा अर्थपूर्ण component मौजूद है या नहीं।** अगर `SSection` या `SBanner` जैसा कोई component पहले से बताता है कि content क्या है, तो उसे प्राथमिकता दें। खास मकसद से बने components का उद्देश्य ज़्यादा साफ़ होता है और accessibility बेहतर होती है।
- **छोटी स्क्रीन के लिए योजना बनाएँ।** जो layout desktop पर सही दिखता है वह mobile पर बिगड़ सकता है, इसलिए तय sizes पर अड़े रहने के बजाय responsive values से spacing और layout को समायोजित करें।
- **Regions और interactive content का वर्णन करें।** जब कोई box एक अलग region को चिह्नित करता है या उसमें interactive content होता है, तो `accessibilityRole` और `accessibilityLabel` सेट करें, ताकि screen reader users संरचना को समझ सकें और उसमें आगे-पीछे जा सकें।
- **Nesting कम रखें।** Boxes के अंदर boxes रखने से markup जटिल हो जाता है और styling को बनाए रखना मुश्किल हो जाता है। कोई सरल संरचना या ज़्यादा उपयुक्त layout component खोजें।

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

सभी सुझावों के लिए [`<s-box>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (अंग्रेज़ी में) देखें।
