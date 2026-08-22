import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    'docs/.vitepress/cache/**',
    'docs/.vitepress/dist/**',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    // Docs-only demo SFCs (consumed by `scripts/generate-docs.mjs`'s example inlining,
    // not by the library build) live outside every tsconfig project (see
    // tsconfig.app.json's `include`), so `vueTsConfigs.recommended`'s typed parsing via
    // typescript-eslint's project service can't find them. Lint them with plain
    // (non-type-aware) TS/Vue parsing instead of excluding them outright.
    name: 'docs/demos-untyped',
    files: ['docs/**/*.vue'],
    languageOptions: {
      parserOptions: {
        project: false,
        projectService: false,
      },
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
