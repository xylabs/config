import { spawnSync } from 'child_process'

export interface Workspace {
  name: string
  location: string
}

export const yarnWorkspaces = (): Workspace[] => {
  const result = spawnSync('yarn', ['workspaces', 'list', '--json', '--recursive'])
  const list = result.stdout
    .toString()
    .split('\n')
    .slice(0, -1)
    .map((item) => {
      return JSON.parse(item)
    })
  return list
}
