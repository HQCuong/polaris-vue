- **हर checkbox को स्वतंत्र रखें।** Merchants को विकल्पों का कोई भी संयोजन चुनने की सुविधा होनी चाहिए, बिना किसी एक checkbox के दूसरे पर असर डाले।
- **हर checkbox को एक वर्णनात्मक `label` दें।** यह सबसे ज़्यादा तब मायने रखता है जब कोई checkbox किसी setting को चालू या बंद करता है, ताकि merchants ठीक-ठीक जानें कि वे क्या enable कर रहे हैं।
- **विकल्पों को तार्किक क्रम में रखें।** उन्हें वर्णक्रम, संख्या या समय के अनुसार क्रमबद्ध करें, ताकि merchants अपना चाहा विकल्प जल्दी ढूँढ सकें।
- **`indeterminate` को आंशिक "select all" के लिए रखें।** इसे "select all" checkbox पर तब इस्तेमाल करें जब उसके समूह के केवल कुछ items ही checked हों।
- **जब संदर्भ मददगार हो तो `details` जोड़ें।** किसी विकल्प के काम को और समझाने के लिए इसका इस्तेमाल सिर्फ़ तभी करें जब अकेला label काफ़ी न हो।

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

सभी सुझावों के लिए [`<s-checkbox>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (अंग्रेज़ी में) देखें।
