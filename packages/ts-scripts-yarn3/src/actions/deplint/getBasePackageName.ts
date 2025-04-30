export function getBasePackageName(importName: string) {
  if (importName.startsWith('@')) {
    const parts = importName.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importName
  }
  return importName.split('/')[0]
}
