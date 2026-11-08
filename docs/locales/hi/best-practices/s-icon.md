- **Icons का इस्तेमाल जानकारी देने के लिए करें, सजावट के लिए नहीं।** Icon को यह समझाना चाहिए कि कोई action क्या करता है या कोई state दिखानी चाहिए, जैसे delete action पर delete icon या पूरे हो चुके काम के लिए check। सिर्फ़ दिखावे के लिए icons न जोड़ें।
- **एकरूपता रखें।** जब कोई icon किसी action या concept का प्रतीक बन जाए, तो अपने पूरे app में उसे वैसा ही रखें। अगर एक जगह `edit` का मतलब editing है, तो हर जगह editing के लिए उसी का इस्तेमाल करें।
- **जहाँ संभव हो, icons के साथ text रखें।** अकेले होने पर जाने-पहचाने icons के भी एक से ज़्यादा मतलब निकाले जा सकते हैं। अकेला icon सिर्फ़ वहीं इस्तेमाल करें जहाँ जगह कम हो, जैसे `accessibilityLabel` वाला सिर्फ़ icon वाला button।
- **व्यापक रूप से पहचाने जाने वाले icons चुनें।** तय अर्थ वाले icons को प्राथमिकता दें, जैसे `search`, `delete` और `plus`। अगर किसी icon को समझाने की ज़रूरत पड़े, तो कोई दूसरा चुनें।
- **`tone` से अर्थ व्यक्त करें।** Destructive actions के लिए `tone="critical"`, सकारात्मक states के लिए `tone="success"` और सावधानी के लिए `tone="warning"` इस्तेमाल करें। Tones को कुछ बताना चाहिए, सजावट नहीं करनी चाहिए।

```vue
<SIcon type="alert-triangle" tone="warning" />
```

सभी सुझावों के लिए [`<s-icon>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (अंग्रेज़ी में) देखें।
