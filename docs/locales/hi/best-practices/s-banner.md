- **हर banner में एक ही बात रखें।** हर banner में एक ही संदेश या एक ही ज़रूरी कार्रवाई होनी चाहिए, ताकि merchants यह सोचते न रह जाएँ कि यह किस बारे में है।
- **जल्दी पढ़े जाने लायक लिखें।** Text इतना छोटा रखें कि merchants एक नज़र में संदेश और अगला कदम समझ सकें।
- **Merchants को अगला कदम बताएँ।** `tone="info"`, `tone="warning"` या `tone="critical"` वाले banners में एक call to action होना चाहिए जो साफ़-साफ़ बताए कि आगे क्या करना है।
- **Merchants को banners बंद करने दें।** जब तक संदेश पर तुरंत कार्रवाई ज़रूरी न हो, `dismissible` सेट करें, और ऐसे banners से बचें जो बंद करने के किसी तरीके के बिना स्क्रीन पर बने रहते हैं।
- **Banners को उनके दायरे के अनुसार रखें।** पूरे पेज से जुड़े संदेश के लिए banner को किसी भी section के बाहर रखें, और जब वह किसी section के content से जुड़ा हो तो उसे उसी section के अंदर रखें।

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

सभी सुझावों के लिए [`<s-banner>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (अंग्रेज़ी में) देखें।
