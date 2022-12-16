import { runSteps } from '../lib'

export const updateYarnPlugins = () => {
  return runSteps('Update Yarn Plugins [Outdated]', [
    ['yarn', ['plugin', 'import', '@yarnpkg/plugin-outdated']],
    ['yarn', ['plugin', 'import', '@yarnpkg/plugin-version']],
    ['yarn', ['plugin', 'import', '@yarnpkg/plugin-interactive-tools']],
    ['yarn', ['plugin', 'import', '@yarnpkg/plugin-workspace-tools']],
  ])
}
