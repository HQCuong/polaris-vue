<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md) | **Español** | [हिन्दी](../hi/CONTRIBUTING.md) | [Português (Brasil)](../pt/CONTRIBUTING.md)</sub>

# Contribuir

> Esta traducción puede ir por detrás de la versión en inglés. En caso de discrepancia, prevalece la [versión en inglés](../../CONTRIBUTING.md).

Gracias por echar una mano. Los informes de errores, las correcciones de documentación y las pull requests son bienvenidos.

Se espera que todas las personas que participan sigan el [código de conducta](./CODE_OF_CONDUCT.md).

## Antes de empezar

- **¿Un error o una corrección pequeña?** Abre directamente una pull request, o una issue si no estás seguro de que sea un error.
- **¿Una nueva funcionalidad o un cambio en la API pública?** Abre primero una issue para que acordemos el enfoque
  antes de que escribas el código.

## Configuración

Usa la versión de Node indicada en [`.nvmrc`](../../.nvmrc) (`nvm use`) y después:

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## Reglas básicas

1. **Nunca edites `src/lib/generated/` ni `docs/components/` a mano.** Los generadores los
   sobrescriben. Modifica en su lugar `scripts/generate.mjs` / `scripts/generate-docs.mjs`, ejecuta
   `npm run generate && npm run docs:generate` y haz commit del resultado.
2. **¿Un nuevo componente de formulario necesita v-model?** Añade una línea en `src/lib/overrides.ts` (el
   drift guard de `overrides.spec.ts` señala exactamente lo que falta).
3. **¿Un ejemplo de documentación escrito a mano?** Añade `docs/examples/<tag>.md` (las demos interactivas complejas van en
   `docs/examples/demos/*.vue`, ya que los SFC no se ven alterados por markdown-it); el generador de documentación
   lo incorpora automáticamente. Las buenas prácticas escritas a mano van en `docs/best-practices/<tag>.md`.
4. **Verifica el comportamiento de Polaris en un navegador real.** Cualquier afirmación sobre los componentes de Polaris (reglas de slots,
   peculiaridades de renderizado) debe comprobarse con el runtime real del CDN (`polaris-2.js`), no solo con
   jsdom. Consulta [`docs/guide/quirks.md`](../../docs/guide/quirks.md) para ver los hallazgos ya verificados.
5. **Añade un test** para cualquier cambio de comportamiento en `src/lib/runtime/` o en los generadores.

## Antes de abrir una pull request

Ejecuta las mismas comprobaciones que la CI:

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

Después:

- **Añade una línea en `CHANGELOG.md`** bajo `## [Unreleased]` (en `Added`, `Changed`, `Fixed` o
  `Removed`) para cualquier cosa que un usuario del paquete pudiera notar. Los cambios solo de documentación o internos
  no la necesitan. El CHANGELOG se escribe en inglés.
- **Titula la PR al estilo [Conventional Commits](https://www.conventionalcommits.org/)**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Marca los cambios incompatibles con `!`
  (`feat!: ...`).
- Limítate a un solo cambio por pull request.

## Qué ocurre después de abrir una pull request

- Si es tu primera contribución, GitHub Actions espera a que un mantenedor apruebe la ejecución de la CI.
  Es una protección de GitHub para las pull requests que vienen de forks, no un juicio sobre tu cambio.
- El mantenedor revisa, fusiona y publica el cambio en la siguiente versión. Las versiones las publica
  el mantenedor (consulta [Publicación de versiones](./README.md#publicación-de-versiones)).

## Seguridad

¿Has encontrado una vulnerabilidad? No abras una issue; consulta la [política de seguridad](./SECURITY.md).

## Licencia

Al contribuir, aceptas que tus contribuciones se publiquen bajo la [licencia MIT](../../LICENSE).
