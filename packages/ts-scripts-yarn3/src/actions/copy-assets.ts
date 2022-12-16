import chalk from 'chalk'
import cpy from 'cpy'
import path from 'path/posix'

import { yarnWorkspaces } from '../lib'

export interface CopyAssetsParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

const copyPackageTargetAssets = async (target: 'esm' | 'cjs', name: string, location: string) => {
  try {
    const values = await cpy(
      ['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.sass', '**/*.scss', '**/*.gif', '**/*.css'],
      `../dist/${target}`,
      {
        cwd: path.join(process.cwd(), location, 'src'),
        parents: true,
      },
    )
    values.forEach((value) => {
      console.log(`${value.split('/').pop()} => ./dist/${target}`)
    })
    return 0
  } catch (reason) {
    console.log(`Copy Failed: ${name}: ${reason}`)
    return 1
  }
}

const copyTargetAssets = async (target: 'esm' | 'cjs', pkg?: string) => {
  const workspaces = yarnWorkspaces()

  console.log(chalk.green(`Copying Assets [${target.toUpperCase()}]`))

  //finds the package or returns all if undefined
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  if (workspaceList.length === 0) {
    console.error(`Package not found [${pkg}]`)
  } else {
    const results = await Promise.all(
      workspaceList.map(async (workspace) => {
        const { location, name } = workspace
        return await copyPackageTargetAssets(target, name, location)
      }),
    )
    return results.reduce((prev, result) => prev || result, 0)
  }
  return 0
}

export const copyAssets = async ({ target, pkg }: CopyAssetsParams) => {
  switch (target) {
    case 'esm':
      return await copyTargetAssets('esm', pkg)
    case 'cjs':
      return await copyTargetAssets('cjs', pkg)
    default:
      return (await copyTargetAssets('esm', pkg)) || (await copyTargetAssets('cjs', pkg))
  }
}
