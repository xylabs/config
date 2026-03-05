import fs from 'node:fs'

import { globSync } from 'glob'

import { getBasePackageName } from './getBasePackageName.ts'

const isExternalReference = (ref: string) => !ref.startsWith('.') && !ref.startsWith('/')

function parseExtendsField(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return []
}

export function getExtendsFromTsconfigs(location: string): string[] {
  const tsconfigFiles = globSync('./tsconfig*.json', { cwd: location, absolute: true })
  const packages = new Set<string>()

  for (const file of tsconfigFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      // Strip single-line comments (tsconfig allows them) and trailing commas before parsing
      const cleaned = content
        .replaceAll(/\/\/.*/g, '')
        .replaceAll(/,\s*([}\]])/g, '$1')
      const parsed = JSON.parse(cleaned)
      const refs = parseExtendsField(parsed.extends)
      for (const ref of refs) {
        if (isExternalReference(ref)) {
          packages.add(getBasePackageName(ref))
        }
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return [...packages]
}
