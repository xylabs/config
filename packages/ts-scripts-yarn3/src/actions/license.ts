import { runSteps, ScriptStep, yarnWorkspaces } from '../lib'

export const license = () => {
  const workspaces = yarnWorkspaces()

  const exclude: string[] = [
    'MIT',
    'ISC',
    'Apache-2.0',
    'BSD',
    'BSD-2-Clause',
    'CC-BY-4.0',
    'Unlicense',
    'CC-BY-3.0',
    'CC0-1.0',
    'LGPL-3.0-only',
    'LGPL-3.0',
    'LGPL-3.0-or-later',
  ]

  const steps = workspaces.map<ScriptStep>(({ location }) => [
    'node',
    ['./node_modules/license-checker/bin/license-checker', '--start', `./${location}`, '--exclude', `'${exclude.join(', ')}'`, '--production'],
  ])

  runSteps(
    'License',
    steps,
    false,
    workspaces.map(({ name }) => name),
  )
}
