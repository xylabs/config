import { getAllInputs } from './inputs.ts'
import type { EntryMode } from './XyConfig.ts'

export const buildEntries = (folder: string, entryMode: EntryMode = 'single', excludeSpecAndStories = true, verbose = false) => {
  let entries: string[] = []
  switch (entryMode) {
    case 'platform': {
      entries = [`${folder}/index-node.ts`, `${folder}/index-browser.ts`]
      break
    }
    case 'all': {
      entries = excludeSpecAndStories ? getAllInputs(folder).filter(entry => !entry.includes('.spec.') && !entry.includes('.stories.')) : getAllInputs(folder)
      break
    }
    case 'custom': {
      entries = []
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
