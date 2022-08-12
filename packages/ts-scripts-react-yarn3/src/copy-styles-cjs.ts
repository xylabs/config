#!/usr/bin/env node

import { runSteps, ScriptStep, yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

const steps = workspaces.map<ScriptStep>(({ location }) => [
  'node',
  ['./node_modules/cpy-cli/cli.js', `${location}/src/**/*.sass`, `${location}/src/**/*.scss`, `${location}/src/**/*.css`, `${location}/dist/cjs`],
])

runSteps(
  'Copy Styles [CJS]',
  steps,
  false,
  workspaces.map(({ name }) => name),
)
