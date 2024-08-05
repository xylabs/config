import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  cjsInterop: true,
  clean: false,
  dts: {
    entry: ['src/index.ts'],
  },
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.mjs',
  }),
  entry: ['src'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  target: 'esnext',
  tsconfig: 'tsconfig.build.json',
})
