import chalk from 'chalk'
import cpy from 'cpy'

import { yarnWorkspaces } from '../lib'

export interface CopyAssetsParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const copyAssets = ({ target }: CopyAssetsParams) => {
  const doCopy = (target: 'esm' | 'cjs') => {
    const workspaces = yarnWorkspaces()

    console.log(chalk.green(`Copying Assets [${target.toUpperCase()}]`))

    workspaces.forEach(({ name, location }) => {
      return cpy(
        ['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.sass', '**/*.scss', '**/*.gif', '**/*.css'],
        `../dist/${target}`,
        {
          cwd: `${process.cwd()}/${location}/src`,
          parents: true,
        },
      )
        .then((values) => values.forEach((value) => console.log(`Copied: ${value}`)))
        .catch((reason) => {
          console.log(`Copy Failed: ${name}: ${reason}`)
        })
    })
  }

  switch (target) {
    case 'esm':
      doCopy('esm')
      break
    case 'cjs':
      doCopy('cjs')
      break
    default:
      doCopy('esm')
      doCopy('cjs')
      break
  }
}
