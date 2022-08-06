#!/usr/bin/env node

import { runSteps, ScriptStep, yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

const steps = workspaces.map<ScriptStep>(({ location }) => [
  './node_modules/typedoc/bin/typedoc',
  [
    '--logLevel',
    'Error',
    '--tsconfig',
    `${location}/tsconfig.build.esm.json`,
    '--excludeExternals',
    `${location}/src/index.ts`,
    '--json',
    `${location}/dist/docs.json`,
  ],
])

runSteps(
  'Generate TypeDocs',
  steps,
  false,
  workspaces.map(({ name }) => name)
)
