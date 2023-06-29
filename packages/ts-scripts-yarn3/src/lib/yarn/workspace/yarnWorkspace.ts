import { Workspace } from './Workspace'
import { yarnWorkspaces } from './yarnWorkspaces'

export const yarnWorkspace = (pkg: string): Workspace => {
  const workspace = yarnWorkspaces().find(({ name }) => name === pkg)
  if (!workspace) throw new Error(`Workspace ${pkg} not found`)
  return workspace
}
