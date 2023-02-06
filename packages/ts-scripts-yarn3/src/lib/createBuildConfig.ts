import { readFileSync } from 'fs'

import { defaultBuildConfig } from './defaultBuildConfig'

const getGeneralTypescriptConfig = (location: string) => {
  let generalConfig: string | undefined
  try {
    generalConfig = readFileSync(`${location}/tsconfig.json`, { encoding: 'utf8' })
  } catch (ex) {
    throw new Error('No tsconfig.json file found')
  }
  return JSON.parse(generalConfig)
}

export const createBuildConfig = (
  location: string,
  module: 'ESNext' | 'CommonJS',
  target: 'ESNext' | 'ES6',
  outDirSuffix: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  const generalConfigObject = getGeneralTypescriptConfig(location)
  return {
    ...generalConfigObject,
    compilerOptions: {
      ...defaultBuildConfig.compilerOptions,
      ...(generalConfigObject.compilerOptions ?? {}),
      module,
      outDir: `./${generalConfigObject.compilerOptions?.outDir ?? 'dist'}/${outDirSuffix}`,
      target,
    },
    exclude: [...(generalConfigObject.exclude ?? []), ...defaultBuildConfig.exclude],
    include: [...(generalConfigObject.include ?? []), ...defaultBuildConfig.include],
  }
}
