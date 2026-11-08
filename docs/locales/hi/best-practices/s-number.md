- **केवल अंक को wrap करें।** संख्यात्मक value को ही `SNumber` में रखें और उसके आसपास के शब्दों को `SText` या `SParagraph` में छोड़ दें। Tabular digits अंकों को साफ़-सुथरे ढंग से align करते हैं, लेकिन सामान्य शब्दों को असमान दिखाते हैं।
- **Values को पहले अपने app में format करें।** `SNumber` यह नियंत्रित करता है कि अंक कैसे दिखें, न कि value कैसे format हो, इसलिए merchant के locale से मेल खाने के लिए currency चिह्न, दशमलव और हज़ारों के separators स्वयं जोड़ें।
- **Tone का उपयोग तभी करें जब अंक की कोई स्थिति हो।** `tone` तब सेट करें जब संख्या स्वयं कुछ संकेत देती हो, जैसे ख़त्म हो चुका stock। हर अंक पर tone लगाने से कोई भी अलग से नहीं दिखता।
- **अंकों का आकार उनके महत्व के अनुसार रखें।** जिस संख्या को merchants को सबसे पहले पढ़ना चाहिए, जैसे कुल योग, उसे बड़ा `fontSize` दें, और द्वितीयक अंकों को default आकार में रहने दें।

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

सभी सुझावों के लिए [`<s-number>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (अंग्रेज़ी में) देखें।
