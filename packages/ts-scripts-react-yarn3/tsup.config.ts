import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  cjsInterop: true,
  clean: false,
  dts: {
    entry: ['src/index.ts'],
  },
  entry: ['src'],
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    if (format === 'cjs') {
      return {
        js: '.cjs',
      }
    }
    return {
      js: '.mjs',
    }
  },
  outDir: 'dist',
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? `.cjs` : `.mjs`
  }),
  sourcemap: true,
  splitting: false,
  target: 'esnext',
  tsconfig: 'tsconfig.build.json',
})
