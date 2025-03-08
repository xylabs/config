import { getAllInputs } from './inputs.ts'
import type { EntryMode } from './XyConfig.ts'

export const buildEntries = (folder: string, entryMode: EntryMode = 'single', verbose = false) => {
  let entries: string[] = []
  switch (entryMode) {
    case 'platform': {
      entries = [`${folder}/index-node.ts`, `${folder}/index-browser.ts`]
      break
    }
    case 'all': {
      entries = getAllInputs(folder).filter(entry => !entry.includes('.spec.') && !entry.includes('.story.'))
      break
    }
    default: {
      entries = [`${folder}/index.ts`]
      break
    }
  }
  if (verbose) console.log(`buildEntries [${entryMode}] ${entries.length}`)
  return entries
}
