#!/usr/bin/env node

import { runSteps, ScriptStep, yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

const steps = workspaces.map<ScriptStep>(({ location }) => [
  './node_modules/cpy-cli/cli.js',
  [`${location}/src/**/*.jpg`, `${location}/src/**/*.png`, `${location}/src/**/*.gif`, `${location}/src/**/*.svg`, `${location}/dist/cjs`],
])

runSteps(
  'Copy Images [CJS]',
  steps,
  false,
  workspaces.map(({ name }) => name)
)
