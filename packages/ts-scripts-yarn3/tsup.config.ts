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
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  target: 'node16',
  tsconfig: 'tsconfig.build.json',
})
