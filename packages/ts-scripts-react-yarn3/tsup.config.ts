import { defineConfig } from 'tsup'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  bundle: false,
  cjsInterop: true,
  clean: false,
  dts: {
    entry: ['src/index.ts'],
  },
  entry: ['src'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  splitting: false,
  tsconfig: 'tsconfig.json',
})
