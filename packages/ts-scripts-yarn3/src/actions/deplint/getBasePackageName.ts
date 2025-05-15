export function getBasePackageName(importName: string) {
  const importNameScrubbed = importName.replaceAll('"', '').trim()
  if (importNameScrubbed.startsWith('@')) {
    const parts = importNameScrubbed.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importNameScrubbed
  }
  return importNameScrubbed.split('/')[0]
}
