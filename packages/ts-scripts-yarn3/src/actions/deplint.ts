/* eslint-disable max-statements */
import fs from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'
import { globSync } from 'glob'
import ts from 'typescript'

import { yarnWorkspace, yarnWorkspaces } from '../lib/index.ts'

function getDependenciesFromPackageJson(packageJsonPath: string) {
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

function getBasePackageName(importName: string) {
  if (importName.startsWith('@')) {
    const parts = importName.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importName
  }
  return importName.split('/')[0]
}

function getImportsFromFile(filePath: string, importPaths: Record<string, string[]>) {
  const sourceCode = fs.readFileSync(filePath, 'utf8')

  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  )

  const imports: string[] = []

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier)?.getFullText()
      if (moduleSpecifier) {
        const trimmed = moduleSpecifier.split("'").at(1) ?? moduleSpecifier
        imports.push(trimmed)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  const cleanedImports = imports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:')).map(getBasePackageName)

  for (const imp of cleanedImports) {
    importPaths[imp] = importPaths[imp] || []
    importPaths[imp].push(filePath)
  }

  return cleanedImports
}

function findFilesByGlob(cwd: string, pattern: string) {
  return globSync(pattern, { cwd, absolute: true })
}

function findFiles(path: string) {
  const allSourceInclude = ['./src/**/*.{ts,tsx}']
  const prodExcludeEndswith = ['.spec.ts', '.stories.tsx']
  const prodExcludeIncludes = ['/spec/', '/stories/', '/scripts/']
  const allSourceFiles = allSourceInclude.flatMap(pattern => findFilesByGlob(path, pattern))

  const prodSourceFiles = allSourceFiles.filter(file => !prodExcludeEndswith.some(ext => file.endsWith(ext))
    && !prodExcludeIncludes.some(excl => file.includes(excl)))

  const devSourceFiles = allSourceFiles.filter(file => !prodSourceFiles.includes(file))
  return {
    allSourceFiles, prodSourceFiles, devSourceFiles,
  }
}

function getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles }: { devSourceFiles: string[]; prodSourceFiles: string[] }) {
  const prodImportPaths: Record<string, string[]> = {}
  const prodImports = prodSourceFiles.flatMap(path => getImportsFromFile(path, prodImportPaths))
  const devImportPaths: Record<string, string[]> = {}
  const devImports = devSourceFiles.flatMap(path => getImportsFromFile(path, devImportPaths))
  const externalProdImports = prodImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  const externalDevImports = devImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  return {
    prodImports, devImports, prodImportPaths, devImportPaths, externalProdImports, externalDevImports,
  }
}

function check({
  name, location, devDeps = false, peerDeps = false,
}: { devDeps?: boolean; location: string; name: string; peerDeps?: boolean }) {
  const { prodSourceFiles, devSourceFiles } = findFiles(location)
  const {
    prodImportPaths, devImportPaths, externalProdImports, externalDevImports,
  } = getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles })

  const {
    dependencies, devDependencies, peerDependencies,
  } = getDependenciesFromPackageJson(`${location}/package.json`)

  let unlistedDependencies = 0
  let unlistedDevDependencies = 0
  let unusedDependencies = 0

  for (const imp of externalProdImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  for (const dep of dependencies) {
    if (!externalProdImports.includes(dep)) {
      unusedDependencies++
      console.log(`[${chalk.blue(name)}] Unused dependency in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
  }

  if (peerDeps) {
    for (const dep of peerDependencies) {
      if (!externalProdImports.includes(dep)) {
        unusedDependencies++
        console.log(`[${chalk.blue(name)}] Unused peerDependency in package.json: ${chalk.red(dep)}`)
        console.log(`  ${location}/package.json\n`)
        console.log('')
      }
    }
  }

  if (devDeps) {
    for (const imp of externalDevImports) {
      if (!devDependencies.includes(imp)) {
        unlistedDevDependencies++
        console.log(`[${chalk.blue(name)}] Missing devDependency in package.json: ${chalk.red(imp)}`)
        console.log(`  Found in: ${devImportPaths[imp].join(', ')}`)
      }
    }
  }

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies

  return totalErrors
}

export const deplint = ({ pkg }: { pkg: string }) => {
  if (pkg) {
    const { location, name } = yarnWorkspace(pkg)

    console.log(`Running Deplint for ${name}`)
    check({
      name, location, devDeps: true,
    })
  } else {
    const workspaces = yarnWorkspaces()

    console.log('Deplint Started...')

    let totalErrors = 0

    for (const workspace of workspaces) {
      totalErrors += check(workspace)
    }

    if (totalErrors > 0) {
      console.log(`Found ${chalk.red(totalErrors)} unlisted imports.`)
    } else {
      console.log(`No unlisted imports found. ${chalk.green('✔')}`)
    }
  }
  return 0
}
