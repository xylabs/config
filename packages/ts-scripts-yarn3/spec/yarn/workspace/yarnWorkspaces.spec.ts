import { yarnWorkspaces } from '../../../src'

describe('yarnWorkspaces', () => {
  it('returns the workspace', () => {
    const workspaces = yarnWorkspaces()
    expect(workspaces).toBeArray()
    expect(workspaces.length).toBeGreaterThan(0)
    for (const workspace of workspaces) {
      expect(workspace.name).toBeString()
      expect(workspace.location).toBeString()
    }
  })
})
