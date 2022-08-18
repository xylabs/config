import { runSteps, ScriptStep, yarnWorkspaces } from '../lib'

export const deps = () => {
  const workspaces = yarnWorkspaces()

  const steps = workspaces.map<ScriptStep>(({ location }) => ['node', ['./node_modules/depcheck/bin/depcheck.js', `${location}/.`]])

  runSteps(
    'Deps',
    steps,
    false,
    workspaces.map(({ name }) => name),
  )
}
