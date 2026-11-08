- **Paragraphs छोटे रखें।** बिना jargon के सरल भाषा में दो से चार वाक्यों का लक्ष्य रखें। Merchants अक्सर सरसरी नज़र से पढ़ते हैं, इसलिए लंबे content को छोटे टुकड़ों में बाँटें।
- **इरादा दर्शाने के लिए tone का उपयोग करें।** `tone="critical"` errors के लिए, `"caution"` चेतावनियों के लिए और `"success"` पुष्टियों के लिए उपयुक्त है। केवल रंग पर निर्भर रहने के बजाय हमेशा उसे स्पष्ट शब्दों का साथ दें।
- **Accessibility को ध्यान में रखकर design करें।** उस context के लिए केवल screen reader वाला text (`accessibilityVisibility="exclusive"`) जोड़ें जिसे देख सकने वाले merchants layout या icons से समझ लेते हैं, और सुनिश्चित करें कि tone वाले text में पढ़ने के लिए पर्याप्त contrast बना रहे।
- **Lines को सावधानी से clamp करें।** `lineClamp` cards या previews जैसी तंग जगहों में मदद करता है, लेकिन truncation को कभी भी महत्वपूर्ण जानकारी छिपाने न दें।

सभी सुझावों के लिए [`<s-paragraph>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) (अंग्रेज़ी में) देखें।
