import { yarnWorkspace } from '../../../src'

describe('yarnWorkspace', () => {
  describe('when workspace', () => {
    describe('exists', () => {
      it('returns the workspace', () => {
        const workspace = yarnWorkspace('@xylabs/ts-scripts-yarn3')
        expect(workspace.name).toBeString()
        expect(workspace.location).toBeString()
      })
    })
    describe('does not exist', () => {
      it('throws', () => {
        expect(() => yarnWorkspace('@xylabs/foo-bar')).toThrow()
      })
    })
  })
})
