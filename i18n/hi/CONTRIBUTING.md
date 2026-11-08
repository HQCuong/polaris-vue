<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md) | [Español](../es/CONTRIBUTING.md) | **हिन्दी** | [Português (Brasil)](../pt/CONTRIBUTING.md)</sub>

# योगदान

> यह अनुवाद अंग्रेज़ी संस्करण से पीछे हो सकता है। किसी भी अंतर की स्थिति में [अंग्रेज़ी संस्करण](../../CONTRIBUTING.md) ही मान्य है।

मदद करने के लिए धन्यवाद। Bug reports, docs सुधार और pull requests, सभी का स्वागत है।

भाग लेने वाले हर व्यक्ति से [आचार संहिता](./CODE_OF_CONDUCT.md) का पालन करने की अपेक्षा की जाती है।

## शुरू करने से पहले

- **Bug या छोटा सुधार?** सीधे एक pull request खोलें, या अगर आपको पक्का नहीं है कि यह bug है तो एक issue खोलें।
- **नई feature या public API में बदलाव?** पहले एक issue खोलें, ताकि code लिखने से पहले हम
  उसके स्वरूप पर सहमत हो सकें।

## Setup

[`.nvmrc`](../../.nvmrc) में दिया गया Node version इस्तेमाल करें (`nvm use`), फिर:

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## बुनियादी नियम

1. **`src/lib/generated/` या `docs/components/` को कभी हाथ से edit न करें।** Generators इन्हें
   overwrite कर देते हैं। इसके बजाय `scripts/generate.mjs` / `scripts/generate-docs.mjs` बदलें, फिर
   `npm run generate && npm run docs:generate` चलाएँ और output commit करें।
2. **नए form component को v-model चाहिए?** `src/lib/overrides.ts` में एक line जोड़ें (`overrides.spec.ts`
   drift guard ठीक-ठीक बताता है कि क्या छूट गया है)।
3. **हाथ से लिखा docs example?** `docs/examples/<tag>.md` जोड़ें (जटिल live demos `docs/examples/demos/*.vue`
   में जाते हैं, क्योंकि SFCs पर markdown-it की गड़बड़ी का असर नहीं होता); docs generator इसे
   अपने-आप inline कर देता है। हाथ से लिखी best practices `docs/best-practices/<tag>.md` में जाती हैं।
4. **Polaris के व्यवहार को असली browser में जाँचें।** Polaris components के बारे में किए गए दावे (slot के नियम,
   rendering quirks) असली CDN runtime (`polaris-2.js`) पर जाँचे जाने चाहिए, केवल
   jsdom पर नहीं। पहले से जाँचे गए निष्कर्षों के लिए [`docs/guide/quirks.md`](../../docs/guide/quirks.md) देखें।
5. `src/lib/runtime/` या generators में व्यवहार के किसी भी बदलाव के लिए **एक test जोड़ें**।

## Pull request खोलने से पहले

वही checks चलाएँ जो CI चलाता है:

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

इसके बाद:

- package के किसी user को दिखने वाले हर बदलाव के लिए **`CHANGELOG.md` में एक line जोड़ें**, `## [Unreleased]` के नीचे
  (`Added`, `Changed`, `Fixed` या `Removed` में)। केवल docs या internal बदलावों के लिए इसकी
  ज़रूरत नहीं है। CHANGELOG अंग्रेज़ी में लिखा जाता है।
- **PR का title [Conventional Commits](https://www.conventionalcommits.org/) शैली में रखें**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`। Breaking changes को `!` से चिह्नित करें
  (`feat!: ...`)।
- हर pull request में केवल एक बदलाव रखें।

## Pull request खोलने के बाद क्या होता है

- अगर यह आपका पहला योगदान है, तो GitHub Actions CI run को approve करने के लिए किसी maintainer का इंतज़ार करता है।
  यह forks से आने वाले pull requests के लिए GitHub की एक सुरक्षा व्यवस्था है, आपके बदलाव पर कोई टिप्पणी नहीं।
- Maintainer review करते हैं, merge करते हैं, और बदलाव को अगली release में ship करते हैं। Releases
  maintainer बनाते हैं (देखें [रिलीज़](./README.md#रिलीज़))।

## सुरक्षा

कोई vulnerability मिली है? Issue न खोलें; [सुरक्षा नीति](./SECURITY.md) देखें।

## लाइसेंस

योगदान करके, आप सहमति देते हैं कि आपके योगदान [MIT License](../../LICENSE) के तहत licensed होंगे।
