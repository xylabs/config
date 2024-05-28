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
  sourcemap: true,
  splitting: false,
  tsconfig: 'tsconfig.build.json',
})
