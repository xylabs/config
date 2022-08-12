#!/usr/bin/env node
import { runSteps, ScriptStep, yarnWorkspaces } from './lib'

const workspaces = yarnWorkspaces()

const steps = workspaces.map<ScriptStep>(({ location }) => ['./node_modules/rimraf/bin.js', ['-q', `${location}/dist`]])

runSteps('Clean', [...steps, ['yarn', ['tsconfig-gen:clean']]])
