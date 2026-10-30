<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | **Français**</sub>

# Contribuer

> Cette traduction peut être en retard sur la version anglaise. En cas de divergence, la [version anglaise](../../CONTRIBUTING.md) fait foi.

Merci de votre aide. Les signalements de bugs, corrections de documentation et pull requests sont tous les bienvenus.

Toutes les personnes qui participent doivent respecter le [code de conduite](./CODE_OF_CONDUCT.md).

## Avant de commencer

- **Un bug ou une petite correction ?** Ouvrez directement une pull request, ou une issue si vous n'êtes pas sûr qu'il s'agisse d'un bug.
- **Une nouvelle fonctionnalité ou une modification de l'API publique ?** Ouvrez d'abord une issue afin que nous
  nous mettions d'accord sur la forme avant que vous n'écriviez le code.

## Configuration

Utilisez la version de Node indiquée dans [`.nvmrc`](../../.nvmrc) (`nvm use`), puis :

```sh
npm install            # installe aussi un hook pre-push qui lance `npm run check`
npm run dev            # playground (src/App.vue) avec de vrais composants Polaris
npm run docs:dev       # site de documentation
```

## Règles de base

1. **Ne modifiez jamais `src/lib/generated/` ni `docs/components/` à la main.** Ils sont écrasés par les
   générateurs. Modifiez plutôt `scripts/generate.mjs` / `scripts/generate-docs.mjs`, puis lancez
   `npm run generate && npm run docs:generate` et committez le résultat.
2. **Un nouveau composant de formulaire a besoin de v-model ?** Ajoutez une ligne dans `src/lib/overrides.ts` (le
   drift guard de `overrides.spec.ts` indique précisément ce qui manque).
3. **Un exemple de documentation rédigé à la main ?** Ajoutez `docs/examples/<tag>.md` (les démos interactives complexes vont dans
   `docs/examples/demos/*.vue`, car les SFC ne sont pas altérés par markdown-it) ; le générateur de documentation
   l'intègre automatiquement. Les bonnes pratiques rédigées à la main vont dans `docs/best-practices/<tag>.md`.
4. **Vérifiez le comportement de Polaris dans un vrai navigateur.** Toute affirmation sur les composants Polaris (règles de slots,
   particularités de rendu) doit être vérifiée avec le vrai runtime du CDN (`polaris-2.js`), pas seulement avec
   jsdom. Consultez [`docs/guide/quirks.md`](../../docs/guide/quirks.md) pour les constats déjà vérifiés.
5. **Ajoutez un test** pour tout changement de comportement dans `src/lib/runtime/` ou dans les générateurs.

## Avant d'ouvrir une pull request

Lancez les mêmes vérifications que la CI :

```sh
npm run generate && npm run docs:generate   # le code généré doit être à jour
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # si vous avez modifié la documentation ou son générateur
```

Ensuite :

- **Ajoutez une ligne dans `CHANGELOG.md`** sous `## [Unreleased]` (dans `Added`, `Changed`, `Fixed` ou
  `Removed`) pour tout ce qu'un utilisateur du package remarquerait. Les changements purement liés à la documentation ou internes
  n'en ont pas besoin. Le CHANGELOG est rédigé en anglais.
- **Intitulez la PR selon le style [Conventional Commits](https://www.conventionalcommits.org/)** :
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Signalez les breaking changes avec `!`
  (`feat!: ...`).
- Limitez-vous à un seul changement par pull request.

## Après l'ouverture d'une pull request

- S'il s'agit de votre première contribution, GitHub Actions attend qu'un mainteneur approuve l'exécution de la CI.
  C'est une protection de GitHub pour les pull requests provenant de forks, pas un jugement sur votre changement.
- Le mainteneur relit, merge et livre le changement dans la prochaine version. Les versions sont publiées par
  le mainteneur (voir [Publication des versions](./README.md#publication-des-versions)).

## Sécurité

Vous avez trouvé une vulnérabilité ? N'ouvrez pas d'issue ; consultez la [politique de sécurité](./SECURITY.md).

## Licence

En contribuant, vous acceptez que vos contributions soient placées sous la [licence MIT](../../LICENSE).
