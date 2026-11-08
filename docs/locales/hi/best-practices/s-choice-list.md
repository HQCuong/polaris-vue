- **Selection mode को विकल्पों के अनुसार चुनें।** एक-दूसरे को बाहर करने वाले विकल्पों, जैसे payment methods या shipping speeds, के लिए single selection रखें, और जब merchants एक से ज़्यादा चुन सकें तो `multiple` सेट करें।
- **Choice labels से नतीजा साफ़ हो।** "Email notifications for new orders" सिर्फ़ "Email" से ज़्यादा बताता है। Labels छोटे रखें, लेकिन इतने साफ़ कि अपने आप में समझ आ जाएँ।
- **`label` को सवाल या कथन के रूप में लिखें।** "Which shipping method?" या "Select notification preferences" जैसा title merchants को "Options" या "Settings" जैसे अस्पष्ट शब्द से ज़्यादा बताता है।
- **जटिल विकल्पों को `details` slot में समझाएँ।** जब merchants को यह समझना ज़रूरी हो कि किसी विकल्प को चुनने का क्या मतलब है, तो उस `SChoice` में details जोड़ें।
- **`error` संदेश स्पष्ट रखें।** सामान्य "Required field" के बजाय merchants को ठीक-ठीक बताएँ कि क्या छूट गया है, जैसे "Select at least one notification preference"।

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

सभी सुझावों के लिए [`<s-choice-list>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (अंग्रेज़ी में) देखें।
