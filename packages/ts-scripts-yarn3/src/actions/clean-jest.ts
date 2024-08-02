import { runSteps } from '../lib/index.ts'

export const cleanJest = (): number => {
  const pkgName = process.env.npm_package_name

  return runSteps(`Cleaning Jest [${pkgName}]`, [['jest', ['--clearCache']]])
}
