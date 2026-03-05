import fs from 'node:fs'
import path from 'node:path'

import { getBasePackageName } from './getBasePackageName.ts'
import { findDepPackageJson } from './getRequiredPeerDependencies.ts'

function getBinNames(location: string, dep: string): string[] {
  const depPkgPath = findDepPackageJson(location, dep)
  if (!depPkgPath) return []
  try {
    const raw = fs.readFileSync(depPkgPath, 'utf8')
    const pkg = JSON.parse(raw)
    if (!pkg.bin) return []
    if (typeof pkg.bin === 'string') return [pkg.name?.split('/').pop() ?? dep]
    return Object.keys(pkg.bin)
  } catch {
    return []
  }
}

function tokenizeScript(script: string): string[] {
  // Split on shell operators and whitespace to get command tokens
  return script
    .split(/[&|;$()"`\s]+/)
    .map(t => t.trim())
    .filter(Boolean)
}

/**
 * Scans package.json scripts for references to installed packages,
 * either by package name or by binary name they provide.
 */
export function getScriptReferencedPackages(
  location: string,
  allDeps: string[],
): Set<string> {
  const pkgPath = path.join(location, 'package.json')
  let scripts: Record<string, string> = {}
  try {
    const raw = fs.readFileSync(pkgPath, 'utf8')
    const pkg = JSON.parse(raw)
    scripts = pkg.scripts ?? {}
  } catch {
    return new Set()
  }

  const scriptText = Object.values(scripts).join(' ')
  const tokens = new Set(tokenizeScript(scriptText))

  // Build a map from bin name -> package name
  const binToPackage = new Map<string, string>()
  for (const dep of allDeps) {
    const bins = getBinNames(location, dep)
    for (const bin of bins) {
      binToPackage.set(bin, dep)
    }
  }

  const referenced = new Set<string>()
  for (const token of tokens) {
    // Direct package name match (e.g. "yarn rimraf" -> token "rimraf")
    const baseName = getBasePackageName(token)
    if (allDeps.includes(baseName)) {
      referenced.add(baseName)
    }
    // Binary name match (e.g. "tsup" -> @xylabs/ts-scripts-yarn3 provides "tsup"? no, tsup provides "tsup")
    const pkg = binToPackage.get(token)
    if (pkg) {
      referenced.add(pkg)
    }
  }

  return referenced
}
