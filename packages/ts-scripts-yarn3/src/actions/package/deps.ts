import { runSteps } from '../../lib'

export const packageDeps = () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name

  return runSteps(`Deps [${pkgName}]`, [['yarn', ['depcheck', `${pkg}/.`, '--ignore-patterns=*.stories.*,*.spec.*']]])
}
