import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  cjsInterop: true,
  clean: false,
  dts: { entry: ['src/index.ts'] },
  entry: ['src'],
  format: ['esm'],
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.cjs' }
    }
    return { js: '.mjs' }
  },
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  target: 'esnext',
  tsconfig: 'tsconfig.build.json',
})
