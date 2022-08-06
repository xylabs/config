#!/usr/bin/env node

import { runSteps, ScriptStep, yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

const steps = workspaces.map<ScriptStep>(({ location }) => ['./node_modules/depcheck/bin/depcheck.js', [`${location}/.`]])

runSteps(
  'Deps',
  steps,
  false,
  workspaces.map(({ name }) => name)
)
