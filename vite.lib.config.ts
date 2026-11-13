import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

// Library-mode build for the published `polaris-vue-elements` package (src/lib/**).
//
// This is intentionally a separate config from vite.config.ts, which builds the dev
// playground app. The library ships as ESM only, with `vue` external (the consumer
// supplies it) and no bundled Vue plugin/devtools tooling. Type declarations are
// generated separately via `vue-tsc` (see tsconfig.lib.json + the `build:lib` script);
// this config only produces the JS bundle + sourcemaps.
export default defineConfig({
  // The root `public/` dir holds playground-only assets (favicon, etc.) — don't copy
  // them into the published package.
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      // Two independent entries. `app-bridge/index` is the `polaris-vue-elements/app-bridge`
      // subpath; it shares no runtime module with the main entry, so Rollup emits no shared
      // chunk and `dist/index.js` is unaffected by it.
      entry: {
        index: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
        'app-bridge/index': fileURLToPath(new URL('./src/lib/app-bridge/index.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // `@shopify/app-bridge-types` is imported for types only; keep it external anyway so
      // a future value import can never bundle it.
      external: ['vue', /^@shopify\/app-bridge-types/],
    },
  },
})
