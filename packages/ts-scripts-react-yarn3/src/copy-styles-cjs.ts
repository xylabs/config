#!/usr/bin/env node

import chalk from 'chalk'
import cpy from 'cpy'

import { yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

console.log(chalk.green('Copying Styles [CJS]'))

workspaces.forEach(({ name, location }) => {
  return cpy(['**/*.sass', '**/*.scss', '**/*.gif', '**/*.css'], '../dist/cjs', {
    cwd: `${process.cwd()}/${location}/src`,
    parents: true,
  })
    .then((values) => values.forEach((value) => console.log(`Copied: ${value}`)))
    .catch((reason) => {
      console.log(`Copy Failed: ${name}: ${reason}`)
    })
})
