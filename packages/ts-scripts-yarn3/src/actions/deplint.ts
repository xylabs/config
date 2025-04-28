/* eslint-disable complexity */
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

function getImportsFromFile(filePath: string, importPaths: Record<string, string[]>, typeImportPaths: Record<string, string[]>) {
  const sourceCode = fs.readFileSync(filePath, 'utf8')

  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  )

  const imports: string[] = []
  const typeImports: string[] = []

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier)?.getFullText()
      const isTypeImport = ts.isImportDeclaration(node) ? (node.importClause?.isTypeOnly ?? false) : false
      if (moduleSpecifier) {
        const trimmed = moduleSpecifier.split("'").at(1) ?? moduleSpecifier
        if (isTypeImport) {
          typeImports.push(trimmed)
        } else {
          imports.push(trimmed)
        }
      }
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [arg] = node.arguments
      if (ts.isStringLiteral(arg)) {
        const trimmed = arg.text
        imports.push(trimmed)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  const importsStartsWithExcludes = ['.', '#', 'node:']

  const cleanedImports = imports.filter(imp => !importsStartsWithExcludes.some(exc => imp.startsWith(exc))).map(getBasePackageName)
  const cleanedTypeImports = typeImports.filter(imp => !importsStartsWithExcludes.some(exc => imp.startsWith(exc))).map(getBasePackageName)

  for (const imp of cleanedImports) {
    importPaths[imp] = importPaths[imp] || []
    importPaths[imp].push(filePath)
  }

  for (const imp of cleanedTypeImports) {
    typeImportPaths[imp] = typeImportPaths[imp] || []
    typeImportPaths[imp].push(filePath)
  }

  return [cleanedImports, cleanedTypeImports]
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
  const prodTypeImportPaths: Record<string, string[]> = {}
  const prodImportPairs = prodSourceFiles.map(path => getImportsFromFile(path, prodImportPaths, prodTypeImportPaths))
  const prodImports = prodImportPairs.flatMap(pair => pair[0])
  const prodTypeImports = prodImportPairs.flatMap(pair => pair[1])

  const devImportPaths: Record<string, string[]> = {}
  const devTypeImportPaths: Record<string, string[]> = {}
  const devImportPairs = devSourceFiles.map(path => getImportsFromFile(path, devImportPaths, devTypeImportPaths))
  const devImports = devImportPairs.flatMap(pair => pair[0])
  const devTypeImports = devImportPairs.flatMap(pair => pair[1])

  const externalProdImports = prodImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  const externalProdTypeImports = prodTypeImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  const externalDevImports = devImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  return {
    prodImports, devImports, prodImportPaths, devImportPaths, externalProdImports, externalDevImports, prodTypeImports, devTypeImports, externalProdTypeImports,
  }
}

function check({
  name, location, devDeps = false, peerDeps = false,
}: { devDeps?: boolean; location: string; name: string; peerDeps?: boolean }) {
  const { prodSourceFiles, devSourceFiles } = findFiles(location)
  const {
    prodImportPaths, externalProdTypeImports, devImportPaths, externalProdImports, externalDevImports,
  } = getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles })

  const {
    dependencies, devDependencies, peerDependencies,
  } = getDependenciesFromPackageJson(`${location}/package.json`)

  let unlistedDependencies = 0
  let unlistedDevDependencies = 0
  let unusedDependencies = 0
  let typesInDependencies = 0

  for (const imp of externalProdTypeImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp) && !devDependencies.includes(imp) && !devDependencies.includes(`@types/${imp}`)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  for (const imp of externalProdImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  for (const dep of dependencies) {
    if (dep.startsWith('@types/')) {
      typesInDependencies++
      console.log(`[${chalk.blue(name)}] @types in dependencies in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
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

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + typesInDependencies

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
