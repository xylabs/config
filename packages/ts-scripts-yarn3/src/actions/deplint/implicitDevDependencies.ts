export interface ImplicitDevDependencyRule {
  isNeeded: (context: ImplicitDepContext) => boolean
  package: string
}

export interface ImplicitDepContext {
  configFiles: string[]
  distFiles: string[]
  srcFiles: string[]
}

const hasFileWithExtension = (files: string[], extensions: string[]) =>
  files.some(f => extensions.some(ext => f.endsWith(ext)))

const rules: ImplicitDevDependencyRule[] = [
  {
    package: 'typescript',
    isNeeded: ({ srcFiles, configFiles }) =>
      hasFileWithExtension([...srcFiles, ...configFiles], ['.ts', '.tsx', '.mts', '.cts']),
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
