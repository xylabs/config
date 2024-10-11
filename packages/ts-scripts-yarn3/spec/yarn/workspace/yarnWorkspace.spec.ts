import {
  describe, expect, it,
} from 'vitest'

import { yarnWorkspace } from '../../../src/index.ts'

describe('yarnWorkspace', () => {
  describe('when workspace', () => {
    describe('exists', () => {
      it('returns the workspace', () => {
        const workspace = yarnWorkspace('@xylabs/ts-scripts-yarn3')
        expect(workspace.name).toBeTypeOf('string')
        expect(workspace.location).toBeTypeOf('string')
      })
    })
    describe('does not exist', () => {
      it('throws', () => {
        expect(() => yarnWorkspace('@xylabs/foo-bar')).toThrow()
      })
    })
  })
})
