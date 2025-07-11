import { cwd } from 'node:process'

import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'

export async function bundleDts(inputPath: string, outputPath: string) {
  const bundle = await rollup({
    input: inputPath,
    plugins: [dts()],
    onwarn(warning, warn) {
      // Ignore certain warnings if needed
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
      warn(warning)
    },
  })

  await bundle.write({
    file: outputPath,
    format: 'es',
  })

  console.log(`Bundled declarations written to ${outputPath}`)
}

export const packageCompileTscTypes = async (
  entries: string[],
  outDir: string,
  folder: string = 'src',
): Promise<number> => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const srcRoot = `${pkg}/${folder}`

  const entryNameToTypeName = (entry: string): string => {
    const splitEntryName = entry.split('.')
    const newEntryExtension = 'd.' + splitEntryName.at(-1)
    return [...splitEntryName.slice(0, -1), newEntryExtension].join('.')
  }

  const entryNames = entries.map(entry => entry.split(`${folder}/`).at(-1) ?? entry)

  await Promise.all(entryNames.map(async (entryName) => {
    await bundleDts(`${srcRoot}/${entryName}`, outDir + '/' + entryNameToTypeName(entryName))
  }))
  return 0
}
