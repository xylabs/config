import chalk from 'chalk'
import cpy from 'cpy'

import { yarnWorkspaces } from '../lib'

export const copyImagesEsm = () => {
  const workspaces = yarnWorkspaces()

  console.log(chalk.green('Copying Images [ESM]'))

  workspaces.forEach(({ name, location }) => {
    return cpy(['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp'], '../dist/esm', {
      cwd: `${process.cwd()}/${location}/src`,
      parents: true,
    })
      .then((values) => values.forEach((value) => console.log(`Copied: ${value}`)))
      .catch((reason) => {
        console.log(`Copy Failed: ${name}: ${reason}`)
      })
  })
}
