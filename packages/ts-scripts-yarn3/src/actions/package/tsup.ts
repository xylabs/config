// eslint-disable-next-line import/no-internal-modules
import merge from 'lodash/merge'
import { build, defineConfig, Options } from 'tsup'

export const packageTsup = async () => {
  const options = defineConfig((options) => {
    return merge(
      {},
      {
        bundle: true,
        cjsInterop: true,
        clean: false,
        dts: {
          entry: ['src/index.ts'],
        },
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        sourcemap: true,
        splitting: false,
        tsconfig: 'tsconfig.json',
      },
      options,
    )
  }) as Options

  console.log(`Options: ${JSON.stringify(options)}`)

  await build(options)

  return 0
}
