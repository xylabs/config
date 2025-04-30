import fs from 'node:fs'
import path from 'node:path'

export function getDependenciesFromPackageJson(packageJsonPath: string) {
  const packageJsonFullPath = path.resolve(packageJsonPath)
  const rawContent = fs.readFileSync(packageJsonFullPath, 'utf8')
  const packageJson = JSON.parse(rawContent)

  const dependencies = packageJson.dependencies
    ? Object.keys(packageJson.dependencies)
    : []

  const devDependencies = packageJson.devDependencies
    ? Object.keys(packageJson.devDependencies)
    : []

  const peerDependencies = packageJson.peerDependencies
    ? Object.keys(packageJson.peerDependencies)
    : []

  return {
    dependencies, devDependencies, peerDependencies,
  }
}
