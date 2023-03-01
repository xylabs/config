import { runSteps } from '../lib'

export const cleanJest = (): number => {
  const pkgName = process.env.npm_package_name

  return runSteps(`Cleaning Jest [${pkgName}]`, [['jest', ['--clearCache']]])
}
