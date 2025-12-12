import { readFileSync } from 'node:fs'

import type { Workspace } from '../lib/index.ts'
import { runSteps, yarnWorkspaces } from '../lib/index.ts'

const privatePackageExcludeList = () => {
  const possibleDeployablePackages: [Workspace, { private?: boolean }][] = yarnWorkspaces().map(workspace => [workspace,
    JSON.parse(readFileSync(`${workspace.location}/package.json`, { encoding: 'utf8' })) as object])

  const privatePackages = possibleDeployablePackages.filter(([_, pkg]) => pkg.private).map(([workspace]) => workspace)
  const excludeList = privatePackages.map(workspace => `--exclude ${workspace.name}`)
  return excludeList
}

export const deploy = () => {
  const excludeList = privatePackageExcludeList()
  if (excludeList.length > 0) {
    console.log('Excluding private packages from deployment:', excludeList)
  }

  return runSteps('Deploy [Patch]', [
    ['yarn', 'workspaces foreach --all version patch --deferred'],
    ['yarn', 'xy clean'],
    ['yarn', 'xy build'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -A --no-private npm publish'],
  ])
}
