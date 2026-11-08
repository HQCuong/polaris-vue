- **बिना दिखने वाले text के elements को label दें।** अगर clickable area के अंदर कोई पढ़ने लायक text नहीं है, तो `accessibilityLabel` सेट करें ताकि screen reader users जानें कि यह किसलिए है।
- **सही mode चुनें।** Actions ट्रिगर करने के लिए इसे button की तरह इस्तेमाल करें, navigate करने के लिए इसे `href` दें, और जब यह form submit करे तो `type="submit"` सेट करें।
- **Disabled states को समझाएँ।** जब आप `disabled` सेट करें, तो state को दृश्य रूप से साफ़ रखें और ऐसा text जोड़ें जो merchants को बताए कि element का इस्तेमाल क्यों नहीं हो सकता।

सभी सुझावों के लिए [`<s-clickable>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable#best-practices) (अंग्रेज़ी में) देखें।
