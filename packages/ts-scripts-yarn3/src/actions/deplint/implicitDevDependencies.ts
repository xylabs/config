import fs from 'node:fs'

import { findDepPackageJson } from './getRequiredPeerDependencies.ts'

export interface ImplicitDevDependencyRule {
  isNeeded: (context: ImplicitDepContext) => boolean
  package: string
}

export interface FileContext {
  allFiles: string[]
  distFiles: string[]
}

export interface ImplicitDepContext extends FileContext {
  allDependencies: string[]
  location: string
}

const hasFileWithExtension = (files: string[], extensions: string[]) =>
  files.some(f => extensions.some(ext => f.endsWith(ext)))

const tsExtensions = ['.ts', '.tsx', '.mts', '.cts']

const hasTypescriptFiles = ({ allFiles }: ImplicitDepContext) =>
  hasFileWithExtension(allFiles, tsExtensions)

// Matches decorator usage: @something at the start of a line (after optional whitespace).
// Safe from JSDoc false positives since those appear after * in comment blocks.
const decoratorPattern = /^\s*@[a-zA-Z]\w*/m

const hasDecorators = ({ allFiles }: ImplicitDepContext) =>
  allFiles
    .filter(f => tsExtensions.some(ext => f.endsWith(ext)))
    .some((file) => {
      try {
        const content = fs.readFileSync(file, 'utf8')
        return decoratorPattern.test(content)
      } catch {
        return false
      }
    })

const importPlugins = new Set(['eslint-plugin-import-x', 'eslint-plugin-import'])

/**
 * Checks whether any dependency (direct or transitive) pulls in
 * one of the eslint import plugins that require a resolver.
 */
function hasImportPlugin({ location, allDependencies }: ImplicitDepContext): boolean {
  // Direct dependency on the plugin
  if (allDependencies.some(d => importPlugins.has(d))) return true

  // Transitive: a dependency bundles the plugin as a dep or peer
  for (const dep of allDependencies) {
    const pkgPath = findDepPackageJson(location, dep)
    if (!pkgPath) continue
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      const transitiveDeps = [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ]
      if (transitiveDeps.some(d => importPlugins.has(d))) return true
    } catch {
      // skip unreadable packages
    }
  }
  return false
}

const hasVitest = ({ allDependencies }: ImplicitDepContext) =>
  allDependencies.includes('vitest')

const rules: ImplicitDevDependencyRule[] = [
  {
    package: 'typescript',
    isNeeded: hasTypescriptFiles,
  },
  {
    package: 'eslint-import-resolver-typescript',
    isNeeded: context =>
      hasTypescriptFiles(context)
      && context.allDependencies.includes('eslint')
      && hasImportPlugin(context),
  },
  {
    package: 'tslib',
    isNeeded: hasDecorators,
  },
  {
    package: '@vitest/coverage-v8',
    isNeeded: hasVitest,
  },
]

export function getImplicitDevDependencies(context: ImplicitDepContext): Set<string> {
  const implicit = new Set<string>()
  for (const rule of rules) {
    if (rule.isNeeded(context)) {
      implicit.add(rule.package)
    }
  }
  return implicit
}
