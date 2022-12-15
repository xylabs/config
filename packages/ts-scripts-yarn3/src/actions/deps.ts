import { runSteps, ScriptStep, yarnWorkspaces } from '../lib'

export const deps = () => {
  const workspaces = yarnWorkspaces()

  const steps = workspaces.map<ScriptStep>(({ location }) => ['yarn', ['depcheck', `${location}/.`, '--ignore-patterns=*.stories.*,*.spec.*']])

  return runSteps(
    'Deps',
    steps,
    false,
    workspaces.map(({ name }) => name),
  )
}
