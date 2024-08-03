import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: false,
  cjsInterop: true,
  clean: false,
  dts: {
    entry: ['src/index.ts'],
  },
  entry: ['src'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? `.cjs` : `.mjs`
  }),
  sourcemap: true,
  splitting: false,
  tsconfig: 'tsconfig.build.json',
})
