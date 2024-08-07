import { runSteps } from '../lib/index.ts'

export const updateYarnPlugins = () => {
  return runSteps('Update Yarn Plugins', [
    ['yarn', ['plugin', 'import', 'https://mskelton.dev/yarn-outdated/v3']],
    ['yarn', ['plugin', 'import', 'version']],
    ['yarn', ['plugin', 'import', 'interactive-tools']],
    ['yarn', ['plugin', 'import', 'workspace-tools']],
  ])
}
