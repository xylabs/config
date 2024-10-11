import {
  describe, expect, it,
} from 'vitest'

import { yarnWorkspaces } from '../../../src/index.ts'

describe('yarnWorkspaces', () => {
  it('returns the workspace', () => {
    const workspaces = yarnWorkspaces()
    expect(Array.isArray(workspaces)).toBeTruthy()
    expect(workspaces.length).toBeGreaterThan(0)
    for (const workspace of workspaces) {
      expect(workspace.name).toBeTypeOf('string')
      expect(workspace.location).toBeTypeOf('string')
    }
  })
})
