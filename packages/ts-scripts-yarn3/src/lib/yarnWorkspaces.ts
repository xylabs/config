import { spawnSync } from 'child_process'

export interface Workspace {
  location: string
  name: string
}

export const yarnWorkspaces = (): Workspace[] => {
  const result = spawnSync('yarn', ['workspaces', 'list', '--json', '--recursive'], { encoding: 'utf8', shell: true })
  if (result.error) {
    throw result.error
  }
  const list = result.stdout
    .toString()
    .split('\n')
    .slice(0, -1)
    .map((item) => {
      return JSON.parse(item)
    })
  return list
}
