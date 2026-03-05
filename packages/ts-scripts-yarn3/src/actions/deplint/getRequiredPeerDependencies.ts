import fs from 'node:fs'
import path from 'node:path'

export function findDepPackageJson(location: string, dep: string): string | undefined {
  let dir = location
  while (true) {
    const candidate = path.join(dir, 'node_modules', dep, 'package.json')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
}

/**
 * Collects the peerDependencies declared by all of a package's
 * dependencies and devDependencies. A devDependency that satisfies
 * one of these peer requirements should not be flagged as unused.
 */
export function getRequiredPeerDependencies(
  location: string,
  allDeps: string[],
): Set<string> {
  const required = new Set<string>()
  for (const dep of allDeps) {
    const depPkgPath = findDepPackageJson(location, dep)
    if (!depPkgPath) continue
    try {
      const raw = fs.readFileSync(depPkgPath, 'utf8')
      const pkg = JSON.parse(raw)
      if (pkg.peerDependencies) {
        for (const peer of Object.keys(pkg.peerDependencies)) {
          required.add(peer)
        }
      }
    } catch {
      // Package not readable — skip
    }
  }
  return required
}
