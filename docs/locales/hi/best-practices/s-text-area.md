- **इसका आकार अपेक्षित उत्तर के अनुसार रखें।** दिखाई देने वाली `rows` की संख्या संकेत देती है कि कितना लिखना है: छोटा area संक्षिप्त उत्तर आमंत्रित करता है, जबकि लंबा area अधिक विवरण माँगता है।
- **वास्तविक ज़रूरतों के अनुसार लंबाई की सीमाएँ तय करें।** `minLength` और `maxLength` को इस आधार पर चुनें कि content को वास्तव में क्या चाहिए, और merchants को इन सीमाओं के बारे में पहले ही बता दें।
- **Placeholder को उदाहरण के रूप में उपयोग करें।** Field किस लिए है यह दोहराने के बजाय ऐसा `placeholder` text लिखें जो आपके अपेक्षित content, format और tone को दिखाए।
- **बताएँ कि कितनी जगह बची है।** जब आप अधिकतम लंबाई लागू करें, तो merchants को दिखाएँ कि कितने characters बचे हैं ताकि वे सीमा पार किए बिना अपना content फ़िट कर सकें।

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

सभी सुझावों के लिए [`<s-text-area>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (अंग्रेज़ी में) देखें।
