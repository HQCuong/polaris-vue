- **Tooltips का उपयोग अतिरिक्त, गैर-ज़रूरी विवरण के लिए करें।** वे ऐसी जानकारी के लिए उपयुक्त हैं जो समझ बढ़ाती है लेकिन आवश्यक नहीं है। Errors, ज़रूरी जानकारी या आवश्यक निर्देशों को कभी भी tooltip में न छिपाएँ।
- **इन्हें केवल icon वाले buttons के साथ जोड़ें।** Icon button को यह समझाने के लिए tooltip चाहिए कि वह क्या करता है; उसमें action और, अगर हो, तो उसका keyboard shortcut शामिल करें।
- **Text संक्षिप्त रखें।** छोटा वाक्यांश या वाक्य आदर्श है। अगर content लंबा हो जाए, तो शायद वह UI में किसी अधिक दिखाई देने वाली जगह का हक़दार है।
- **बहुत सारे tooltips को चेतावनी का संकेत मानें।** अगर interface को समझने के लिए इनकी बहुत ज़रूरत पड़े, तो इसके बजाय labels, layout या information architecture को बेहतर बनाएँ।
- **Touch devices को याद रखें।** Tooltips केवल desktop पर काम करते हैं और touch screens पर दिखाई नहीं देते, इसलिए mobile पर ज़रूरी जानकारी default रूप से दिखाएँ।

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

सभी सुझावों के लिए [`<s-tooltip>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (अंग्रेज़ी में) देखें।
