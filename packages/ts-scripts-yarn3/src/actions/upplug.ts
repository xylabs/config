import { runSteps } from '../lib'

export const updateYarnPlugins = () => {
  return (
    runSteps('Update Yarn Version', [['yarn', ['set', 'version', 'latest']]]) ||
    runSteps('Update Yarn Plugins', [
      ['yarn', ['plugin', 'import', 'https://mskelton.dev/yarn-outdated/v3']],
      ['yarn', ['plugin', 'import', 'version']],
      ['yarn', ['plugin', 'import', 'interactive-tools']],
      ['yarn', ['plugin', 'import', 'workspace-tools']],
    ])
  )
}
