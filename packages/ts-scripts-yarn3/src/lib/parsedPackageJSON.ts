import { readFileSync } from 'node:fs'

export const parsedPackageJSON = (path?: string) => {
  const pathToPackageJSON = path ?? process.env.npm_package_json ?? ''
  const packageJSON = readFileSync(pathToPackageJSON).toString()
  return JSON.parse(packageJSON)
}
