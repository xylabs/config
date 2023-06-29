import { yarnWorkspaces } from '../yarnWorkspaces'

describe('yarnWorkspaces', () => {
  it('returns the workspace', () => {
    const workspaces = yarnWorkspaces()
    expect(workspaces).toBeArray()
    expect(workspaces.length).toBeGreaterThan(0)
    workspaces.forEach((workspace) => {
      expect(workspace.name).toBeString()
      expect(workspace.location).toBeString()
    })
  })
})
